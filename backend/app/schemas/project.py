from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .article import Article


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class Project(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    articles: List["Article"] = Field(default_factory=list)

    class Config:
        from_attributes = True

# Resolve forward references for Pydantic v2
try:
    from .article import Article  # noqa: F401
    Project.model_rebuild()
except Exception:
    # In case of import timing issues during module import, FastAPI will rebuild later
    pass
