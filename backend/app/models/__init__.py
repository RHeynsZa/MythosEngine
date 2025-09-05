"""
Database models package.

This package provides access to database models. For domain models, 
use app.domain.models instead.
"""

# Re-export database models for convenience
from app.db.models.article import ArticleDB
from app.db.models.project import ProjectDB
from app.db.models.person import PersonDB
from app.db.models.settlement import SettlementDB
from app.db.models.user import UserDB

__all__ = ["ArticleDB", "ProjectDB", "PersonDB", "SettlementDB", "UserDB"]