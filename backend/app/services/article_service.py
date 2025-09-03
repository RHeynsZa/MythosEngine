from sqlalchemy.orm import Session
from app.models.article import Article, ArticleContent
from app.schemas.article import ArticleCreate, ArticleUpdate
from typing import Optional


def get_article(db: Session, article_id: int):
    return db.query(Article).filter(Article.id == article_id).first()


def get_articles(db: Session, project_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(Article)
    if project_id:
        query = query.filter(Article.project_id == project_id)
    return query.offset(skip).limit(limit).all()


def create_article(db: Session, article: ArticleCreate):
    article_data = article.dict()
    # Convert ArticleContent pydantic model to dict for JSONB storage
    if article_data.get('content') and isinstance(article_data['content'], ArticleContent):
        article_data['content'] = article_data['content'].dict()
    elif article_data.get('content') is None:
        article_data['content'] = {}
    
    db_article = Article(**article_data)
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article


def update_article(db: Session, article_id: int, article: ArticleUpdate):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if db_article:
        update_data = article.dict(exclude_unset=True)
        # Convert ArticleContent pydantic model to dict for JSONB storage
        if 'content' in update_data and isinstance(update_data['content'], ArticleContent):
            update_data['content'] = update_data['content'].dict()
        
        for key, value in update_data.items():
            setattr(db_article, key, value)
        db.commit()
        db.refresh(db_article)
    return db_article


def delete_article(db: Session, article_id: int):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if db_article:
        db.delete(db_article)
        db.commit()
    return db_article