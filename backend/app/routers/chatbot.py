from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import openai
import os
from ..db import get_db
from ..models import Conversation as ConversationModel, ChatMessage as ChatMessageModel, User as UserModel
from ..schemas import Conversation, ChatMessage, ChatMessageCreate, ChatResponse, ConversationCreate
from ..auth import get_current_active_user

router = APIRouter()

# Initialize OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

SYSTEM_PROMPT = os.getenv(
    "CHATBOT_SYSTEM_PROMPT",
    "You are a helpful assistant for the University of Guelph Rocketry Club. You help students with questions about rocketry, engineering, club activities, and projects. Be encouraging, informative, and supportive. If you don't know specific details about the club, politely mention that and suggest they contact a team member directly."
)

@router.get("/conversations", response_model=List[Conversation])
def get_conversations(
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    conversations = db.query(ConversationModel).filter(
        ConversationModel.user_id == current_user.id
    ).order_by(ConversationModel.updated_at.desc()).all()
    return conversations

@router.post("/conversations", response_model=Conversation)
def create_conversation(
    conversation: ConversationCreate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_conversation = ConversationModel(
        user_id=current_user.id,
        title=conversation.title
    )
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation

@router.get("/conversations/{conversation_id}", response_model=Conversation)
def get_conversation(
    conversation_id: int,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    conversation = db.query(ConversationModel).filter(
        ConversationModel.id == conversation_id,
        ConversationModel.user_id == current_user.id
    ).first()
    
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return conversation

@router.post("/chat", response_model=ChatResponse)
async def send_message(
    message: ChatMessageCreate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get or create conversation
    if message.conversation_id:
        conversation = db.query(ConversationModel).filter(
            ConversationModel.id == message.conversation_id,
            ConversationModel.user_id == current_user.id
        ).first()
        if conversation is None:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        # Create new conversation
        conversation = ConversationModel(
            user_id=current_user.id,
            title=message.content[:50] + "..." if len(message.content) > 50 else message.content
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    # Save user message
    user_message = ChatMessageModel(
        conversation_id=conversation.id,
        content=message.content,
        is_user=True
    )
    db.add(user_message)
    db.commit()
    
    try:
        # Get conversation history for context
        recent_messages = db.query(ChatMessageModel).filter(
            ChatMessageModel.conversation_id == conversation.id
        ).order_by(ChatMessageModel.timestamp.desc()).limit(10).all()
        
        # Build messages for OpenAI
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Add recent conversation history (in chronological order)
        for msg in reversed(recent_messages[1:]):  # Skip the message we just added
            role = "user" if msg.is_user else "assistant"
            messages.append({"role": role, "content": msg.content})
        
        # Add the current user message
        messages.append({"role": "user", "content": message.content})
        
        # Get AI response
        response = await openai.ChatCompletion.acreate(
            model=os.getenv("CHATBOT_MODEL", "gpt-3.5-turbo"),
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        ai_response_content = response.choices[0].message.content
        
    except Exception as e:
        print(f"OpenAI API error: {e}")
        ai_response_content = ("I apologize, but I'm having trouble connecting to my knowledge base right now. "
                             "Please try again in a moment, or feel free to contact a team member directly for assistance!")
    
    # Save AI response
    ai_message = ChatMessageModel(
        conversation_id=conversation.id,
        content=ai_response_content,
        is_user=False
    )
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)
    
    # Update conversation timestamp
    conversation.updated_at = ai_message.timestamp
    db.commit()
    db.refresh(conversation)
    
    return ChatResponse(message=ai_message, conversation=conversation)

@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    conversation = db.query(ConversationModel).filter(
        ConversationModel.id == conversation_id,
        ConversationModel.user_id == current_user.id
    ).first()
    
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Delete all messages in the conversation
    db.query(ChatMessageModel).filter(
        ChatMessageModel.conversation_id == conversation_id
    ).delete()
    
    # Delete the conversation
    db.delete(conversation)
    db.commit()
    
    return {"message": "Conversation deleted successfully"}

@router.get("/conversations/{conversation_id}/messages", response_model=List[ChatMessage])
def get_conversation_messages(
    conversation_id: int,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    conversation = db.query(ConversationModel).filter(
        ConversationModel.id == conversation_id,
        ConversationModel.user_id == current_user.id
    ).first()
    
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.query(ChatMessageModel).filter(
        ChatMessageModel.conversation_id == conversation_id
    ).order_by(ChatMessageModel.timestamp.asc()).all()
    
    return messages