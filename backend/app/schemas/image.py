"""
Image Pydantic schemas for API request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ImageBase(BaseModel):
    """Base image schema with common fields."""
    filename: str = Field(..., description="Generated filename")
    original_filename: str = Field(..., description="Original uploaded filename")
    alt_text: Optional[str] = Field(None, description="Accessibility description")


class ImageCreate(BaseModel):
    """Schema for creating a new image."""
    original_filename: str = Field(..., description="Original uploaded filename")
    project_id: int = Field(..., description="ID of the project this image belongs to")
    alt_text: Optional[str] = Field(None, description="Accessibility description")


class ImageUpdate(BaseModel):
    """Schema for updating an existing image."""
    alt_text: Optional[str] = Field(None, description="Accessibility description")


class ImageResponse(ImageBase):
    """Schema for image API responses."""
    id: int
    file_path: str = Field(..., description="File path or S3 key")
    file_size: int = Field(..., description="File size in bytes")
    mime_type: str = Field(..., description="MIME type of the image")
    width: Optional[int] = Field(None, description="Image width in pixels")
    height: Optional[int] = Field(None, description="Image height in pixels")
    is_s3_stored: bool = Field(..., description="Whether stored in S3 or locally")
    s3_bucket: Optional[str] = Field(None, description="S3 bucket name if applicable")
    project_id: int = Field(..., description="ID of the project this image belongs to")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ImageUploadResponse(BaseModel):
    """Schema for image upload response."""
    id: int
    filename: str
    original_filename: str
    file_size: int
    mime_type: str
    width: Optional[int]
    height: Optional[int]
    url: str = Field(..., description="URL to access the image")
    project_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ImageListResponse(BaseModel):
    """Schema for paginated image list response."""
    images: list[ImageResponse]
    total: int
    page: int
    per_page: int
    total_pages: int