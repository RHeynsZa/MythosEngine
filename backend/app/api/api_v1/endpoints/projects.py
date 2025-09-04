from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.project import Project, ProjectCreate, ProjectUpdate
from app.services.container import get_services, ServiceContainer

router = APIRouter()


@router.get("/", response_model=List[Project])
def get_projects(skip: int = 0, limit: int = 100, services: ServiceContainer = Depends(get_services)):
    """Get all projects"""
    projects = services.projects.get_projects(skip=skip, limit=limit)
    return projects


@router.post("/", response_model=Project)
def create_project(project: ProjectCreate, services: ServiceContainer = Depends(get_services)):
    """Create a new project"""
    return services.projects.create_project(project)


@router.get("/{project_id}", response_model=Project)
def get_project(project_id: int, services: ServiceContainer = Depends(get_services)):
    """Get a specific project by ID"""
    project = services.projects.get_project(project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{project_id}", response_model=Project)
def update_project(
    project_id: int, project: ProjectUpdate, services: ServiceContainer = Depends(get_services)
):
    """Update a project"""
    db_project = services.projects.get_project(project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return services.projects.update_project(project_id=project_id, project_data=project)


@router.delete("/{project_id}")
def delete_project(project_id: int, services: ServiceContainer = Depends(get_services)):
    """Delete a project"""
    db_project = services.projects.get_project(project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    services.projects.delete_project(project_id=project_id)
    return {"message": "Project deleted successfully"}
