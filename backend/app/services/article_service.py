from sqlalchemy.orm import Session
from app.domain.models.article import Article, ArticleContent, ArticleType
from app.repositories.article_repository import ArticleRepository
from app.schemas.article import ArticleCreate, ArticleUpdate
from typing import Optional, List


class ArticleService:
    """Service layer for article operations using domain models and repositories."""

    def __init__(self, db: Session):
        self.repository = ArticleRepository(db)

    def get_article(self, article_id: int) -> Optional[Article]:
        """Get an article by ID."""
        db_article = self.repository.get_with_header_image(article_id)
        if db_article:
            return self.repository.to_domain(db_article)
        return None

    def get_articles(self, project_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[Article]:
        """Get articles with optional project filtering."""
        if project_id:
            db_articles = self.repository.get_by_project_with_header_images(project_id, skip, limit)
        else:
            db_articles = self.repository.get_all(skip, limit)
        
        return [self.repository.to_domain(db_article) for db_article in db_articles]

    def get_articles_by_type(self, article_type: str, skip: int = 0, limit: int = 100) -> List[Article]:
        """Get articles by type."""
        db_articles = self.repository.get_by_type(article_type, skip, limit)
        return [self.repository.to_domain(db_article) for db_article in db_articles]

    def search_articles(self, title_pattern: str, skip: int = 0, limit: int = 100) -> List[Article]:
        """Search articles by title pattern."""
        db_articles = self.repository.search_by_title(title_pattern, skip, limit)
        return [self.repository.to_domain(db_article) for db_article in db_articles]

    def create_article(self, article_data: ArticleCreate) -> Article:
        """Create a new article."""
        # Convert schema to domain model
        content = ArticleContent()
        if article_data.content:
            content = article_data.content

        domain_article = Article(
            title=article_data.title,
            content=content,
            article_type=ArticleType(article_data.article_type),
            project_id=article_data.project_id,
            header_image_id=article_data.header_image_id
        )

        return self.repository.create_from_domain(domain_article)

    def update_article(self, article_id: int, article_data: ArticleUpdate) -> Optional[Article]:
        """Update an existing article."""
        # Get current article
        current_article = self.get_article(article_id)
        if not current_article:
            return None

        # Update fields that are provided
        if article_data.title is not None:
            current_article.title = article_data.title
        if article_data.content is not None:
            current_article.content = article_data.content
        if article_data.article_type is not None:
            current_article.article_type = ArticleType(article_data.article_type)
        if article_data.header_image_id is not None:
            current_article.header_image_id = article_data.header_image_id

        return self.repository.update_from_domain(current_article)

    def delete_article(self, article_id: int) -> Optional[Article]:
        """Delete an article."""
        # Get the article before deletion
        article = self.get_article(article_id)
        if article:
            self.repository.delete(article_id)
        return article


# Module-level functions for API compatibility
def get_article(db: Session, article_id: int) -> Optional[Article]:
    """Get an article by ID."""
    service = ArticleService(db)
    return service.get_article(article_id)


def get_articles(db: Session, project_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[Article]:
    """Get articles with optional project filtering."""
    service = ArticleService(db)
    return service.get_articles(project_id, skip, limit)


def create_article(db: Session, article: ArticleCreate) -> Article:
    """Create a new article."""
    service = ArticleService(db)
    return service.create_article(article)


def update_article(db: Session, article_id: int, article: ArticleUpdate) -> Optional[Article]:
    """Update an existing article."""
    service = ArticleService(db)
    return service.update_article(article_id, article)


def delete_article(db: Session, article_id: int) -> Optional[Article]:
    """Delete an article."""
    service = ArticleService(db)
    return service.delete_article(article_id)
