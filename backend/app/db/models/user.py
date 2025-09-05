"""
User database model for SQLAlchemy persistence.
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base


class UserDB(Base):
    """SQLAlchemy model for user persistence."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    projects = relationship(
        "ProjectDB", back_populates="user", cascade="all, delete-orphan"
    )