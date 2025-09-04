"""
Settlement Pydantic schemas for API validation.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Dict, Any
from enum import Enum


class SettlementTypeEnum(str, Enum):
    """Settlement type options for API."""
    CITY = "city"
    TOWN = "town"
    VILLAGE = "village"
    HAMLET = "hamlet"
    METROPOLIS = "metropolis"
    CAPITAL = "capital"
    FORTRESS = "fortress"
    OUTPOST = "outpost"
    TRADING_POST = "trading_post"
    RUINS = "ruins"


class GovernmentTypeEnum(str, Enum):
    """Government type options for API."""
    MONARCHY = "monarchy"
    DEMOCRACY = "democracy"
    OLIGARCHY = "oligarchy"
    THEOCRACY = "theocracy"
    TRIBAL = "tribal"
    ANARCHY = "anarchy"
    COUNCIL = "council"
    DICTATORSHIP = "dictatorship"


class SettlementBase(BaseModel):
    """Base schema for settlement data."""
    name: str = Field(..., description="Name of the settlement")
    description: Optional[str] = Field(None, description="General description or summary")
    settlement_type: SettlementTypeEnum = Field(..., description="Type of settlement")
    population: Optional[int] = Field(None, ge=0, description="Population count")
    government_type: Optional[GovernmentTypeEnum] = Field(None, description="Type of government")
    region: Optional[str] = Field(None, description="Region or area where settlement is located")
    ruler_name: Optional[str] = Field(None, description="Name of the current ruler or leader")


class SettlementCreate(SettlementBase):
    """Schema for creating a new settlement."""
    project_id: int = Field(..., description="ID of the project this settlement belongs to")


class SettlementUpdate(BaseModel):
    """Schema for updating a settlement."""
    name: Optional[str] = Field(None, description="Name of the settlement")
    description: Optional[str] = Field(None, description="General description or summary")
    settlement_type: Optional[SettlementTypeEnum] = Field(None, description="Type of settlement")
    population: Optional[int] = Field(None, ge=0, description="Population count")
    government_type: Optional[GovernmentTypeEnum] = Field(None, description="Type of government")
    region: Optional[str] = Field(None, description="Region or area where settlement is located")
    ruler_name: Optional[str] = Field(None, description="Name of the current ruler or leader")


class SettlementDetailed(SettlementBase):
    """Detailed schema for settlement with extended information."""
    id: int
    project_id: int
    
    # Additional settlement details
    founded_date: Optional[str] = None
    notable_features: List[str] = []
    trade_goods: List[str] = []
    defenses: Optional[str] = None
    climate: Optional[str] = None
    terrain: Optional[str] = None
    wealth_level: Optional[str] = None
    
    # Geographic data
    coordinates: Optional[Dict[str, float]] = None
    nearby_settlements: List[str] = []
    
    # Economic data
    primary_industry: Optional[str] = None
    secondary_industries: List[str] = []
    
    # Cultural data
    predominant_race: Optional[str] = None
    languages_spoken: List[str] = []
    religions: List[str] = []
    festivals: List[str] = []
    
    # Timestamps
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Settlement(SettlementBase):
    """Standard schema for settlement response."""
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SettlementSummary(BaseModel):
    """Summary schema for settlement lists."""
    id: int
    name: str
    settlement_type: SettlementTypeEnum
    population: Optional[int] = None
    region: Optional[str] = None
    population_category: str = Field(..., description="Population size category (tiny, small, medium, etc.)")

    class Config:
        from_attributes = True