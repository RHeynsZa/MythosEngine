"""
User domain model.

Represents a user of the system who owns projects.
"""

from datetime import datetime
from typing import Optional
from dataclasses import dataclass


@dataclass
class User:
    """
    User domain model.
    
    A user represents someone who can create and manage projects.
    """
    username: str
    email: str
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool = True
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __post_init__(self):
        if not self.username or not self.username.strip():
            raise ValueError("Username is required and cannot be empty")
        if not self.email or not self.email.strip():
            raise ValueError("Email is required and cannot be empty")
        if len(self.username) < 3:
            raise ValueError("Username must be at least 3 characters long")

    def deactivate(self) -> None:
        """Deactivate the user account."""
        self.is_active = False

    def activate(self) -> None:
        """Activate the user account."""
        self.is_active = True

    def update_profile(self, full_name: Optional[str] = None, bio: Optional[str] = None, avatar_url: Optional[str] = None) -> None:
        """Update the user's profile information."""
        if full_name is not None:
            self.full_name = full_name
        if bio is not None:
            self.bio = bio
        if avatar_url is not None:
            self.avatar_url = avatar_url