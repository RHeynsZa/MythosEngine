from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    """Base schema for user data."""
    username: str = Field(..., description="Unique username for the user", min_length=3, max_length=50)
    email: EmailStr = Field(..., description="User's email address")
    display_name: str = Field(..., description="Display name for the user", min_length=1, max_length=100)
    bio: Optional[str] = Field(None, description="User's biography", max_length=1000)
    avatar_url: Optional[str] = Field(None, description="URL to user's avatar image")


class UserCreate(UserBase):
    """Schema for creating a new user."""
    pass


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    display_name: Optional[str] = Field(None, description="Display name for the user", min_length=1, max_length=100)
    bio: Optional[str] = Field(None, description="User's biography", max_length=1000)
    avatar_url: Optional[str] = Field(None, description="URL to user's avatar image")


class User(UserBase):
    """Schema for user response."""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    """Schema for user profile response with additional information."""
    id: int
    username: str
    display_name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    article_count: int = Field(..., description="Number of articles authored by the user")
    project_count: int = Field(..., description="Number of projects owned by the user")

    class Config:
        from_attributes = True


class UserSummary(BaseModel):
    """Summary schema for user lists."""
    id: int
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    article_count: int = Field(..., description="Number of articles authored by the user")

    class Config:
        from_attributes = True