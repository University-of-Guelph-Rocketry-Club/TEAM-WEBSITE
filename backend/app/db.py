from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Use /tmp for SQLite on Vercel (serverless has read-only filesystem except /tmp)
def get_database_url():
    url = os.getenv("DATABASE_URL", "")
    if url:
        return url
    # Default to /tmp for Vercel compatibility
    if os.getenv("VERCEL"):
        return "sqlite:////tmp/chatbot.db"
    return "sqlite:///./chatbot.db"

DATABASE_URL = get_database_url()

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()