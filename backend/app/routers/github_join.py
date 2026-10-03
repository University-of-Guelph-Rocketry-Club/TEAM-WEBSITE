"""Self-serve GitHub org invites.

Flow: the /join page posts the club join code here -> we check it and send the
person to GitHub sign-in -> GitHub redirects to /callback with their identity ->
we invite them to the org with an admin token -> back to /join with a status.

Required env vars:
  GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET  OAuth App (callback: <BACKEND_BASE_URL>/api/github/callback)
  GITHUB_ORG_ADMIN_TOKEN                  fine-grained token, Organization > Members: read & write
  GITHUB_ORG                              org login
  GITHUB_JOIN_CODE                        code shared with members
  GITHUB_JOIN_SECRET                      random 32+ char string for signing state
  BACKEND_BASE_URL                        this API's public origin, no trailing slash
  FRONTEND_BASE_URL                       site origin, no trailing slash
Optional:
  GITHUB_TEAM_SLUG                        also add people to this team
"""

import base64
import hashlib
import hmac
import json
import logging
import os
import secrets
import time
from urllib.parse import parse_qs, quote, urlencode

import httpx
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse

router = APIRouter()
log = logging.getLogger(__name__)

GH_API = "https://api.github.com"
COOKIE = "gh_join_nonce"
COOKIE_PATH = "/api/github"
STATE_TTL = 600  # seconds


def _env(name: str) -> str:
    value = os.getenv(name, "")
    if not value:
        raise RuntimeError(f"{name} is not set")
    return value


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _unb64(data: str) -> bytes:
    return base64.urlsafe_b64decode(data + "=" * (-len(data) % 4))


def _sign(payload: str) -> str:
    secret = _env("GITHUB_JOIN_SECRET").encode()
    return _b64(hmac.new(secret, payload.encode(), hashlib.sha256).digest())


def _make_state() -> tuple[str, str]:
    nonce = secrets.token_urlsafe(16)
    payload = _b64(json.dumps({"n": nonce, "exp": time.time() + STATE_TTL}).encode())
    return f"{payload}.{_sign(payload)}", nonce


def _read_state(state: str | None) -> dict | None:
    if not state or "." not in state:
        return None
    payload, sig = state.split(".", 1)
    if not hmac.compare_digest(sig, _sign(payload)):
        return None
    try:
        data = json.loads(_unb64(payload))
    except ValueError:
        return None
    return data if time.time() < data.get("exp", 0) else None


def _codes_match(given: str, expected: str) -> bool:
    a = hashlib.sha256(given.encode()).digest()
    b = hashlib.sha256(expected.encode()).digest()
    return hmac.compare_digest(a, b)


def _back_to_site(status: str, user: str | None = None) -> RedirectResponse:
    query = f"github={status}" + (f"&u={quote(user)}" if user else "")
    resp = RedirectResponse(f"{_env('FRONTEND_BASE_URL')}/join?{query}#github", status_code=303)
    resp.delete_cookie(COOKIE, path=COOKIE_PATH)
    return resp


def _gh_headers(token: str) -> dict:
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


@router.post("/join")
async def start_join(request: Request):
    # Parse the form body by hand so we don't need python-multipart.
    form = parse_qs((await request.body()).decode())
    code = (form.get("code") or [""])[0].strip()

    if not _codes_match(code, _env("GITHUB_JOIN_CODE")):
        return _back_to_site("badcode")

    state, nonce = _make_state()
    params = urlencode({
        "client_id": _env("GITHUB_CLIENT_ID"),
        "redirect_uri": f"{_env('BACKEND_BASE_URL')}/api/github/callback",
        "state": state,
        "allow_signup": "true",
    })
    resp = RedirectResponse(f"https://github.com/login/oauth/authorize?{params}", status_code=303)
    resp.set_cookie(
        COOKIE, nonce, max_age=STATE_TTL, path=COOKIE_PATH,
        httponly=True, secure=True, samesite="lax",
    )
    return resp


@router.get("/callback")
async def finish_join(request: Request, code: str | None = None, state: str | None = None):
    data = _read_state(state)
    nonce = request.cookies.get(COOKIE)
    # State must be ours, unexpired, and tied to this browser.
    if not code or not data or not nonce or not hmac.compare_digest(data["n"], nonce):
        return _back_to_site("expired")

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            # 1. Exchange the code for a user token (no scopes: public profile only).
            token_res = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                json={
                    "client_id": _env("GITHUB_CLIENT_ID"),
                    "client_secret": _env("GITHUB_CLIENT_SECRET"),
                    "code": code,
                    "redirect_uri": f"{_env('BACKEND_BASE_URL')}/api/github/callback",
                },
            )
            access_token = token_res.json().get("access_token")
            if not access_token:
                return _back_to_site("expired")

            # 2. Who signed in?
            user_res = await client.get(f"{GH_API}/user", headers=_gh_headers(access_token))
            user_res.raise_for_status()
            login = user_res.json()["login"]

            # 3. Invite. A team invite also invites to the org.
            org = _env("GITHUB_ORG")
            team = os.getenv("GITHUB_TEAM_SLUG")
            url = (
                f"{GH_API}/orgs/{org}/teams/{team}/memberships/{login}"
                if team else f"{GH_API}/orgs/{org}/memberships/{login}"
            )
            invite_res = await client.put(
                url, headers=_gh_headers(_env("GITHUB_ORG_ADMIN_TOKEN")), json={"role": "member"}
            )
            if invite_res.status_code >= 400:
                log.error("GitHub invite failed for %s: %s %s", login, invite_res.status_code, invite_res.text)
                return _back_to_site("error", login)

            status = "member" if invite_res.json().get("state") == "active" else "invited"
            return _back_to_site(status, login)
    except Exception:
        log.exception("GitHub join flow failed")
        return _back_to_site("error")
