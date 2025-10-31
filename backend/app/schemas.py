from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# Authentication schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    student_id: Optional[str] = None
    program: Optional[str] = None
    year: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

# Team schemas
class TeamBase(BaseModel):
    name: str
    description: str

class TeamCreate(TeamBase):
    team_lead_id: Optional[int] = None

class Team(TeamBase):
    id: int
    team_lead_id: Optional[int] = None
    created_at: datetime
    members: List[User] = []
    
    class Config:
        orm_mode = True

class ProjectBase(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    status: str
    team_id: Optional[int] = None
    progress_percentage: int = 0
    priority: str = "medium"
    due_date: Optional[datetime] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class NewsBase(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

class NewsCreate(NewsBase):
    pass

class NewsArticle(NewsBase):
    id: int
    published_at: datetime
    
    class Config:
        orm_mode = True

class ExecutiveBase(BaseModel):
    name: str
    position: str
    bio: str
    image_url: Optional[str] = None
    email: Optional[str] = None

class ExecutiveCreate(ExecutiveBase):
    pass

class Executive(ExecutiveBase):
    id: int
    
    class Config:
        orm_mode = True

class SponsorBase(BaseModel):
    name: str
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    tier: str

class SponsorCreate(SponsorBase):
    pass

class Sponsor(SponsorBase):
    id: int
    
    class Config:
        orm_mode = True

class SponsorInquiryBase(BaseModel):
    company_name: str
    contact_name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class SponsorInquiryCreate(SponsorInquiryBase):
    pass

class SponsorInquiry(SponsorInquiryBase):
    id: int
    created_at: datetime
    status: str
    
    class Config:
        orm_mode = True

class ContactMessageBase(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessage(ContactMessageBase):
    id: int
    created_at: datetime
    status: str
    
    class Config:
        orm_mode = True

# Project Update schemas
class ProjectUpdateBase(BaseModel):
    title: str
    content: str
    update_type: str  # "progress", "milestone", "issue", "announcement"
    progress_change: int = 0
    images: Optional[str] = None

class ProjectUpdateCreate(ProjectUpdateBase):
    project_id: int

class ProjectUpdate(ProjectUpdateBase):
    id: int
    project_id: int
    team_id: int
    author_id: int
    created_at: datetime
    author: User
    
    class Config:
        orm_mode = True

# Chatbot schemas
class ChatMessageBase(BaseModel):
    content: str

class ChatMessageCreate(ChatMessageBase):
    conversation_id: Optional[int] = None

class ChatMessage(ChatMessageBase):
    id: int
    conversation_id: int
    is_user: bool
    timestamp: datetime
    
    class Config:
        from_attributes = True  # Updated from orm_mode = True for Pydantic v2

class ConversationBase(BaseModel):
    title: str = "New Conversation"

class ConversationCreate(ConversationBase):
    pass

class Conversation(ConversationBase):
    id: int
    user_id: Optional[int] = None  # Make user_id optional
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessage] = []
    
    class Config:
        from_attributes = True  # Updated from orm_mode = True for Pydantic v2

class ChatResponse(BaseModel):
    message: ChatMessage
    conversation: Conversation