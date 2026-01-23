from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chatbot
from app.db import engine, Base
import os
from dotenv import load_dotenv

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="University of Guelph Rocketry Club Chatbot API")

# Configure CORS - Allow all origins for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include only the chatbot router
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["chatbot"])

@app.get("/")
def read_root():
    return {"message": "University of Guelph Rocketry Club Chatbot API"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}