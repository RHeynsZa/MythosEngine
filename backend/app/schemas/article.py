from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.article import ArticleContent


class ArticleBase(BaseModel):
    title: str
    content: Optional[ArticleContent] = None
    article_type: str = "general"
    project_id: int


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[ArticleContent] = None
    article_type: Optional[str] = None


class Article(ArticleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True