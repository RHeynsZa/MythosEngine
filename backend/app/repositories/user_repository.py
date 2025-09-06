"""
User repository for database operations.
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.models.user import UserDB
from app.db.models.article import ArticleDB
from app.db.models.project import ProjectDB
from app.domain.models.user import User, UserCreate, UserUpdate
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[UserDB, UserCreate, UserUpdate]):
    """Repository for user database operations."""

    def __init__(self, db: Session):
        super().__init__(UserDB, db)

    def get_by_username(self, username: str) -> Optional[UserDB]:
        """Get user by username."""
        return self.db.query(UserDB).filter(UserDB.username == username).first()

    def get_by_email(self, email: str) -> Optional[UserDB]:
        """Get user by email."""
        return self.db.query(UserDB).filter(UserDB.email == email).first()

    def get_user_with_stats(self, user_id: int) -> Optional[dict]:
        """Get user with article and project counts."""
        user = self.get(user_id)
        if not user:
            return None

        # Count articles authored by user
        article_count = (
            self.db.query(func.count(ArticleDB.id))
            .filter(ArticleDB.author_id == user_id)
            .scalar() or 0
        )

        # Count projects owned by user
        project_count = (
            self.db.query(func.count(ProjectDB.id))
            .filter(ProjectDB.owner_id == user_id)
            .scalar() or 0
        )

        return {
            **user.__dict__,
            "article_count": article_count,
            "project_count": project_count,
        }

    def get_users_with_article_counts(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get users with their article counts."""
        users = self.get_multi(skip=skip, limit=limit)
        result = []

        for user in users:
            article_count = (
                self.db.query(func.count(ArticleDB.id))
                .filter(ArticleDB.author_id == user.id)
                .scalar() or 0
            )
            
            result.append({
                **user.__dict__,
                "article_count": article_count,
            })

        return result

    def is_username_taken(self, username: str, exclude_user_id: Optional[int] = None) -> bool:
        """Check if username is already taken."""
        query = self.db.query(UserDB).filter(UserDB.username == username)
        if exclude_user_id:
            query = query.filter(UserDB.id != exclude_user_id)
        return query.first() is not None

    def is_email_taken(self, email: str, exclude_user_id: Optional[int] = None) -> bool:
        """Check if email is already taken."""
        query = self.db.query(UserDB).filter(UserDB.email == email)
        if exclude_user_id:
            query = query.filter(UserDB.id != exclude_user_id)
        return query.first() is not None