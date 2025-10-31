from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    projects, news, contact, execs, sponsors, sponsor_inquiries, 
    discord, auth, teams, project_updates, chatbot
)
from app.db import engine, Base
import os
from dotenv import load_dotenv

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="University of Guelph Rocketry Club API")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(news.router, prefix="/api/news", tags=["news"])
app.include_router(contact.router, prefix="/api/contact", tags=["contact"])
app.include_router(execs.router, prefix="/api/execs", tags=["executives"])
app.include_router(sponsors.router, prefix="/api/sponsors", tags=["sponsors"])
app.include_router(sponsor_inquiries.router, prefix="/api/sponsor-inquiries", tags=["sponsor-inquiries"])
app.include_router(discord.router, prefix="/api/discord", tags=["discord"])
app.include_router(teams.router, prefix="/api/teams", tags=["teams"])
app.include_router(project_updates.router, prefix="/api/project-updates", tags=["project-updates"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["chatbot"])

@app.get("/")
def read_root():
    return {"message": "University of Guelph Rocketry Club API"}