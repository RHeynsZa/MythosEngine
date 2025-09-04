"""
Project database model for SQLAlchemy persistence.
"""

from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base


class ProjectDB(Base):
    """SQLAlchemy model for project persistence."""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    articles = relationship(
        "ArticleDB", back_populates="project", cascade="all, delete-orphan"
    )
    images = relationship(
        "ImageDB", back_populates="project", cascade="all, delete-orphan"
    )