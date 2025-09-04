"""
Article database model for SQLAlchemy persistence.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.database import Base


class ArticleDB(Base):
    """SQLAlchemy model for article persistence."""
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(JSONB, nullable=True, default={})
    article_type = Column(String, default="general", index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    project = relationship("ProjectDB", back_populates="articles")
    person = relationship("PersonDB", back_populates="article", uselist=False)
    settlement = relationship("SettlementDB", back_populates="article", uselist=False)