"""
Image repository for database operations.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from app.repositories.base_repository import BaseRepository
from app.db.models.image import ImageDB
from app.schemas.image import ImageCreate, ImageUpdate


class ImageRepository(BaseRepository[ImageDB, ImageDB]):
    """Repository for image database operations."""

    def __init__(self, db: Session):
        super().__init__(db, ImageDB)

    def get_by_project_id(
        self, project_id: int, skip: int = 0, limit: int = 100
    ) -> List[ImageDB]:
        """Get all images for a specific project."""
        return (
            self.db.query(ImageDB)
            .filter(ImageDB.project_id == project_id)
            .order_by(desc(ImageDB.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_filename(self, filename: str) -> Optional[ImageDB]:
        """Get image by filename."""
        return self.db.query(ImageDB).filter(ImageDB.filename == filename).first()

    def count_by_project_id(self, project_id: int) -> int:
        """Count total images for a project."""
        return self.db.query(ImageDB).filter(ImageDB.project_id == project_id).count()

    def get_total_size_by_project_id(self, project_id: int) -> int:
        """Get total file size for all images in a project (for quota management)."""
        result = (
            self.db.query(func.sum(ImageDB.file_size))
            .filter(ImageDB.project_id == project_id)
            .scalar()
        )
        return result or 0

    def delete_by_project_id(self, project_id: int) -> int:
        """Delete all images for a project. Returns count of deleted images."""
        count = self.count_by_project_id(project_id)
        self.db.query(ImageDB).filter(ImageDB.project_id == project_id).delete()
        self.db.commit()
        return count

    def to_domain(self, db_obj: ImageDB) -> ImageDB:
        """Convert database model to domain model (identity)."""
        return db_obj

    def from_domain(self, domain_obj: ImageDB) -> ImageDB:
        """Convert domain model to database model (identity)."""
        return domain_obj
