"""
Settlement domain model.

Represents settlements like cities, towns, villages, etc. Built on top of the Article model.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from enum import Enum
from .article import Article, ArticleContent, ArticleType


class SettlementType(Enum):
    """Types of settlements."""
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


class GovernmentType(Enum):
    """Types of government for settlements."""
    MONARCHY = "monarchy"
    DEMOCRACY = "democracy"
    OLIGARCHY = "oligarchy"
    THEOCRACY = "theocracy"
    TRIBAL = "tribal"
    ANARCHY = "anarchy"
    COUNCIL = "council"
    DICTATORSHIP = "dictatorship"


@dataclass
class SettlementData:
    """Specific data for settlements."""
    settlement_type: SettlementType
    population: Optional[int] = None
    government_type: Optional[GovernmentType] = None
    ruler_name: Optional[str] = None
    founded_date: Optional[str] = None
    notable_features: List[str] = None
    trade_goods: List[str] = None
    defenses: Optional[str] = None
    climate: Optional[str] = None
    terrain: Optional[str] = None
    wealth_level: Optional[str] = None  # poor, modest, wealthy, rich
    
    # Geographic data
    coordinates: Optional[Dict[str, float]] = None  # {"lat": 0.0, "lng": 0.0}
    region: Optional[str] = None
    nearby_settlements: List[str] = None
    
    # Economic data
    primary_industry: Optional[str] = None
    secondary_industries: List[str] = None
    
    # Cultural data
    predominant_race: Optional[str] = None
    languages_spoken: List[str] = None
    religions: List[str] = None
    festivals: List[str] = None

    def __post_init__(self):
        if self.notable_features is None:
            self.notable_features = []
        if self.trade_goods is None:
            self.trade_goods = []
        if self.nearby_settlements is None:
            self.nearby_settlements = []
        if self.secondary_industries is None:
            self.secondary_industries = []
        if self.languages_spoken is None:
            self.languages_spoken = []
        if self.religions is None:
            self.religions = []
        if self.festivals is None:
            self.festivals = []
        if isinstance(self.settlement_type, str):
            self.settlement_type = SettlementType(self.settlement_type)
        if isinstance(self.government_type, str):
            self.government_type = GovernmentType(self.government_type)


@dataclass
class Settlement:
    """
    Settlement domain model built on top of Article.
    
    Represents any kind of settlement from small villages to large cities.
    """
    article: Article
    settlement_data: SettlementData

    def __post_init__(self):
        # Ensure the article type is set to location
        self.article.article_type = ArticleType.LOCATION
        
        # Store settlement-specific data in article metadata
        self.article.set_metadata("settlement_data", self.settlement_data)
        
        # Add settlement type as a tag
        self.article.add_tag(f"settlement:{self.settlement_data.settlement_type.value}")

    @classmethod
    def create(
        cls,
        title: str,
        settlement_type: SettlementType,
        project_id: int,
        population: Optional[int] = None,
        government_type: Optional[GovernmentType] = None,
        **kwargs
    ) -> "Settlement":
        """Create a new settlement with basic information."""
        content = ArticleContent(
            summary=f"A {settlement_type.value} in the world."
        )
        
        article = Article(
            title=title,
            content=content,
            article_type=ArticleType.LOCATION,
            project_id=project_id
        )
        
        settlement_data = SettlementData(
            settlement_type=settlement_type,
            population=population,
            government_type=government_type,
            **kwargs
        )
        
        return cls(article=article, settlement_data=settlement_data)

    @property
    def title(self) -> str:
        """Get the settlement title."""
        return self.article.title

    @property
    def id(self) -> Optional[int]:
        """Get the settlement ID."""
        return self.article.id

    @property
    def population_category(self) -> str:
        """Categorize settlement by population size."""
        if not self.settlement_data.population:
            return "unknown"
        
        pop = self.settlement_data.population
        if pop < 100:
            return "tiny"
        elif pop < 1000:
            return "small"
        elif pop < 5000:
            return "medium"
        elif pop < 20000:
            return "large"
        elif pop < 100000:
            return "very_large"
        else:
            return "massive"

    def add_notable_feature(self, feature: str) -> None:
        """Add a notable feature to the settlement."""
        if feature not in self.settlement_data.notable_features:
            self.settlement_data.notable_features.append(feature)

    def add_trade_good(self, good: str) -> None:
        """Add a trade good to the settlement."""
        if good not in self.settlement_data.trade_goods:
            self.settlement_data.trade_goods.append(good)

    def set_ruler(self, ruler_name: str) -> None:
        """Set the ruler of the settlement."""
        self.settlement_data.ruler_name = ruler_name

    def add_nearby_settlement(self, settlement_name: str) -> None:
        """Add a nearby settlement."""
        if settlement_name not in self.settlement_data.nearby_settlements:
            self.settlement_data.nearby_settlements.append(settlement_name)