"""
Base repository class with common database operations.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, List
from sqlalchemy.orm import Session
from app.db.database import Base

ModelType = TypeVar("ModelType", bound=Base)
DomainType = TypeVar("DomainType")


class BaseRepository(ABC, Generic[ModelType, DomainType]):
    """Abstract base repository class."""

    def __init__(self, db: Session, model_class: type[ModelType]):
        self.db = db
        self.model_class = model_class

    def get_by_id(self, id: int) -> Optional[ModelType]:
        """Get a model by ID."""
        return self.db.query(self.model_class).filter(self.model_class.id == id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Get all models with pagination."""
        return self.db.query(self.model_class).offset(skip).limit(limit).all()

    def create(self, db_obj: ModelType) -> ModelType:
        """Create a new model."""
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def update(self, db_obj: ModelType) -> ModelType:
        """Update an existing model."""
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, id: int) -> Optional[ModelType]:
        """Delete a model by ID."""
        db_obj = self.get_by_id(id)
        if db_obj:
            self.db.delete(db_obj)
            self.db.commit()
        return db_obj

    @abstractmethod
    def to_domain(self, db_obj: ModelType) -> DomainType:
        """Convert database model to domain model."""
        pass

    @abstractmethod
    def from_domain(self, domain_obj: DomainType) -> ModelType:
        """Convert domain model to database model."""
        pass