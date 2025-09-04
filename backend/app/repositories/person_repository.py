"""
Person repository for database operations.
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.models.person import PersonDB
from app.db.models.article import ArticleDB
from app.domain.models.person import Person, PersonData, Gender, LifeStatus, ImportantDate, Relationship
from app.domain.models.article import Article, ArticleContent, ArticleType
from .base_repository import BaseRepository


class PersonRepository(BaseRepository[PersonDB, Person]):
    """Repository for person database operations."""

    def __init__(self, db: Session):
        super().__init__(db, PersonDB)

    def get_by_race(self, race: str, skip: int = 0, limit: int = 100) -> List[PersonDB]:
        """Get persons by race."""
        return (
            self.db.query(PersonDB)
            .filter(PersonDB.race.ilike(f"%{race}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_location(self, location: str, skip: int = 0, limit: int = 100) -> List[PersonDB]:
        """Get persons by current location."""
        return (
            self.db.query(PersonDB)
            .filter(PersonDB.current_location.ilike(f"%{location}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_occupation(self, occupation: str, skip: int = 0, limit: int = 100) -> List[PersonDB]:
        """Get persons by occupation."""
        return (
            self.db.query(PersonDB)
            .filter(PersonDB.occupation.ilike(f"%{occupation}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_alive_persons(self, skip: int = 0, limit: int = 100) -> List[PersonDB]:
        """Get all living persons."""
        return (
            self.db.query(PersonDB)
            .filter(PersonDB.life_status == "alive")
            .offset(skip)
            .limit(limit)
            .all()
        )

    def to_domain(self, db_obj: PersonDB) -> Person:
        """Convert database model to domain model."""
        # Get the associated article
        article_db = self.db.query(ArticleDB).filter(ArticleDB.id == db_obj.article_id).first()
        if not article_db:
            raise ValueError(f"Article not found for person {db_obj.id}")

        # Convert article
        content = ArticleContent()
        if article_db.content:
            content = ArticleContent(**article_db.content)

        article = Article(
            id=article_db.id,
            title=article_db.title,
            content=content,
            article_type=ArticleType(article_db.article_type),
            project_id=article_db.project_id,
            created_at=article_db.created_at,
            updated_at=article_db.updated_at
        )

        # Convert person data
        person_data_dict = db_obj.person_data or {}
        
        # Convert important dates
        important_dates = []
        for date_data in person_data_dict.get("important_dates", []):
            important_dates.append(ImportantDate(**date_data))

        # Convert relationships
        relationships = []
        for rel_data in person_data_dict.get("relationships", []):
            relationships.append(Relationship(**rel_data))

        person_data = PersonData(
            race=person_data_dict.get("race"),
            gender=Gender(person_data_dict["gender"]) if person_data_dict.get("gender") else None,
            age=person_data_dict.get("age"),
            life_status=LifeStatus(person_data_dict.get("life_status", "unknown")),
            height=person_data_dict.get("height"),
            weight=person_data_dict.get("weight"),
            eye_color=person_data_dict.get("eye_color"),
            hair_color=person_data_dict.get("hair_color"),
            distinguishing_marks=person_data_dict.get("distinguishing_marks", []),
            birthplace=person_data_dict.get("birthplace"),
            current_location=person_data_dict.get("current_location"),
            occupation=person_data_dict.get("occupation"),
            social_class=person_data_dict.get("social_class"),
            birth_date=person_data_dict.get("birth_date"),
            death_date=person_data_dict.get("death_date"),
            important_dates=important_dates,
            relationships=relationships,
            skills=person_data_dict.get("skills", []),
            abilities=person_data_dict.get("abilities", []),
            personality_traits=person_data_dict.get("personality_traits", []),
            goals=person_data_dict.get("goals", []),
            fears=person_data_dict.get("fears", []),
            secrets=person_data_dict.get("secrets", []),
            notable_possessions=person_data_dict.get("notable_possessions", []),
            wealth=person_data_dict.get("wealth"),
            organizations=person_data_dict.get("organizations", []),
            titles=person_data_dict.get("titles", [])
        )

        return Person(article=article, person_data=person_data)

    def from_domain(self, domain_obj: Person) -> tuple[ArticleDB, PersonDB]:
        """Convert domain model to database models."""
        # Convert article
        content_dict = {}
        if domain_obj.article.content:
            content_dict = {
                "main_content": domain_obj.article.content.main_content,
                "sidebar_content": domain_obj.article.content.sidebar_content,
                "footer_content": domain_obj.article.content.footer_content,
                "summary": domain_obj.article.content.summary,
                "tags": domain_obj.article.content.tags,
                "metadata": domain_obj.article.content.metadata
            }

        article_db = ArticleDB(
            title=domain_obj.article.title,
            content=content_dict,
            article_type=domain_obj.article.article_type.value,
            project_id=domain_obj.article.project_id
        )

        if domain_obj.article.id:
            article_db.id = domain_obj.article.id

        # Convert person data
        important_dates_data = []
        for date in domain_obj.person_data.important_dates:
            important_dates_data.append({
                "date": date.date,
                "event": date.event,
                "description": date.description,
                "location": date.location
            })

        relationships_data = []
        for rel in domain_obj.person_data.relationships:
            relationships_data.append({
                "person_name": rel.person_name,
                "relationship_type": rel.relationship_type,
                "description": rel.description,
                "status": rel.status
            })

        person_data_dict = {
            "race": domain_obj.person_data.race,
            "gender": domain_obj.person_data.gender.value if domain_obj.person_data.gender else None,
            "age": domain_obj.person_data.age,
            "life_status": domain_obj.person_data.life_status.value,
            "height": domain_obj.person_data.height,
            "weight": domain_obj.person_data.weight,
            "eye_color": domain_obj.person_data.eye_color,
            "hair_color": domain_obj.person_data.hair_color,
            "distinguishing_marks": domain_obj.person_data.distinguishing_marks,
            "birthplace": domain_obj.person_data.birthplace,
            "current_location": domain_obj.person_data.current_location,
            "occupation": domain_obj.person_data.occupation,
            "social_class": domain_obj.person_data.social_class,
            "birth_date": domain_obj.person_data.birth_date,
            "death_date": domain_obj.person_data.death_date,
            "important_dates": important_dates_data,
            "relationships": relationships_data,
            "skills": domain_obj.person_data.skills,
            "abilities": domain_obj.person_data.abilities,
            "personality_traits": domain_obj.person_data.personality_traits,
            "goals": domain_obj.person_data.goals,
            "fears": domain_obj.person_data.fears,
            "secrets": domain_obj.person_data.secrets,
            "notable_possessions": domain_obj.person_data.notable_possessions,
            "wealth": domain_obj.person_data.wealth,
            "organizations": domain_obj.person_data.organizations,
            "titles": domain_obj.person_data.titles
        }

        person_db = PersonDB(
            person_data=person_data_dict,
            race=domain_obj.person_data.race,
            gender=domain_obj.person_data.gender.value if domain_obj.person_data.gender else None,
            life_status=domain_obj.person_data.life_status.value,
            occupation=domain_obj.person_data.occupation,
            current_location=domain_obj.person_data.current_location
        )

        return article_db, person_db

    def create_from_domain(self, domain_obj: Person) -> Person:
        """Create a new person from domain model."""
        article_db, person_db = self.from_domain(domain_obj)
        
        # Create article first
        self.db.add(article_db)
        self.db.flush()  # Get the article ID without committing
        
        # Set the article_id on person
        person_db.article_id = article_db.id
        
        # Create person
        created_person_db = self.create(person_db)
        
        return self.to_domain(created_person_db)

    def update_from_domain(self, domain_obj: Person) -> Optional[Person]:
        """Update a person from domain model."""
        if not domain_obj.id:
            return None

        person_db = self.get_by_id(domain_obj.id)
        if not person_db:
            return None

        # Update article
        article_db = self.db.query(ArticleDB).filter(ArticleDB.id == person_db.article_id).first()
        if article_db:
            article_db.title = domain_obj.article.title
            article_db.article_type = domain_obj.article.article_type.value
            
            if domain_obj.article.content:
                article_db.content = {
                    "main_content": domain_obj.article.content.main_content,
                    "sidebar_content": domain_obj.article.content.sidebar_content,
                    "footer_content": domain_obj.article.content.footer_content,
                    "summary": domain_obj.article.content.summary,
                    "tags": domain_obj.article.content.tags,
                    "metadata": domain_obj.article.content.metadata
                }

        # Update person data (similar to from_domain conversion)
        important_dates_data = []
        for date in domain_obj.person_data.important_dates:
            important_dates_data.append({
                "date": date.date,
                "event": date.event,
                "description": date.description,
                "location": date.location
            })

        relationships_data = []
        for rel in domain_obj.person_data.relationships:
            relationships_data.append({
                "person_name": rel.person_name,
                "relationship_type": rel.relationship_type,
                "description": rel.description,
                "status": rel.status
            })

        person_data_dict = {
            "race": domain_obj.person_data.race,
            "gender": domain_obj.person_data.gender.value if domain_obj.person_data.gender else None,
            "age": domain_obj.person_data.age,
            "life_status": domain_obj.person_data.life_status.value,
            "height": domain_obj.person_data.height,
            "weight": domain_obj.person_data.weight,
            "eye_color": domain_obj.person_data.eye_color,
            "hair_color": domain_obj.person_data.hair_color,
            "distinguishing_marks": domain_obj.person_data.distinguishing_marks,
            "birthplace": domain_obj.person_data.birthplace,
            "current_location": domain_obj.person_data.current_location,
            "occupation": domain_obj.person_data.occupation,
            "social_class": domain_obj.person_data.social_class,
            "birth_date": domain_obj.person_data.birth_date,
            "death_date": domain_obj.person_data.death_date,
            "important_dates": important_dates_data,
            "relationships": relationships_data,
            "skills": domain_obj.person_data.skills,
            "abilities": domain_obj.person_data.abilities,
            "personality_traits": domain_obj.person_data.personality_traits,
            "goals": domain_obj.person_data.goals,
            "fears": domain_obj.person_data.fears,
            "secrets": domain_obj.person_data.secrets,
            "notable_possessions": domain_obj.person_data.notable_possessions,
            "wealth": domain_obj.person_data.wealth,
            "organizations": domain_obj.person_data.organizations,
            "titles": domain_obj.person_data.titles
        }

        person_db.person_data = person_data_dict
        person_db.race = domain_obj.person_data.race
        person_db.gender = domain_obj.person_data.gender.value if domain_obj.person_data.gender else None
        person_db.life_status = domain_obj.person_data.life_status.value
        person_db.occupation = domain_obj.person_data.occupation
        person_db.current_location = domain_obj.person_data.current_location

        updated_person_db = self.update(person_db)
        return self.to_domain(updated_person_db)