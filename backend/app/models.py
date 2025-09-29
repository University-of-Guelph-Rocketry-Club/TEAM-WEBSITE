from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .db import Base

# Association table for many-to-many relationship between users and teams
user_team_association = Table(
    'user_teams',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('team_id', Integer, ForeignKey('teams.id'))
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    student_id = Column(String)
    program = Column(String)
    year = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    teams = relationship("Team", secondary=user_team_association, back_populates="members")
    project_updates = relationship("ProjectUpdate", back_populates="author")
    conversations = relationship("Conversation", back_populates="user")

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)  # e.g., "Propulsion Team", "Avionics Team"
    description = Column(Text)
    team_lead_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    members = relationship("User", secondary=user_team_association, back_populates="teams")
    team_lead = relationship("User", foreign_keys=[team_lead_id])
    projects = relationship("Project", back_populates="team")
    project_updates = relationship("ProjectUpdate", back_populates="team")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    image_url = Column(String)
    status = Column(String)  # "active", "completed", "planned"
    team_id = Column(Integer, ForeignKey('teams.id'))
    progress_percentage = Column(Integer, default=0)
    priority = Column(String, default="medium")  # "low", "medium", "high", "critical"
    due_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    team = relationship("Team", back_populates="projects")
    updates = relationship("ProjectUpdate", back_populates="project")

class NewsArticle(Base):
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    image_url = Column(String)
    published_at = Column(DateTime(timezone=True), server_default=func.now())

class Executive(Base):
    __tablename__ = "executives"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    position = Column(String)
    bio = Column(Text)
    image_url = Column(String)
    email = Column(String)

class Sponsor(Base):
    __tablename__ = "sponsors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    logo_url = Column(String)
    website_url = Column(String)
    tier = Column(String)  # "gold", "silver", "bronze"

class SponsorInquiry(Base):
    __tablename__ = "sponsor_inquiries"
    
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, index=True)
    contact_name = Column(String)
    email = Column(String)
    phone = Column(String)
    message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="pending")  # "pending", "contacted", "closed"

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    subject = Column(String)
    message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="unread")  # "unread", "read", "replied"

class ProjectUpdate(Base):
    __tablename__ = "project_updates"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    team_id = Column(Integer, ForeignKey('teams.id'))
    author_id = Column(Integer, ForeignKey('users.id'))
    title = Column(String)
    content = Column(Text)
    update_type = Column(String)  # "progress", "milestone", "issue", "announcement"
    progress_change = Column(Integer, default=0)  # Change in progress percentage
    images = Column(Text)  # JSON string of image URLs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="updates")
    team = relationship("Team", back_populates="project_updates")
    author = relationship("User", back_populates="project_updates")

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    title = Column(String, default="New Conversation")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("ChatMessage", back_populates="conversation")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey('conversations.id'))
    content = Column(Text)
    is_user = Column(Boolean)  # True if user message, False if AI response
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")