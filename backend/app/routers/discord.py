from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

router = APIRouter()

class DiscordInvite(BaseModel):
    invite_url: str
    expires_at: str = None

@router.get("/invite", response_model=DiscordInvite)
def get_discord_invite():
    # In a real implementation, you would generate dynamic Discord invites
    # For now, return a static invite link
    discord_invite_url = os.getenv("DISCORD_INVITE_URL", "https://discord.gg/rocketryguelph")
    
    return DiscordInvite(
        invite_url=discord_invite_url,
        expires_at=None  # Set to None for permanent links
    )

@router.post("/join-request")
def submit_join_request(name: str, email: str, year: str, program: str, why_join: str):
    # This endpoint could store join requests in the database
    # and notify administrators
    
    # For now, just return a success message
    return {
        "message": "Join request submitted successfully! You will be contacted soon.",
        "data": {
            "name": name,
            "email": email,
            "year": year,
            "program": program,
            "why_join": why_join
        }
    }