from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.article import Article, ArticleCreate, ArticleUpdate
from app.services import article_service

router = APIRouter()


@router.get("/", response_model=List[Article])
def get_articles(project_id: int = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all articles, optionally filtered by project"""
    articles = article_service.get_articles(db, project_id=project_id, skip=skip, limit=limit)
    return articles


@router.post("/", response_model=Article)
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    """Create a new article"""
    return article_service.create_article(db=db, article=article)


@router.get("/{article_id}", response_model=Article)
def get_article(article_id: int, db: Session = Depends(get_db)):
    """Get a specific article by ID"""
    article = article_service.get_article(db, article_id=article_id)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.put("/{article_id}", response_model=Article)
def update_article(article_id: int, article: ArticleUpdate, db: Session = Depends(get_db)):
    """Update an article"""
    db_article = article_service.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article_service.update_article(db=db, article_id=article_id, article=article)


@router.delete("/{article_id}")
def delete_article(article_id: int, db: Session = Depends(get_db)):
    """Delete an article"""
    db_article = article_service.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    article_service.delete_article(db=db, article_id=article_id)
    return {"message": "Article deleted successfully"}