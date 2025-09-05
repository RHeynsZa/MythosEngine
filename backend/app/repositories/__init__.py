"""
Repository pattern implementation for data access.

Repositories provide an abstraction layer between domain models and database models.
"""

from .article_repository import ArticleRepository
from .person_repository import PersonRepository
from .settlement_repository import SettlementRepository
from .project_repository import ProjectRepository
from .user_repository import UserRepository

__all__ = ["ArticleRepository", "PersonRepository", "SettlementRepository", "ProjectRepository", "UserRepository"]