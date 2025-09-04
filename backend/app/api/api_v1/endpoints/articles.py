from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.schemas.article import Article, ArticleCreate, ArticleUpdate
from app.services.container import get_services, ServiceContainer

router = APIRouter()


@router.get("/", response_model=List[Article])
def get_articles(project_id: Optional[int] = None, skip: int = 0, limit: int = 100, services: ServiceContainer = Depends(get_services)):
    """Get all articles, optionally filtered by project"""
    articles = services.articles.get_articles(project_id=project_id, skip=skip, limit=limit)
    return articles


@router.post("/", response_model=Article)
def create_article(article: ArticleCreate, services: ServiceContainer = Depends(get_services)):
    """Create a new article"""
    return services.articles.create_article(article)


@router.get("/{article_id}", response_model=Article)
def get_article(article_id: int, services: ServiceContainer = Depends(get_services)):
    """Get a specific article by ID"""
    article = services.articles.get_article(article_id=article_id)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.put("/{article_id}", response_model=Article)
def update_article(article_id: int, article: ArticleUpdate, services: ServiceContainer = Depends(get_services)):
    """Update an article"""
    db_article = services.articles.get_article(article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return services.articles.update_article(article_id=article_id, article_data=article)


@router.delete("/{article_id}")
def delete_article(article_id: int, services: ServiceContainer = Depends(get_services)):
    """Delete an article"""
    db_article = services.articles.get_article(article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    services.articles.delete_article(article_id=article_id)
    return {"message": "Article deleted successfully"}
