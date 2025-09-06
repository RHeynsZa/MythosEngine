from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum
from .image import ImageResponse


class ArticleTypeEnum(str, Enum):
    """Article type options for API."""
    GENERAL = "general"
    CHARACTER = "character"
    LOCATION = "location"
    ITEM = "item"
    LORE = "lore"
    EVENT = "event"
    ORGANIZATION = "organization"


class ArticleVisibilityEnum(str, Enum):
    """Article visibility options for API."""
    UNLISTED = "unlisted"  # Only visible to the writer
    PRIVATE = "private"    # Visible to everyone invited to view the project
    PUBLIC = "public"      # Open to anyone (even unauthorized users)


class ArticleContentSchema(BaseModel):
    """Schema for article content structure."""
    main_content: Optional[str] = Field(None, description="Main content of the article")
    sidebar_content: Optional[str] = Field(None, description="Sidebar content")
    footer_content: Optional[str] = Field(None, description="Footer content")
    summary: Optional[str] = Field(None, description="Summary or excerpt")
    tags: List[str] = Field(default_factory=list, description="Tags associated with the article")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


class ArticleBase(BaseModel):
    """Base schema for article data."""
    title: str = Field(..., description="Title of the article")
    content: Optional[ArticleContentSchema] = Field(None, description="Article content structure")
    article_type: ArticleTypeEnum = Field(default=ArticleTypeEnum.GENERAL, description="Type of article")
    visibility: ArticleVisibilityEnum = Field(default=ArticleVisibilityEnum.UNLISTED, description="Visibility mode of the article")
    project_id: int = Field(..., description="ID of the project this article belongs to")
    header_image_id: Optional[int] = Field(None, description="ID of the header image")
    spotify_url: Optional[str] = Field(None, description="Spotify track URL for mood/tone music")


class ArticleCreate(ArticleBase):
    """Schema for creating a new article."""
    pass


class ArticleUpdate(BaseModel):
    """Schema for updating an article."""
    title: Optional[str] = Field(None, description="Title of the article")
    content: Optional[ArticleContentSchema] = Field(None, description="Article content structure")
    article_type: Optional[ArticleTypeEnum] = Field(None, description="Type of article")
    visibility: Optional[ArticleVisibilityEnum] = Field(None, description="Visibility mode of the article")
    header_image_id: Optional[int] = Field(None, description="ID of the header image")
    spotify_url: Optional[str] = Field(None, description="Spotify track URL for mood/tone music")


class Article(ArticleBase):
    """Schema for article response."""
    id: int
    author_id: int = Field(..., description="ID of the article author")
    header_image: Optional[ImageResponse] = Field(None, description="Header image details")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ArticleSummary(BaseModel):
    """Summary schema for article lists."""
    id: int
    title: str
    article_type: ArticleTypeEnum
    visibility: ArticleVisibilityEnum
    author_id: int
    project_id: int
    word_count: int = Field(..., description="Approximate word count")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True