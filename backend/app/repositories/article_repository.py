"""
Article repository for database operations.
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.models.article import ArticleDB
from app.domain.models.article import Article, ArticleContent, ArticleType
from .base_repository import BaseRepository


class ArticleRepository(BaseRepository[ArticleDB, Article]):
    """Repository for article database operations."""

    def __init__(self, db: Session):
        super().__init__(db, ArticleDB)

    def get_by_project(self, project_id: int, skip: int = 0, limit: int = 100) -> List[ArticleDB]:
        """Get articles by project ID."""
        return (
            self.db.query(ArticleDB)
            .filter(ArticleDB.project_id == project_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_type(self, article_type: str, skip: int = 0, limit: int = 100) -> List[ArticleDB]:
        """Get articles by type."""
        return (
            self.db.query(ArticleDB)
            .filter(ArticleDB.article_type == article_type)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def search_by_title(self, title_pattern: str, skip: int = 0, limit: int = 100) -> List[ArticleDB]:
        """Search articles by title pattern."""
        return (
            self.db.query(ArticleDB)
            .filter(ArticleDB.title.ilike(f"%{title_pattern}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def to_domain(self, db_obj: ArticleDB) -> Article:
        """Convert database model to domain model."""
        content = ArticleContent()
        if db_obj.content:
            content = ArticleContent(**db_obj.content)

        return Article(
            id=db_obj.id,
            title=db_obj.title,
            content=content,
            article_type=ArticleType(db_obj.article_type),
            project_id=db_obj.project_id,
            created_at=db_obj.created_at,
            updated_at=db_obj.updated_at
        )

    def from_domain(self, domain_obj: Article) -> ArticleDB:
        """Convert domain model to database model."""
        content_dict = {}
        if domain_obj.content:
            content_dict = {
                "main_content": domain_obj.content.main_content,
                "sidebar_content": domain_obj.content.sidebar_content,
                "footer_content": domain_obj.content.footer_content,
                "summary": domain_obj.content.summary,
                "tags": domain_obj.content.tags,
                "metadata": domain_obj.content.metadata
            }

        db_obj = ArticleDB(
            title=domain_obj.title,
            content=content_dict,
            article_type=domain_obj.article_type.value,
            project_id=domain_obj.project_id
        )

        if domain_obj.id:
            db_obj.id = domain_obj.id

        return db_obj

    def create_from_domain(self, domain_obj: Article) -> Article:
        """Create a new article from domain model."""
        db_obj = self.from_domain(domain_obj)
        created_db_obj = self.create(db_obj)
        return self.to_domain(created_db_obj)

    def update_from_domain(self, domain_obj: Article) -> Optional[Article]:
        """Update an article from domain model."""
        if not domain_obj.id:
            return None

        db_obj = self.get_by_id(domain_obj.id)
        if not db_obj:
            return None

        # Update fields
        db_obj.title = domain_obj.title
        db_obj.article_type = domain_obj.article_type.value
        
        if domain_obj.content:
            db_obj.content = {
                "main_content": domain_obj.content.main_content,
                "sidebar_content": domain_obj.content.sidebar_content,
                "footer_content": domain_obj.content.footer_content,
                "summary": domain_obj.content.summary,
                "tags": domain_obj.content.tags,
                "metadata": domain_obj.content.metadata
            }

        updated_db_obj = self.update(db_obj)
        return self.to_domain(updated_db_obj)