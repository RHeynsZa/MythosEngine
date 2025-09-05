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

    def get_projects(self, skip: int = 0, limit: int = 100, user_id: Optional[int] = None) -> List[Project]:
        """Get all projects with pagination, optionally filtered by user."""
        if user_id is not None:
            db_projects = self.repository.get_by_user_id(user_id, skip, limit)
        else:
            db_projects = self.repository.get_all(skip, limit)
        return [self.repository.to_domain(db_project) for db_project in db_projects]

    def search_projects(self, name_pattern: str, skip: int = 0, limit: int = 100, user_id: Optional[int] = None) -> List[Project]:
        """Search projects by name pattern, optionally filtered by user."""
        db_projects = self.repository.search_by_name(name_pattern, user_id, skip, limit)
        return [self.repository.to_domain(db_project) for db_project in db_projects]

    def create_project(self, project_data: ProjectCreate) -> Project:
        """Create a new project."""
        # Convert schema to domain model
        domain_project = Project(
            name=project_data.name,
            description=project_data.description,
            user_id=project_data.user_id
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

