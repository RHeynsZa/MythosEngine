"""
Image database model for SQLAlchemy persistence.
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base


class ImageDB(Base):
    """SQLAlchemy model for image persistence."""
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False, index=True)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)  # Local path or S3 key
    file_size = Column(Integer, nullable=False)  # Size in bytes
    mime_type = Column(String, nullable=False)
    width = Column(Integer, nullable=True)  # Image width in pixels
    height = Column(Integer, nullable=True)  # Image height in pixels
    alt_text = Column(Text, nullable=True)  # Accessibility description
    is_s3_stored = Column(Boolean, default=False)  # True for S3, False for local
    s3_bucket = Column(String, nullable=True)  # S3 bucket name if applicable
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Foreign key to project (required for quota management)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, index=True)

    # Relationships
    project = relationship("ProjectDB", back_populates="images")