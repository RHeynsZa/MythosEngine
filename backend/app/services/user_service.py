"""
User service layer for business logic operations.
"""

from sqlalchemy.orm import Session
from typing import Optional, List
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserUpdate, UserResponse


class UserService:
    """Service layer for user operations."""

    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def get_user(self, user_id: int) -> Optional[UserResponse]:
        """Get a user by ID."""
        db_user = self.repository.get_by_id(user_id)
        if db_user:
            return UserResponse.model_validate(db_user)
        return None

    def get_user_by_username(self, username: str) -> Optional[UserResponse]:
        """Get a user by username."""
        db_user = self.repository.get_by_username(username)
        if db_user:
            return UserResponse.model_validate(db_user)
        return None

    def get_user_by_email(self, email: str) -> Optional[UserResponse]:
        """Get a user by email."""
        db_user = self.repository.get_by_email(email)
        if db_user:
            return UserResponse.model_validate(db_user)
        return None

    def get_users(self, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[UserResponse]:
        """Get all users with pagination."""
        if active_only:
            db_users = self.repository.get_active_users(skip, limit)
        else:
            db_users = self.repository.get_all(skip, limit)
        return [UserResponse.model_validate(db_user) for db_user in db_users]

    def create_user(self, user_data: UserCreate) -> UserResponse:
        """Create a new user."""
        # Check for existing username
        if self.repository.get_by_username(user_data.username):
            raise ValueError("Username already exists")
        
        # Check for existing email
        if self.repository.get_by_email(user_data.email):
            raise ValueError("Email already exists")
        
        db_user = self.repository.create_user(user_data)
        return UserResponse.model_validate(db_user)

    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[UserResponse]:
        """Update an existing user."""
        # Check for username conflicts if username is being changed
        if user_data.username:
            existing_user = self.repository.get_by_username(user_data.username)
            if existing_user and existing_user.id != user_id:
                raise ValueError("Username already exists")
        
        # Check for email conflicts if email is being changed
        if user_data.email:
            existing_user = self.repository.get_by_email(user_data.email)
            if existing_user and existing_user.id != user_id:
                raise ValueError("Email already exists")
        
        db_user = self.repository.update_user(user_id, user_data)
        if db_user:
            return UserResponse.model_validate(db_user)
        return None

    def delete_user(self, user_id: int) -> Optional[UserResponse]:
        """Delete a user."""
        # Get the user before deletion
        db_user = self.repository.get_by_id(user_id)
        if db_user:
            self.repository.delete(user_id)
            return UserResponse.model_validate(db_user)
        return None

    def deactivate_user(self, user_id: int) -> Optional[UserResponse]:
        """Deactivate a user instead of deleting."""
        user_update = UserUpdate(is_active=False)
        return self.update_user(user_id, user_update)