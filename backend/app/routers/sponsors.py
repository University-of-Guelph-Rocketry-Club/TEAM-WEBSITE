from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models import Sponsor as SponsorModel
from ..schemas import Sponsor, SponsorCreate

router = APIRouter()

@router.get("/", response_model=List[Sponsor])
def get_sponsors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sponsors = db.query(SponsorModel).offset(skip).limit(limit).all()
    return sponsors

@router.get("/{sponsor_id}", response_model=Sponsor)
def get_sponsor(sponsor_id: int, db: Session = Depends(get_db)):
    sponsor = db.query(SponsorModel).filter(SponsorModel.id == sponsor_id).first()
    if sponsor is None:
        raise HTTPException(status_code=404, detail="Sponsor not found")
    return sponsor

@router.post("/", response_model=Sponsor)
def create_sponsor(sponsor: SponsorCreate, db: Session = Depends(get_db)):
    db_sponsor = SponsorModel(**sponsor.dict())
    db.add(db_sponsor)
    db.commit()
    db.refresh(db_sponsor)
    return db_sponsor