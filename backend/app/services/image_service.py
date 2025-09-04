"""
Image service for handling image storage operations.
"""

import os
import uuid
import shutil
from typing import Optional, List, BinaryIO
from pathlib import Path
from PIL import Image
from sqlalchemy.orm import Session

from app.core.config import settings
from app.repositories.image_repository import ImageRepository
from app.db.models.image import ImageDB
from app.schemas.image import ImageCreate, ImageUpdate, ImageResponse, ImageListResponse


class ImageStorageError(Exception):
    """Custom exception for image storage errors."""
    pass


class ImageService:
    """Service for managing image operations."""

    def __init__(self, db: Session):
        self.db = db
        self.repository = ImageRepository(db)
        self._ensure_local_storage_dir()

    def _ensure_local_storage_dir(self) -> None:
        """Ensure local storage directory exists."""
        if not settings.USE_S3_STORAGE:
            Path(settings.LOCAL_IMAGES_PATH).mkdir(parents=True, exist_ok=True)

    def _generate_filename(self, original_filename: str) -> str:
        """Generate unique filename while preserving extension."""
        file_ext = Path(original_filename).suffix.lower()
        unique_id = str(uuid.uuid4())
        return f"{unique_id}{file_ext}"

    def _get_image_dimensions(self, file_path: str) -> tuple[Optional[int], Optional[int]]:
        """Get image dimensions using PIL."""
        try:
            with Image.open(file_path) as img:
                return img.width, img.height
        except Exception:
            return None, None

    def _validate_image_file(self, file_content: bytes, mime_type: str) -> None:
        """Validate image file size and type."""
        # Check file size
        file_size_mb = len(file_content) / (1024 * 1024)
        if file_size_mb > settings.MAX_IMAGE_SIZE_MB:
            raise ImageStorageError(f"Image size ({file_size_mb:.1f}MB) exceeds maximum allowed size ({settings.MAX_IMAGE_SIZE_MB}MB)")

        # Check MIME type
        if mime_type not in settings.ALLOWED_IMAGE_TYPES:
            raise ImageStorageError(f"Image type {mime_type} not allowed. Allowed types: {', '.join(settings.ALLOWED_IMAGE_TYPES)}")

    def _store_local(self, file_content: bytes, filename: str) -> str:
        """Store image locally and return file path."""
        file_path = os.path.join(settings.LOCAL_IMAGES_PATH, filename)
        
        try:
            with open(file_path, 'wb') as f:
                f.write(file_content)
            return file_path
        except Exception as e:
            raise ImageStorageError(f"Failed to store image locally: {str(e)}")

    def _store_s3(self, file_content: bytes, filename: str) -> str:
        """Store image in S3 and return S3 key."""
        # This would be implemented with boto3 for actual S3 usage
        # For now, we'll raise an error to indicate it needs implementation
        raise NotImplementedError("S3 storage not yet implemented. Please install boto3 and implement S3 upload logic.")

    def _delete_local(self, file_path: str) -> None:
        """Delete local image file."""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            # Log error but don't raise - database cleanup should still proceed
            print(f"Warning: Failed to delete local file {file_path}: {str(e)}")

    def _delete_s3(self, s3_key: str, bucket: str) -> None:
        """Delete image from S3."""
        # This would be implemented with boto3 for actual S3 usage
        raise NotImplementedError("S3 deletion not yet implemented.")

    def upload_image(
        self, 
        file_content: bytes, 
        original_filename: str, 
        mime_type: str, 
        project_id: int, 
        alt_text: Optional[str] = None
    ) -> ImageDB:
        """Upload and store an image."""
        # Validate the image
        self._validate_image_file(file_content, mime_type)

        # Generate unique filename
        filename = self._generate_filename(original_filename)

        # Store the image
        if settings.USE_S3_STORAGE:
            file_path = self._store_s3(file_content, filename)
            is_s3_stored = True
            s3_bucket = settings.S3_BUCKET_NAME
        else:
            file_path = self._store_local(file_content, filename)
            is_s3_stored = False
            s3_bucket = None

        # Get image dimensions
        if not is_s3_stored:
            width, height = self._get_image_dimensions(file_path)
        else:
            # For S3, we'd need to analyze the image before upload
            width, height = None, None

        # Create database record
        image_data = {
            "filename": filename,
            "original_filename": original_filename,
            "file_path": file_path,
            "file_size": len(file_content),
            "mime_type": mime_type,
            "width": width,
            "height": height,
            "alt_text": alt_text,
            "is_s3_stored": is_s3_stored,
            "s3_bucket": s3_bucket,
            "project_id": project_id,
        }

        return self.repository.create(image_data)

    def get_image(self, image_id: int) -> Optional[ImageDB]:
        """Get image by ID."""
        return self.repository.get(image_id)

    def get_image_by_filename(self, filename: str) -> Optional[ImageDB]:
        """Get image by filename."""
        return self.repository.get_by_filename(filename)

    def get_images_by_project(
        self, project_id: int, skip: int = 0, limit: int = 100
    ) -> ImageListResponse:
        """Get paginated list of images for a project."""
        images = self.repository.get_by_project_id(project_id, skip, limit)
        total = self.repository.count_by_project_id(project_id)
        
        total_pages = (total + limit - 1) // limit if total > 0 else 0
        current_page = (skip // limit) + 1

        return ImageListResponse(
            images=[ImageResponse.from_orm(img) for img in images],
            total=total,
            page=current_page,
            per_page=limit,
            total_pages=total_pages
        )

    def update_image(self, image_id: int, update_data: ImageUpdate) -> Optional[ImageDB]:
        """Update image metadata."""
        return self.repository.update(image_id, update_data.dict(exclude_unset=True))

    def delete_image(self, image_id: int) -> bool:
        """Delete image and its file."""
        image = self.repository.get(image_id)
        if not image:
            return False

        # Delete the file
        if image.is_s3_stored:
            if image.s3_bucket:
                self._delete_s3(image.file_path, image.s3_bucket)
        else:
            self._delete_local(image.file_path)

        # Delete database record
        return self.repository.delete(image_id)

    def get_project_storage_usage(self, project_id: int) -> dict:
        """Get storage usage statistics for a project."""
        total_images = self.repository.count_by_project_id(project_id)
        total_size = self.repository.get_total_size_by_project_id(project_id)
        
        return {
            "project_id": project_id,
            "total_images": total_images,
            "total_size_bytes": total_size,
            "total_size_mb": round(total_size / (1024 * 1024), 2) if total_size > 0 else 0
        }

    def get_image_url(self, image: ImageDB) -> str:
        """Generate URL for accessing an image."""
        if image.is_s3_stored and settings.S3_BASE_URL:
            return f"{settings.S3_BASE_URL}/{image.file_path}"
        else:
            # For local storage, return a relative URL that the API will serve
            return f"/api/v1/images/{image.filename}/file"