"""
Person Pydantic schemas for API validation.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from enum import Enum


class GenderEnum(str, Enum):
    """Gender options for API."""
    MALE = "male"
    FEMALE = "female"
    NON_BINARY = "non_binary"
    OTHER = "other"
    UNKNOWN = "unknown"


class LifeStatusEnum(str, Enum):
    """Life status options for API."""
    ALIVE = "alive"
    DEAD = "dead"
    MISSING = "missing"
    UNKNOWN = "unknown"
    UNDEAD = "undead"
    IMMORTAL = "immortal"


class ImportantDateSchema(BaseModel):
    """Schema for important dates."""
    date: str = Field(..., description="Date of the event (can be partial like 'Summer 1425')")
    event: str = Field(..., description="Description of the event")
    description: Optional[str] = Field(None, description="Additional details about the event")
    location: Optional[str] = Field(None, description="Location where the event occurred")


class RelationshipSchema(BaseModel):
    """Schema for relationships."""
    person_name: str = Field(..., description="Name of the related person")
    relationship_type: str = Field(..., description="Type of relationship (family, friend, enemy, etc.)")
    description: Optional[str] = Field(None, description="Description of the relationship")
    status: str = Field(default="active", description="Status of the relationship")


class PersonBase(BaseModel):
    """Base schema for person data."""
    name: str = Field(..., description="Name of the person")
    description: Optional[str] = Field(None, description="General description or summary")
    race: Optional[str] = Field(None, description="Race or species of the person")
    gender: Optional[GenderEnum] = Field(None, description="Gender of the person")
    age: Optional[int] = Field(None, ge=0, le=10000, description="Age of the person")
    occupation: Optional[str] = Field(None, description="Primary occupation or job")
    current_location: Optional[str] = Field(None, description="Current location or residence")


class PersonCreate(PersonBase):
    """Schema for creating a new person."""
    project_id: int = Field(..., description="ID of the project this person belongs to")


class PersonUpdate(BaseModel):
    """Schema for updating a person."""
    name: Optional[str] = Field(None, description="Name of the person")
    description: Optional[str] = Field(None, description="General description or summary")
    race: Optional[str] = Field(None, description="Race or species of the person")
    gender: Optional[GenderEnum] = Field(None, description="Gender of the person")
    age: Optional[int] = Field(None, ge=0, le=10000, description="Age of the person")
    occupation: Optional[str] = Field(None, description="Primary occupation or job")
    current_location: Optional[str] = Field(None, description="Current location or residence")


class PersonDetailed(PersonBase):
    """Detailed schema for person with extended information."""
    id: int
    project_id: int
    life_status: LifeStatusEnum
    
    # Physical characteristics
    height: Optional[str] = None
    weight: Optional[str] = None
    eye_color: Optional[str] = None
    hair_color: Optional[str] = None
    distinguishing_marks: List[str] = []
    
    # Background
    birthplace: Optional[str] = None
    social_class: Optional[str] = None
    
    # Important dates and events
    birth_date: Optional[str] = None
    death_date: Optional[str] = None
    important_dates: List[ImportantDateSchema] = []
    
    # Relationships
    relationships: List[RelationshipSchema] = []
    
    # Abilities and traits
    skills: List[str] = []
    abilities: List[str] = []
    personality_traits: List[str] = []
    
    # Story elements
    goals: List[str] = []
    fears: List[str] = []
    secrets: List[str] = []
    
    # Equipment and possessions
    notable_possessions: List[str] = []
    wealth: Optional[str] = None
    
    # Affiliations
    organizations: List[str] = []
    titles: List[str] = []
    
    # Timestamps
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Person(PersonBase):
    """Standard schema for person response."""
    id: int
    project_id: int
    life_status: LifeStatusEnum
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True