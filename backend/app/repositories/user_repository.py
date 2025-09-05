"""
User repository for database operations.
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.models.user import UserDB
from app.repositories.base_repository import BaseRepository
from app.schemas.user import UserCreate, UserUpdate


class UserRepository(BaseRepository[UserDB, None]):
    """Repository for user database operations."""

    def __init__(self, db: Session):
        super().__init__(db, UserDB)

    def get_by_username(self, username: str) -> Optional[UserDB]:
        """Get user by username."""
        return self.db.query(UserDB).filter(UserDB.username == username).first()

    def get_by_email(self, email: str) -> Optional[UserDB]:
        """Get user by email."""
        return self.db.query(UserDB).filter(UserDB.email == email).first()

    def get_by_username_or_email(self, identifier: str) -> Optional[UserDB]:
        """Get user by username or email."""
        return self.db.query(UserDB).filter(
            or_(UserDB.username == identifier, UserDB.email == identifier)
        ).first()

    def create_user(self, user_create: UserCreate) -> UserDB:
        """Create a new user."""
        db_user = UserDB(
            username=user_create.username,
            email=user_create.email,
            full_name=user_create.full_name,
            bio=user_create.bio,
            avatar_url=user_create.avatar_url,
        )
        return self.create(db_user)

    def update_user(self, user_id: int, user_update: UserUpdate) -> Optional[UserDB]:
        """Update an existing user."""
        db_user = self.get_by_id(user_id)
        if not db_user:
            return None

        update_data = user_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)

        return self.update(db_user)

    def get_active_users(self, skip: int = 0, limit: int = 100) -> List[UserDB]:
        """Get all active users."""
        return self.db.query(UserDB).filter(UserDB.is_active == True).offset(skip).limit(limit).all()

    def to_domain(self, db_obj: UserDB) -> None:
        """Convert database model to domain model (not implemented yet)."""
        pass

    def from_domain(self, domain_obj: None) -> UserDB:
        """Convert domain model to database model (not implemented yet)."""
        pass