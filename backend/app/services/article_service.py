from sqlalchemy.orm import Session
from app.domain.models.article import Article, ArticleContent, ArticleType
from app.repositories.article_repository import ArticleRepository
from app.db.models.article import ArticleVisibility
from app.schemas.article import ArticleCreate, ArticleUpdate, ArticleVisibilityEnum
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

    def get_articles(self, project_id: Optional[int] = None, user_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[Article]:
        """Get articles with optional project filtering and visibility rules."""
        if project_id:
            db_articles = self.repository.get_by_project_with_header_images(project_id, skip, limit)
            # Filter by visibility rules
            visible_articles = []
            for article in db_articles:
                if self._is_article_visible_to_user(article, user_id):
                    visible_articles.append(article)
            return [self.repository.to_domain(db_article) for db_article in visible_articles]
        else:
            db_articles = self.repository.get_visible_articles_for_user(user_id, skip, limit)
            return [self.repository.to_domain(db_article) for db_article in db_articles]

    def get_public_articles(self, skip: int = 0, limit: int = 100) -> List[Article]:
        """Get all public articles."""
        db_articles = self.repository.get_public_articles(skip, limit)
        return [self.repository.to_domain(db_article) for db_article in db_articles]

    def get_articles_by_author(self, author_id: int, requesting_user_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[Article]:
        """Get articles by author with visibility filtering."""
        if requesting_user_id == author_id:
            # Author can see all their own articles
            db_articles = self.repository.get_by_author(author_id, skip, limit)
        else:
            # Others can only see public and private articles from this author
            db_articles = self.repository.get_by_author(author_id, skip, limit)
            visible_articles = []
            for article in db_articles:
                if article.visibility in [ArticleVisibility.PUBLIC, ArticleVisibility.PRIVATE]:
                    visible_articles.append(article)
            db_articles = visible_articles
        
        return [self.repository.to_domain(db_article) for db_article in db_articles]

    def _is_article_visible_to_user(self, article_db, user_id: Optional[int]) -> bool:
        """Check if an article is visible to a user based on visibility rules."""
        if article_db.visibility == ArticleVisibility.PUBLIC:
            return True
        elif article_db.visibility == ArticleVisibility.PRIVATE:
            return user_id is not None  # Private articles visible to any authenticated user for now
        elif article_db.visibility == ArticleVisibility.UNLISTED:
            return user_id is not None and user_id == article_db.author_id
        return False

    def get_articles_by_type(self, article_type: str, skip: int = 0, limit: int = 100) -> List[Article]:
        """Get articles by type."""
        db_articles = self.repository.get_by_type(article_type, skip, limit)
        return [self.repository.to_domain(db_article) for db_article in db_articles]

    def search_articles(self, title_pattern: str, skip: int = 0, limit: int = 100) -> List[Article]:
        """Search articles by title pattern."""
        db_articles = self.repository.search_by_title(title_pattern, skip, limit)
        return [self.repository.to_domain(db_article) for db_article in db_articles]

    def create_article(self, article_data: ArticleCreate, author_id: int) -> Article:
        """Create a new article."""
        # Convert schema to domain model
        content = ArticleContent()
        if article_data.content:
            content = article_data.content

        # Create database object directly since we need to set author_id and visibility
        from app.db.models.article import ArticleDB
        
        content_dict = {}
        if content:
            content_dict = {
                "main_content": content.main_content,
                "sidebar_content": content.sidebar_content,
                "footer_content": content.footer_content,
                "summary": content.summary,
                "tags": content.tags,
                "metadata": content.metadata
            }

        db_article = ArticleDB(
            title=article_data.title,
            content=content_dict,
            article_type=article_data.article_type.value,
            visibility=ArticleVisibility(article_data.visibility.value),
            author_id=author_id,
            project_id=article_data.project_id,
            header_image_id=article_data.header_image_id,
            spotify_url=article_data.spotify_url
        )

        created_article = self.repository.create(db_article)
        return self.repository.to_domain(created_article)

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
