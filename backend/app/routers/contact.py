from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models import ContactMessage as ContactModel
from ..schemas import ContactMessage, ContactMessageCreate
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter()

def send_email_notification(contact_data: ContactMessageCreate):
    """Send email notification for new contact message"""
    try:
        smtp_server = os.getenv("SMTP_SERVER")
        smtp_port = int(os.getenv("SMTP_PORT", 587))
        smtp_username = os.getenv("SMTP_USERNAME")
        smtp_password = os.getenv("SMTP_PASSWORD")
        contact_email_to = os.getenv("CONTACT_EMAIL_TO")
        
        if not all([smtp_server, smtp_username, smtp_password, contact_email_to]):
            return False
            
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = contact_email_to
        msg['Subject'] = f"New Contact Form Submission: {contact_data.subject}"
        
        body = f"""
        New contact form submission:
        
        Name: {contact_data.name}
        Email: {contact_data.email}
        Subject: {contact_data.subject}
        
        Message:
        {contact_data.message}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

@router.post("/", response_model=ContactMessage)
def create_contact_message(
    message: ContactMessageCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    db_message = ContactModel(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Send email notification in background
    background_tasks.add_task(send_email_notification, message)
    
    return db_message

@router.get("/", response_model=List[ContactMessage])
def get_contact_messages(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    messages = db.query(ContactModel).order_by(ContactModel.created_at.desc()).offset(skip).limit(limit).all()
    return messages