"""
Settlement database model for SQLAlchemy persistence.
"""

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.database import Base


class SettlementDB(Base):
    """SQLAlchemy model for settlement persistence."""
    __tablename__ = "settlements"

    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False, unique=True)
    
    # Core settlement data stored as JSONB for flexibility
    settlement_data = Column(JSONB, nullable=False, default={})
    
    # Indexed fields for common queries
    settlement_type = Column(String, index=True, nullable=False)
    population = Column(Integer, index=True, nullable=True)
    government_type = Column(String, index=True, nullable=True)
    region = Column(String, index=True, nullable=True)
    primary_industry = Column(String, index=True, nullable=True)

    # Relationships
    article = relationship("ArticleDB", back_populates="settlement")