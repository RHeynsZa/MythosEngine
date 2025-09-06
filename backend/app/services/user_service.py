"""
User service for business logic operations.
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.domain.models.user import User, UserCreate, UserUpdate
from app.schemas.user import UserProfile, UserSummary


class UserService:
    """Service for user business logic."""

    def __init__(self, db: Session):
        self.db = db
        self.user_repository = UserRepository(db)

    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user."""
        # Check if username already exists
        if self.user_repository.is_username_taken(user_data.username):
            raise ValueError(f"Username '{user_data.username}' is already taken")
        
        # Check if email already exists
        if self.user_repository.is_email_taken(user_data.email):
            raise ValueError(f"Email '{user_data.email}' is already taken")

        # Create user
        user_db = self.user_repository.create(user_data)
        return User(
            id=user_db.id,
            username=user_db.username,
            email=user_db.email,
            display_name=user_db.display_name,
            bio=user_db.bio,
            avatar_url=user_db.avatar_url,
            created_at=user_db.created_at,
            updated_at=user_db.updated_at,
        )

    def get_user(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        user_db = self.user_repository.get(user_id)
        if not user_db:
            return None

        return User(
            id=user_db.id,
            username=user_db.username,
            email=user_db.email,
            display_name=user_db.display_name,
            bio=user_db.bio,
            avatar_url=user_db.avatar_url,
            created_at=user_db.created_at,
            updated_at=user_db.updated_at,
        )

    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        user_db = self.user_repository.get_by_username(username)
        if not user_db:
            return None

        return User(
            id=user_db.id,
            username=user_db.username,
            email=user_db.email,
            display_name=user_db.display_name,
            bio=user_db.bio,
            avatar_url=user_db.avatar_url,
            created_at=user_db.created_at,
            updated_at=user_db.updated_at,
        )

    def get_user_profile(self, user_id: int) -> Optional[UserProfile]:
        """Get user profile with stats."""
        user_stats = self.user_repository.get_user_with_stats(user_id)
        if not user_stats:
            return None

        return UserProfile(
            id=user_stats["id"],
            username=user_stats["username"],
            display_name=user_stats["display_name"],
            bio=user_stats["bio"],
            avatar_url=user_stats["avatar_url"],
            created_at=user_stats["created_at"],
            article_count=user_stats["article_count"],
            project_count=user_stats["project_count"],
        )

    def get_user_profile_by_username(self, username: str) -> Optional[UserProfile]:
        """Get user profile by username with stats."""
        user_db = self.user_repository.get_by_username(username)
        if not user_db:
            return None

        return self.get_user_profile(user_db.id)

    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Update user."""
        user_db = self.user_repository.update(user_id, user_data)
        if not user_db:
            return None

        return User(
            id=user_db.id,
            username=user_db.username,
            email=user_db.email,
            display_name=user_db.display_name,
            bio=user_db.bio,
            avatar_url=user_db.avatar_url,
            created_at=user_db.created_at,
            updated_at=user_db.updated_at,
        )

    def delete_user(self, user_id: int) -> bool:
        """Delete user."""
        return self.user_repository.delete(user_id)

    def get_users(self, skip: int = 0, limit: int = 100) -> List[UserSummary]:
        """Get users with article counts."""
        users_data = self.user_repository.get_users_with_article_counts(skip=skip, limit=limit)
        
        return [
            UserSummary(
                id=user["id"],
                username=user["username"],
                display_name=user["display_name"],
                avatar_url=user["avatar_url"],
                article_count=user["article_count"],
            )
            for user in users_data
        ]