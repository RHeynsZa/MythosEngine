from fastapi import APIRouter
from app.api.api_v1.endpoints import projects, articles, images

api_router = APIRouter()
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(articles.router, prefix="/articles", tags=["articles"])
api_router.include_router(images.router, prefix="/images", tags=["images"])