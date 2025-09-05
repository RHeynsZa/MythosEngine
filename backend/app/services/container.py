from __future__ import annotations

from typing import Generator

from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.project_service import ProjectService
from app.services.article_service import ArticleService
from app.services.image_service import ImageService
from app.services.person_service import PersonService
from app.services.settlement_service import SettlementService
from app.services.user_service import UserService


class ServiceContainer:
    """
    Aggregates and provides access to application services.

    One instance is created per-request via FastAPI dependency injection,
    ensuring services share the same SQLAlchemy Session lifecycle.
    """

    def __init__(self, db: Session):
        self._db = db

        # Core services
        self.users = UserService(db)
        self.projects = ProjectService(db)
        self.articles = ArticleService(db)
        self.images = ImageService(db)
        self.people = PersonService(db)
        self.settlements = SettlementService(db)

    @property
    def db(self) -> Session:
        return self._db


def get_services(db: Session = Depends(get_db)) -> Generator[ServiceContainer, None, None]:
    """FastAPI dependency that yields a per-request ServiceContainer."""
    container = ServiceContainer(db)
    try:
        yield container
    finally:
        # Session cleanup is handled by get_db()
        pass


