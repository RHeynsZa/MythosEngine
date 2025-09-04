"""
Legacy models package for backward compatibility.

This package re-exports database models with their original names
to maintain compatibility with existing code.
"""

# Import database models and alias them to original names for backward compatibility
from app.db.models.article import ArticleDB as Article
from app.db.models.project import ProjectDB as Project
from app.db.models.person import PersonDB as Person
from app.db.models.settlement import SettlementDB as Settlement

# Import the original ArticleContent for backward compatibility
from app.domain.models.article import ArticleContent

__all__ = ["Article", "Project", "Person", "Settlement", "ArticleContent"]