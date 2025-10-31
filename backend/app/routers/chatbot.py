from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from openai import AsyncOpenAI  # Update import
import os
from ..db import get_db
from ..models import Conversation as ConversationModel, ChatMessage as ChatMessageModel, User as UserModel
from ..schemas import Conversation, ChatMessage, ChatMessageCreate, ChatResponse, ConversationCreate
from ..auth import get_current_active_user
from .team_info import TEAM_MEMBERS_INFO, PAGE_INFO
from datetime import datetime, timezone

router = APIRouter()

# Initialize OpenAI client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # Update client initialization

SYSTEM_PROMPT = os.getenv(
    "CHATBOT_SYSTEM_PROMPT"
)

def get_team_context():
    """Generate context about team members for the chatbot"""
    context = "Team Information:\n\n"
    for exec in TEAM_MEMBERS_INFO["executives"]:
        context += f"- {exec['name']} ({exec['role']}): {exec['bio']}\n"
    return context

def get_page_context():
    """Generate context about website pages (anchors open in new tab to avoid reloading SPA)"""
    base = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")
    context = "Available Pages:\n\n"
    for key, info in PAGE_INFO.items():
        url = info.get("url") or (base.rstrip("/") + info.get("path", "/"))
        context += (
            f"- {info['description']}: "
            f"<a href='{url}' target='_blank' rel='noopener noreferrer' "
            f"class='text-primary-600 hover:text-primary-800 transition-colors'>{key.title()}</a>\n"
        )
    return context

@router.get("/conversations", response_model=List[Conversation])
def get_conversations(
    # Remove authentication requirement
    # current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Return all conversations or empty list
    conversations = db.query(ConversationModel).order_by(ConversationModel.updated_at.desc()).all()
    return conversations

@router.post("/conversations", response_model=Conversation)
def create_conversation(
    conversation: ConversationCreate,
    # Remove authentication requirement
    # current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_conversation = ConversationModel(
        user_id=None,  # Anonymous conversation
        title=conversation.title
    )
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation

@router.get("/conversations/{conversation_id}", response_model=Conversation)
def get_conversation(
    conversation_id: int,
    # Remove authentication requirement
    # current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    conversation = db.query(ConversationModel).filter(
        ConversationModel.id == conversation_id
    ).first()
    
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Load messages explicitly and serialize to plain structures so Pydantic accepts them
    messages = db.query(ChatMessageModel).filter(
        ChatMessageModel.conversation_id == conversation_id
    ).order_by(ChatMessageModel.timestamp.asc()).all()

    message_list = []
    for m in messages:
        message_list.append({
            "id": m.id,
            "conversation_id": m.conversation_id,
            "content": m.content,
            "is_user": m.is_user,
            "timestamp": m.timestamp
        })

    conversation_dict = {
        "id": conversation.id,
        "title": conversation.title,
        "user_id": conversation.user_id,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "messages": message_list
    }

    return conversation_dict

@router.post("/chat", response_model=ChatResponse)
async def send_message(
    message: ChatMessageCreate,
    db: Session = Depends(get_db)
):
    try:
        # Find or create conversation first
        conversation = None
        if message.conversation_id:
            conversation = db.query(ConversationModel).get(message.conversation_id)

        if not conversation:
            # Create new conversation for anonymous user
            conversation = ConversationModel(
                title="New Conversation",
                user_id=None
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)

        # --- NEW: persist the user's message so conversation history includes user messages ---
        user_msg = ChatMessageModel(
            conversation_id=conversation.id,
            content=message.content,
            is_user=True,
            timestamp=datetime.now(timezone.utc)
        )
        db.add(user_msg)
        db.commit()
        db.refresh(user_msg)
        # -------------------------------------------------------------------------------

        # After conversation is defined, create system message and handle chat
        system_message = {
            "role": "system",
            "content": f"""You are the University of Guelph Rocketry Club's AI assistant. 
            When referring to pages, use HTML anchor tags with this format:
            <a href='/page-path' class='text-primary-600 hover:text-primary-800 transition-colors'>Link Text</a>

            For example: To view our projects, visit <a href='/projects' class='text-primary-600 hover:text-primary-800 transition-colors'>Projects page</a>.

            {get_team_context()}
            {get_page_context()}

            Always use HTML anchor tags for links, not markdown or plain URLs."""
        }

        messages = [system_message]

        # Add recent conversation history (including the user message we just saved)
        recent_messages = db.query(ChatMessageModel).filter(
            ChatMessageModel.conversation_id == conversation.id
        ).order_by(ChatMessageModel.timestamp.desc()).limit(10).all()

        for msg in reversed(recent_messages):
            role = "user" if msg.is_user else "assistant"
            messages.append({"role": role, "content": msg.content})

        # Add the current user message (already saved; ok to append again)
        messages.append({"role": "user", "content": message.content})

        # Call OpenAI
        response = await client.chat.completions.create(
            model=os.getenv("CHATBOT_MODEL", "gpt-3.5-turbo"),
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )

        ai_response_content = response.choices[0].message.content

        # Use UTC timestamp for consistency
        current_time = datetime.now(timezone.utc)

        ai_message = ChatMessageModel(
            conversation_id=conversation.id,
            content=ai_response_content,
            is_user=False,
            timestamp=current_time
        )
        db.add(ai_message)
        db.commit()
        db.refresh(ai_message)

        # Update conversation timestamp
        conversation.updated_at = ai_message.timestamp
        db.commit()
        db.refresh(conversation)

        # Build response objects: return ai message and full conversation messages (plain dicts)
        messages_for_response = db.query(ChatMessageModel).filter(
            ChatMessageModel.conversation_id == conversation.id
        ).order_by(ChatMessageModel.timestamp.asc()).all()

        message_list = [
            {
                "id": m.id,
                "conversation_id": m.conversation_id,
                "content": m.content,
                "is_user": m.is_user,
                "timestamp": m.timestamp.isoformat()  # return ISO string
            } for m in messages_for_response
        ]

        conversation_dict = {
            "id": conversation.id,
            "title": conversation.title,
            "user_id": conversation.user_id,
            "created_at": conversation.created_at.isoformat(),
            "updated_at": conversation.updated_at.isoformat(),
            "messages": message_list
        }

        ai_message_dict = {
            "id": ai_message.id,
            "conversation_id": ai_message.conversation_id,
            "content": ai_message.content,
            "is_user": ai_message.is_user,
            "timestamp": ai_message.timestamp.isoformat()
        }

        return {"message": ai_message_dict, "conversation": conversation_dict}

    except Exception as e:
        print(f"Detailed error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    # Remove authentication requirement
    # current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    conversation = db.query(ConversationModel).filter(
        ConversationModel.id == conversation_id
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
    # Remove auth requirement so anonymous usage works
    # current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    conversation = db.query(ConversationModel).filter(
        ConversationModel.id == conversation_id
    ).first()
    
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.query(ChatMessageModel).filter(
        ChatMessageModel.conversation_id == conversation_id
    ).order_by(ChatMessageModel.timestamp.asc()).all()
    
    # return list of plain dicts (Pydantic will parse)
    return [
        {
            "id": m.id,
            "conversation_id": m.conversation_id,
            "content": m.content,
            "is_user": m.is_user,
            "timestamp": m.timestamp
        } for m in messages
    ]