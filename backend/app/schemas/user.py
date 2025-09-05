"""
User schema definitions for API serialization.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr
from app.schemas.project import ProjectResponse


class UserBase(BaseModel):
    """Base user schema with common fields."""
    username: str = Field(..., min_length=3, max_length=50, description="Username")
    email: EmailStr = Field(..., description="Email address")
    full_name: Optional[str] = Field(None, max_length=100, description="Full name")
    bio: Optional[str] = Field(None, max_length=1000, description="User biography")
    avatar_url: Optional[str] = Field(None, description="Avatar image URL")


class UserCreate(UserBase):
    """Schema for creating a new user."""
    pass


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=1000)
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """Schema for user API responses."""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserWithProjects(UserResponse):
    """Schema for user with associated projects."""
    projects: List[ProjectResponse] = []

    class Config:
        from_attributes = True