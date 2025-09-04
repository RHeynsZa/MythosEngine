"""
Image repository for database operations.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.repositories.base_repository import BaseRepository
from app.db.models.image import ImageDB
from app.schemas.image import ImageCreate, ImageUpdate


class ImageRepository(BaseRepository[ImageDB, ImageCreate, ImageUpdate]):
    """Repository for image database operations."""

    def __init__(self, db: Session):
        super().__init__(ImageDB, db)

    def get_by_project_id(
        self, project_id: int, skip: int = 0, limit: int = 100
    ) -> List[ImageDB]:
        """Get all images for a specific project."""
        return (
            self.db.query(self.model)
            .filter(self.model.project_id == project_id)
            .order_by(desc(self.model.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_filename(self, filename: str) -> Optional[ImageDB]:
        """Get image by filename."""
        return self.db.query(self.model).filter(self.model.filename == filename).first()

    def count_by_project_id(self, project_id: int) -> int:
        """Count total images for a project."""
        return self.db.query(self.model).filter(self.model.project_id == project_id).count()

    def get_total_size_by_project_id(self, project_id: int) -> int:
        """Get total file size for all images in a project (for quota management)."""
        result = (
            self.db.query(self.db.func.sum(self.model.file_size))
            .filter(self.model.project_id == project_id)
            .scalar()
        )
        return result or 0

    def delete_by_project_id(self, project_id: int) -> int:
        """Delete all images for a project. Returns count of deleted images."""
        count = self.count_by_project_id(project_id)
        self.db.query(self.model).filter(self.model.project_id == project_id).delete()
        self.db.commit()
        return count