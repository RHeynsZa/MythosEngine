"""
Person service for business logic operations.
"""

from sqlalchemy.orm import Session
from app.domain.models.person import Person, PersonData, Gender, LifeStatus
from app.domain.models.article import Article, ArticleContent, ArticleType
from app.repositories.person_repository import PersonRepository
from app.schemas.person import PersonCreate, PersonUpdate
from typing import Optional, List


class PersonService:
    """Service layer for person operations using domain models and repositories."""

    def __init__(self, db: Session):
        self.repository = PersonRepository(db)

    def get_person(self, person_id: int) -> Optional[Person]:
        """Get a person by ID."""
        db_person = self.repository.get_by_id(person_id)
        if db_person:
            return self.repository.to_domain(db_person)
        return None

    def get_persons(self, skip: int = 0, limit: int = 100) -> List[Person]:
        """Get all persons with pagination."""
        db_persons = self.repository.get_all(skip, limit)
        return [self.repository.to_domain(db_person) for db_person in db_persons]

    def get_persons_by_race(self, race: str, skip: int = 0, limit: int = 100) -> List[Person]:
        """Get persons by race."""
        db_persons = self.repository.get_by_race(race, skip, limit)
        return [self.repository.to_domain(db_person) for db_person in db_persons]

    def get_persons_by_location(self, location: str, skip: int = 0, limit: int = 100) -> List[Person]:
        """Get persons by current location."""
        db_persons = self.repository.get_by_location(location, skip, limit)
        return [self.repository.to_domain(db_person) for db_person in db_persons]

    def get_persons_by_occupation(self, occupation: str, skip: int = 0, limit: int = 100) -> List[Person]:
        """Get persons by occupation."""
        db_persons = self.repository.get_by_occupation(occupation, skip, limit)
        return [self.repository.to_domain(db_person) for db_person in db_persons]

    def get_alive_persons(self, skip: int = 0, limit: int = 100) -> List[Person]:
        """Get all living persons."""
        db_persons = self.repository.get_alive_persons(skip, limit)
        return [self.repository.to_domain(db_person) for db_person in db_persons]

    def create_person(self, person_data: PersonCreate) -> Person:
        """Create a new person."""
        # Create the person using the domain model factory method
        domain_person = Person.create(
            name=person_data.name,
            project_id=person_data.project_id,
            race=person_data.race,
            gender=Gender(person_data.gender) if person_data.gender else None,
            age=person_data.age,
            occupation=person_data.occupation
        )

        # Set additional fields if provided
        if person_data.description:
            domain_person.article.content.summary = person_data.description

        return self.repository.create_from_domain(domain_person)

    def update_person(self, person_id: int, person_data: PersonUpdate) -> Optional[Person]:
        """Update an existing person."""
        # Get current person
        current_person = self.get_person(person_id)
        if not current_person:
            return None

        # Update fields that are provided
        if person_data.name is not None:
            current_person.article.title = person_data.name
        if person_data.description is not None:
            current_person.article.content.summary = person_data.description
        if person_data.race is not None:
            current_person.person_data.race = person_data.race
        if person_data.gender is not None:
            current_person.person_data.gender = Gender(person_data.gender)
        if person_data.age is not None:
            current_person.person_data.age = person_data.age
        if person_data.occupation is not None:
            current_person.person_data.occupation = person_data.occupation
        if person_data.current_location is not None:
            current_person.person_data.current_location = person_data.current_location

        return self.repository.update_from_domain(current_person)

    def delete_person(self, person_id: int) -> Optional[Person]:
        """Delete a person."""
        # Get the person before deletion
        person = self.get_person(person_id)
        if person:
            self.repository.delete(person_id)
        return person

    def add_important_date(self, person_id: int, date: str, event: str, 
                          description: Optional[str] = None, location: Optional[str] = None) -> Optional[Person]:
        """Add an important date to a person's timeline."""
        person = self.get_person(person_id)
        if person:
            person.add_important_date(date, event, description, location)
            return self.repository.update_from_domain(person)
        return None

    def add_relationship(self, person_id: int, other_person_name: str, 
                        relationship_type: str, description: Optional[str] = None) -> Optional[Person]:
        """Add a relationship to another person."""
        person = self.get_person(person_id)
        if person:
            person.add_relationship(other_person_name, relationship_type, description)
            return self.repository.update_from_domain(person)
        return None