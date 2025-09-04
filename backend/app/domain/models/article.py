"""
Article domain model - the base model in our hierarchy.

This represents the core business logic for articles without any database concerns.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from enum import Enum


class ArticleType(Enum):
    """Types of articles supported in the system."""
    GENERAL = "general"
    CHARACTER = "character"
    LOCATION = "location"
    ITEM = "item"
    LORE = "lore"
    EVENT = "event"
    ORGANIZATION = "organization"


@dataclass
class ArticleContent:
    """Structured content for articles."""
    main_content: Optional[str] = None
    sidebar_content: Optional[str] = None
    footer_content: Optional[str] = None
    summary: Optional[str] = None
    tags: List[str] = None
    metadata: Dict[str, Any] = None

    def __post_init__(self):
        if self.tags is None:
            self.tags = []
        if self.metadata is None:
            self.metadata = {}


@dataclass
class Article:
    """
    Base article domain model.
    
    This is the fundamental unit of content in our system. All other content
    types (settlements, persons, etc.) can be represented as specialized articles.
    """
    title: str
    content: ArticleContent
    article_type: ArticleType
    project_id: int
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __post_init__(self):
        if isinstance(self.content, dict):
            self.content = ArticleContent(**self.content)
        if isinstance(self.article_type, str):
            self.article_type = ArticleType(self.article_type)

    def add_tag(self, tag: str) -> None:
        """Add a tag to the article if it doesn't already exist."""
        if tag not in self.content.tags:
            self.content.tags.append(tag)

    def remove_tag(self, tag: str) -> None:
        """Remove a tag from the article if it exists."""
        if tag in self.content.tags:
            self.content.tags.remove(tag)

    def set_metadata(self, key: str, value: Any) -> None:
        """Set a metadata value for the article."""
        self.content.metadata[key] = value

    def get_metadata(self, key: str, default: Any = None) -> Any:
        """Get a metadata value from the article."""
        return self.content.metadata.get(key, default)

    def is_empty(self) -> bool:
        """Check if the article has any meaningful content."""
        return (
            not self.content.main_content and
            not self.content.sidebar_content and
            not self.content.footer_content and
            not self.content.summary and
            not self.content.tags and
            not self.content.metadata
        )

    def word_count(self) -> int:
        """Calculate approximate word count of the article content."""
        total_words = 0
        for content in [self.content.main_content, self.content.sidebar_content, 
                       self.content.footer_content, self.content.summary]:
            if content:
                total_words += len(content.split())
        return total_words