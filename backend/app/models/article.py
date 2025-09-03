from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from pydantic import BaseModel
from typing import List, Optional
from app.db.database import Base


class ArticleContent(BaseModel):
    """Pydantic model for article JSONB content structure"""
    main_content: Optional[str] = None
    sidebar_content: Optional[str] = None
    footer_content: Optional[str] = None
    summary: Optional[str] = None
    tags: List[str] = []


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(JSONB, nullable=True, default={})
    article_type = Column(
        String, default="general"
    )  # character, location, item, lore, etc.
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    project = relationship("Project", back_populates="articles")
