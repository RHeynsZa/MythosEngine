"""
User API endpoints.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserWithProjects

router = APIRouter()


def get_user_repository(db: Session = Depends(get_db)) -> UserRepository:
    """Get user repository instance."""
    return UserRepository(db)


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_create: UserCreate,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Create a new user."""
    # Check if username already exists
    if user_repo.get_by_username(user_create.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Check if email already exists
    if user_repo.get_by_email(user_create.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )
    
    db_user = user_repo.create_user(user_create)
    return UserResponse.model_validate(db_user)


@router.get("/", response_model=List[UserResponse])
def get_users(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Get all users."""
    if active_only:
        users = user_repo.get_active_users(skip=skip, limit=limit)
    else:
        users = user_repo.get_all(skip=skip, limit=limit)
    
    return [UserResponse.model_validate(user) for user in users]


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Get a user by ID."""
    db_user = user_repo.get_by_id(user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse.model_validate(db_user)


@router.get("/{user_id}/with-projects", response_model=UserWithProjects)
def get_user_with_projects(
    user_id: int,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Get a user with their projects."""
    db_user = user_repo.get_by_id(user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserWithProjects.model_validate(db_user)


@router.get("/by-username/{username}", response_model=UserResponse)
def get_user_by_username(
    username: str,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Get a user by username."""
    db_user = user_repo.get_by_username(username)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse.model_validate(db_user)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Update a user."""
    # Check if username is being changed and already exists
    if user_update.username:
        existing_user = user_repo.get_by_username(user_update.username)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )
    
    # Check if email is being changed and already exists
    if user_update.email:
        existing_user = user_repo.get_by_email(user_update.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists"
            )
    
    db_user = user_repo.update_user(user_id, user_update)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse.model_validate(db_user)


@router.delete("/{user_id}", response_model=UserResponse)
def delete_user(
    user_id: int,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Delete a user."""
    db_user = user_repo.delete(user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse.model_validate(db_user)