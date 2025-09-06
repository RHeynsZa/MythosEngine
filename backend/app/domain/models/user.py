"""
User domain model representing a user in the system.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class User:
    """Domain model representing a user."""
    id: int
    username: str
    email: str
    display_name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime = None
    updated_at: datetime = None


@dataclass
class UserCreate:
    """Domain model for creating a new user."""
    username: str
    email: str
    display_name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


@dataclass
class UserUpdate:
    """Domain model for updating a user."""
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None