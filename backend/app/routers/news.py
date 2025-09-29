from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from ..models import NewsArticle as NewsModel
from ..schemas import NewsArticle, NewsCreate

router = APIRouter()

@router.get("/", response_model=List[NewsArticle])
def get_news(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    news = db.query(NewsModel).order_by(NewsModel.published_at.desc()).offset(skip).limit(limit).all()
    return news

@router.get("/{news_id}", response_model=NewsArticle)
def get_news_article(news_id: int, db: Session = Depends(get_db)):
    article = db.query(NewsModel).filter(NewsModel.id == news_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="News article not found")
    return article

@router.post("/", response_model=NewsArticle)
def create_news_article(article: NewsCreate, db: Session = Depends(get_db)):
    db_article = NewsModel(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article