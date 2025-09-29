from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models import Executive as ExecutiveModel
from ..schemas import Executive, ExecutiveCreate

router = APIRouter()

@router.get("/", response_model=List[Executive])
def get_executives(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    execs = db.query(ExecutiveModel).offset(skip).limit(limit).all()
    return execs

@router.get("/{exec_id}", response_model=Executive)
def get_executive(exec_id: int, db: Session = Depends(get_db)):
    exec = db.query(ExecutiveModel).filter(ExecutiveModel.id == exec_id).first()
    if exec is None:
        raise HTTPException(status_code=404, detail="Executive not found")
    return exec

@router.post("/", response_model=Executive)
def create_executive(exec: ExecutiveCreate, db: Session = Depends(get_db)):
    db_exec = ExecutiveModel(**exec.dict())
    db.add(db_exec)
    db.commit()
    db.refresh(db_exec)
    return db_exec