"""
Project repository for database operations.
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.models.project import ProjectDB
from app.domain.models.project import Project  # We'll create this
from .base_repository import BaseRepository


class ProjectRepository(BaseRepository[ProjectDB, Project]):
    """Repository for project database operations."""

    def __init__(self, db: Session):
        super().__init__(db, ProjectDB)

    def get_by_name(self, name: str) -> Optional[ProjectDB]:
        """Get project by name."""
        return self.db.query(ProjectDB).filter(ProjectDB.name == name).first()

    def search_by_name(self, name_pattern: str, skip: int = 0, limit: int = 100) -> List[ProjectDB]:
        """Search projects by name pattern."""
        return (
            self.db.query(ProjectDB)
            .filter(ProjectDB.name.ilike(f"%{name_pattern}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def to_domain(self, db_obj: ProjectDB) -> Project:
        """Convert database model to domain model."""
        return Project(
            id=db_obj.id,
            name=db_obj.name,
            description=db_obj.description,
            created_at=db_obj.created_at,
            updated_at=db_obj.updated_at
        )

    def from_domain(self, domain_obj: Project) -> ProjectDB:
        """Convert domain model to database model."""
        db_obj = ProjectDB(
            name=domain_obj.name,
            description=domain_obj.description
        )

        if domain_obj.id:
            db_obj.id = domain_obj.id

        return db_obj

    def create_from_domain(self, domain_obj: Project) -> Project:
        """Create a new project from domain model."""
        db_obj = self.from_domain(domain_obj)
        created_db_obj = self.create(db_obj)
        return self.to_domain(created_db_obj)

    def update_from_domain(self, domain_obj: Project) -> Optional[Project]:
        """Update a project from domain model."""
        if not domain_obj.id:
            return None

        db_obj = self.get_by_id(domain_obj.id)
        if not db_obj:
            return None

        # Update fields
        db_obj.name = domain_obj.name
        db_obj.description = domain_obj.description

        updated_db_obj = self.update(db_obj)
        return self.to_domain(updated_db_obj)