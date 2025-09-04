from sqlalchemy.orm import Session
from app.domain.models.project import Project
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectUpdate
from typing import Optional, List


class ProjectService:
    """Service layer for project operations using domain models and repositories."""

    def __init__(self, db: Session):
        self.repository = ProjectRepository(db)

    def get_project(self, project_id: int) -> Optional[Project]:
        """Get a project by ID."""
        db_project = self.repository.get_by_id(project_id)
        if db_project:
            return self.repository.to_domain(db_project)
        return None

    def get_project_by_name(self, name: str) -> Optional[Project]:
        """Get a project by name."""
        db_project = self.repository.get_by_name(name)
        if db_project:
            return self.repository.to_domain(db_project)
        return None

    def get_projects(self, skip: int = 0, limit: int = 100) -> List[Project]:
        """Get all projects with pagination."""
        db_projects = self.repository.get_all(skip, limit)
        return [self.repository.to_domain(db_project) for db_project in db_projects]

    def search_projects(self, name_pattern: str, skip: int = 0, limit: int = 100) -> List[Project]:
        """Search projects by name pattern."""
        db_projects = self.repository.search_by_name(name_pattern, skip, limit)
        return [self.repository.to_domain(db_project) for db_project in db_projects]

    def create_project(self, project_data: ProjectCreate) -> Project:
        """Create a new project."""
        # Convert schema to domain model
        domain_project = Project(
            name=project_data.name,
            description=project_data.description
        )

        return self.repository.create_from_domain(domain_project)

    def update_project(self, project_id: int, project_data: ProjectUpdate) -> Optional[Project]:
        """Update an existing project."""
        # Get current project
        current_project = self.get_project(project_id)
        if not current_project:
            return None

        # Update fields that are provided
        if project_data.name is not None:
            current_project.name = project_data.name
        if project_data.description is not None:
            current_project.description = project_data.description

        return self.repository.update_from_domain(current_project)

    def delete_project(self, project_id: int) -> Optional[Project]:
        """Delete a project."""
        # Get the project before deletion
        project = self.get_project(project_id)
        if project:
            self.repository.delete(project_id)
        return project


# Legacy functions for backward compatibility
def get_project(db: Session, project_id: int):
    service = ProjectService(db)
    return service.get_project(project_id)


def get_projects(db: Session, skip: int = 0, limit: int = 100):
    service = ProjectService(db)
    return service.get_projects(skip, limit)


def create_project(db: Session, project: ProjectCreate):
    service = ProjectService(db)
    return service.create_project(project)


def update_project(db: Session, project_id: int, project: ProjectUpdate):
    service = ProjectService(db)
    return service.update_project(project_id, project)


def delete_project(db: Session, project_id: int):
    service = ProjectService(db)
    return service.delete_project(project_id)