"""
Image API endpoints.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.services.image_service import ImageService, ImageStorageError
from app.schemas.image import ImageResponse, ImageListResponse, ImageUpdate, ImageUploadResponse
from app.core.config import settings

router = APIRouter()


@router.post("/upload", response_model=ImageUploadResponse)
async def upload_image(
    project_id: int = Form(...),
    alt_text: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload an image file.
    
    - **project_id**: ID of the project this image belongs to
    - **alt_text**: Optional accessibility description
    - **file**: Image file to upload
    """
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Create image service and upload
        image_service = ImageService(db)
        image = image_service.upload_image(
            file_content=file_content,
            original_filename=file.filename or "unknown",
            mime_type=file.content_type,
            project_id=project_id,
            alt_text=alt_text
        )
        
        # Generate response with URL
        url = image_service.get_image_url(image)
        
        return ImageUploadResponse(
            id=image.id,
            filename=image.filename,
            original_filename=image.original_filename,
            file_size=image.file_size,
            mime_type=image.mime_type,
            width=image.width,
            height=image.height,
            url=url,
            project_id=image.project_id,
            created_at=image.created_at
        )
        
    except ImageStorageError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")


@router.get("/project/{project_id}", response_model=ImageListResponse)
def get_project_images(
    project_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """
    Get all images for a specific project with pagination.
    
    - **project_id**: ID of the project
    - **skip**: Number of items to skip (for pagination)
    - **limit**: Maximum number of items to return
    """
    image_service = ImageService(db)
    return image_service.get_images_by_project(project_id, skip, limit)


@router.get("/{image_id}", response_model=ImageResponse)
def get_image(image_id: int, db: Session = Depends(get_db)):
    """
    Get image details by ID.
    
    - **image_id**: ID of the image
    """
    image_service = ImageService(db)
    image = image_service.get_image(image_id)
    
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return ImageResponse.from_orm(image)


@router.get("/{filename}/file")
def get_image_file(filename: str, db: Session = Depends(get_db)):
    """
    Get the actual image file by filename.
    This endpoint serves the image file for local storage.
    
    - **filename**: Filename of the image
    """
    image_service = ImageService(db)
    image = image_service.get_image_by_filename(filename)
    
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    if image.is_s3_stored:
        raise HTTPException(status_code=400, detail="S3 images should be accessed via their S3 URL")
    
    # For local storage, serve the file
    if not image.file_path or not image.file_path.startswith(settings.LOCAL_IMAGES_PATH):
        raise HTTPException(status_code=500, detail="Invalid file path")
    
    return FileResponse(
        path=image.file_path,
        media_type=image.mime_type,
        filename=image.original_filename
    )


@router.put("/{image_id}", response_model=ImageResponse)
def update_image(
    image_id: int,
    update_data: ImageUpdate,
    db: Session = Depends(get_db)
):
    """
    Update image metadata.
    
    - **image_id**: ID of the image to update
    - **update_data**: Updated image data
    """
    image_service = ImageService(db)
    image = image_service.update_image(image_id, update_data)
    
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return ImageResponse.from_orm(image)


@router.delete("/{image_id}")
def delete_image(image_id: int, db: Session = Depends(get_db)):
    """
    Delete an image and its file.
    
    - **image_id**: ID of the image to delete
    """
    image_service = ImageService(db)
    
    if not image_service.delete_image(image_id):
        raise HTTPException(status_code=404, detail="Image not found")
    
    return {"message": "Image deleted successfully"}


@router.get("/project/{project_id}/storage")
def get_project_storage_usage(project_id: int, db: Session = Depends(get_db)):
    """
    Get storage usage statistics for a project.
    
    - **project_id**: ID of the project
    """
    image_service = ImageService(db)
    return image_service.get_project_storage_usage(project_id)