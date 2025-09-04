"""
Person domain model.

Represents characters, NPCs, and historical figures. Built on top of the Article model.
"""

from datetime import datetime, date
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from enum import Enum
from .article import Article, ArticleContent, ArticleType


class Gender(Enum):
    """Gender options for persons."""
    MALE = "male"
    FEMALE = "female"
    NON_BINARY = "non_binary"
    OTHER = "other"
    UNKNOWN = "unknown"


class LifeStatus(Enum):
    """Life status of a person."""
    ALIVE = "alive"
    DEAD = "dead"
    MISSING = "missing"
    UNKNOWN = "unknown"
    UNDEAD = "undead"
    IMMORTAL = "immortal"


@dataclass
class ImportantDate:
    """Represents an important date in a person's life."""
    date: str  # Could be partial like "Summer 1425" or exact "1425-06-15"
    event: str
    description: Optional[str] = None
    location: Optional[str] = None

    def __post_init__(self):
        if not self.event:
            raise ValueError("Event description is required for important dates")


@dataclass
class Relationship:
    """Represents a relationship to another person."""
    person_name: str
    relationship_type: str  # family, friend, enemy, ally, etc.
    description: Optional[str] = None
    status: str = "active"  # active, ended, complicated, etc.


@dataclass
class PersonData:
    """Specific data for persons."""
    race: Optional[str] = None
    gender: Optional[Gender] = None
    age: Optional[int] = None
    life_status: LifeStatus = LifeStatus.UNKNOWN
    
    # Physical characteristics
    height: Optional[str] = None
    weight: Optional[str] = None
    eye_color: Optional[str] = None
    hair_color: Optional[str] = None
    distinguishing_marks: List[str] = None
    
    # Background
    birthplace: Optional[str] = None
    current_location: Optional[str] = None
    occupation: Optional[str] = None
    social_class: Optional[str] = None
    
    # Important dates and events
    birth_date: Optional[str] = None
    death_date: Optional[str] = None
    important_dates: List[ImportantDate] = None
    
    # Relationships
    relationships: List[Relationship] = None
    
    # Abilities and traits
    skills: List[str] = None
    abilities: List[str] = None
    personality_traits: List[str] = None
    
    # Story elements
    goals: List[str] = None
    fears: List[str] = None
    secrets: List[str] = None
    
    # Equipment and possessions
    notable_possessions: List[str] = None
    wealth: Optional[str] = None  # poor, modest, wealthy, rich
    
    # Affiliations
    organizations: List[str] = None
    titles: List[str] = None
    
    def __post_init__(self):
        if self.distinguishing_marks is None:
            self.distinguishing_marks = []
        if self.important_dates is None:
            self.important_dates = []
        if self.relationships is None:
            self.relationships = []
        if self.skills is None:
            self.skills = []
        if self.abilities is None:
            self.abilities = []
        if self.personality_traits is None:
            self.personality_traits = []
        if self.goals is None:
            self.goals = []
        if self.fears is None:
            self.fears = []
        if self.secrets is None:
            self.secrets = []
        if self.notable_possessions is None:
            self.notable_possessions = []
        if self.organizations is None:
            self.organizations = []
        if self.titles is None:
            self.titles = []
        if isinstance(self.gender, str):
            self.gender = Gender(self.gender)
        if isinstance(self.life_status, str):
            self.life_status = LifeStatus(self.life_status)


@dataclass
class Person:
    """
    Person domain model built on top of Article.
    
    Represents characters, NPCs, historical figures, and other persons.
    """
    article: Article
    person_data: PersonData

    def __post_init__(self):
        # Ensure the article type is set to character
        self.article.article_type = ArticleType.CHARACTER
        
        # Store person-specific data in article metadata
        self.article.set_metadata("person_data", self.person_data)
        
        # Add relevant tags
        if self.person_data.race:
            self.article.add_tag(f"race:{self.person_data.race.lower()}")
        if self.person_data.occupation:
            self.article.add_tag(f"occupation:{self.person_data.occupation.lower()}")
        if self.person_data.life_status:
            self.article.add_tag(f"status:{self.person_data.life_status.value}")

    @classmethod
    def create(
        cls,
        name: str,
        project_id: int,
        race: Optional[str] = None,
        gender: Optional[Gender] = None,
        age: Optional[int] = None,
        occupation: Optional[str] = None,
        **kwargs
    ) -> "Person":
        """Create a new person with basic information."""
        content = ArticleContent(
            summary=f"A character in the world."
        )
        
        article = Article(
            title=name,
            content=content,
            article_type=ArticleType.CHARACTER,
            project_id=project_id
        )
        
        person_data = PersonData(
            race=race,
            gender=gender,
            age=age,
            occupation=occupation,
            **kwargs
        )
        
        return cls(article=article, person_data=person_data)

    @property
    def name(self) -> str:
        """Get the person's name."""
        return self.article.title

    @property
    def id(self) -> Optional[int]:
        """Get the person ID."""
        return self.article.id

    def add_important_date(self, date: str, event: str, description: Optional[str] = None, location: Optional[str] = None) -> None:
        """Add an important date to the person's timeline."""
        important_date = ImportantDate(
            date=date,
            event=event,
            description=description,
            location=location
        )
        self.person_data.important_dates.append(important_date)

    def add_relationship(self, person_name: str, relationship_type: str, description: Optional[str] = None) -> None:
        """Add a relationship to another person."""
        relationship = Relationship(
            person_name=person_name,
            relationship_type=relationship_type,
            description=description
        )
        self.person_data.relationships.append(relationship)

    def add_skill(self, skill: str) -> None:
        """Add a skill to the person."""
        if skill not in self.person_data.skills:
            self.person_data.skills.append(skill)

    def add_organization(self, organization: str) -> None:
        """Add an organization affiliation."""
        if organization not in self.person_data.organizations:
            self.person_data.organizations.append(organization)

    def add_title(self, title: str) -> None:
        """Add a title to the person."""
        if title not in self.person_data.titles:
            self.person_data.titles.append(title)

    def set_birth_date(self, birth_date: str) -> None:
        """Set the person's birth date."""
        self.person_data.birth_date = birth_date
        self.add_important_date(birth_date, "Birth")

    def set_death_date(self, death_date: str) -> None:
        """Set the person's death date and update life status."""
        self.person_data.death_date = death_date
        self.person_data.life_status = LifeStatus.DEAD
        self.add_important_date(death_date, "Death")

    def is_alive(self) -> bool:
        """Check if the person is currently alive."""
        return self.person_data.life_status == LifeStatus.ALIVE

    def get_age_description(self) -> str:
        """Get a description of the person's age."""
        if not self.person_data.age:
            return "Age unknown"
        
        age = self.person_data.age
        if age < 13:
            return f"Child ({age} years old)"
        elif age < 20:
            return f"Teenager ({age} years old)"
        elif age < 30:
            return f"Young adult ({age} years old)"
        elif age < 50:
            return f"Adult ({age} years old)"
        elif age < 70:
            return f"Middle-aged ({age} years old)"
        else:
            return f"Elder ({age} years old)"