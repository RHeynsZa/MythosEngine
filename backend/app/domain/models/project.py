"""
Project domain model.

Represents a project or campaign that contains articles.
"""

from datetime import datetime
from typing import Optional
from dataclasses import dataclass


@dataclass
class Project:
    """
    Project domain model.
    
    A project represents a campaign, world, or collection of related content.
    """
    name: str
    description: Optional[str] = None
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __post_init__(self):
        if not self.name or not self.name.strip():
            raise ValueError("Project name is required and cannot be empty")

    def update_description(self, description: str) -> None:
        """Update the project description."""
        self.description = description

    def is_empty(self) -> bool:
        """Check if the project has no description."""
        return not self.description or not self.description.strip()