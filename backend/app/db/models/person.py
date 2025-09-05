"""
Person database model for SQLAlchemy persistence.
"""

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import JSON
from app.db.database import Base


class PersonDB(Base):
    """SQLAlchemy model for person persistence."""
    __tablename__ = "persons"

    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False, unique=True)
    
    # Core person data stored as JSON for flexibility
    person_data = Column(JSON, nullable=False, default={})
    
    # Indexed fields for common queries
    race = Column(String, index=True, nullable=True)
    gender = Column(String, index=True, nullable=True)
    life_status = Column(String, index=True, default="unknown")
    occupation = Column(String, index=True, nullable=True)
    current_location = Column(String, index=True, nullable=True)

    # Relationships
    article = relationship("ArticleDB", back_populates="person")