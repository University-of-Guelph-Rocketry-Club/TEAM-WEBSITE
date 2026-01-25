from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Chatbot schemas - Simplified for chatbot-only backend

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
        from_attributes = True

class ConversationBase(BaseModel):
    title: str = "New Conversation"

class ConversationCreate(ConversationBase):
    pass

class Conversation(ConversationBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessage] = []
    
    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    message: ChatMessage
    conversation: Conversation
    admin_mode: Optional[bool] = False
    admin_info: Optional[dict] = None