"""
Article database model for SQLAlchemy persistence.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.database import Base
import enum


class ArticleVisibility(enum.Enum):
    """Enum for article visibility modes."""
    UNLISTED = "unlisted"  # Only visible to the writer
    PRIVATE = "private"    # Visible to everyone invited to view the project
    PUBLIC = "public"      # Open to anyone (even unauthorized users)


class ArticleDB(Base):
    """SQLAlchemy model for article persistence."""
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(JSONB, nullable=True, default={})
    article_type = Column(String, default="general", index=True)
    visibility = Column(Enum(ArticleVisibility), default=ArticleVisibility.UNLISTED, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    header_image_id = Column(Integer, ForeignKey("images.id"), nullable=True)
    spotify_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    author = relationship("UserDB", back_populates="articles")
    project = relationship("ProjectDB", back_populates="articles")
    header_image = relationship("ImageDB", foreign_keys=[header_image_id])
    person = relationship("PersonDB", back_populates="article", uselist=False)
    settlement = relationship("SettlementDB", back_populates="article", uselist=False)