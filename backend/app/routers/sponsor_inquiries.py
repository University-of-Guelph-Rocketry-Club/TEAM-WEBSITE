from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models import SponsorInquiry as SponsorInquiryModel
from ..schemas import SponsorInquiry, SponsorInquiryCreate
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter()

def send_sponsor_inquiry_notification(inquiry_data: SponsorInquiryCreate):
    """Send email notification for new sponsor inquiry"""
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
        msg['Subject'] = f"New Sponsor Inquiry: {inquiry_data.company_name}"
        
        body = f"""
        New sponsor inquiry received:
        
        Company: {inquiry_data.company_name}
        Contact Person: {inquiry_data.contact_name}
        Email: {inquiry_data.email}
        Phone: {inquiry_data.phone or 'Not provided'}
        
        Message:
        {inquiry_data.message}
        
        Please follow up with this potential sponsor.
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Failed to send sponsor inquiry email: {e}")
        return False

@router.post("/", response_model=SponsorInquiry)
def create_sponsor_inquiry(
    inquiry: SponsorInquiryCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    db_inquiry = SponsorInquiryModel(**inquiry.dict())
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    
    # Send email notification in background
    background_tasks.add_task(send_sponsor_inquiry_notification, inquiry)
    
    return db_inquiry

@router.get("/", response_model=List[SponsorInquiry])
def get_sponsor_inquiries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    inquiries = db.query(SponsorInquiryModel).order_by(SponsorInquiryModel.created_at.desc()).offset(skip).limit(limit).all()
    return inquiries

@router.patch("/{inquiry_id}/status")
def update_inquiry_status(inquiry_id: int, status: str, db: Session = Depends(get_db)):
    inquiry = db.query(SponsorInquiryModel).filter(SponsorInquiryModel.id == inquiry_id).first()
    if inquiry is None:
        raise HTTPException(status_code=404, detail="Sponsor inquiry not found")
    
    inquiry.status = status
    db.commit()
    return {"message": "Status updated successfully"}