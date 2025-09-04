# Usage Examples

This document provides practical examples of how to use the new organized model architecture.

## API Endpoint Examples

### Article Endpoints

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.article_service import ArticleService
from app.schemas.article import ArticleCreate, ArticleUpdate, Article

router = APIRouter(prefix="/articles", tags=["articles"])

@router.get("/{article_id}", response_model=Article)
def get_article(article_id: int, db: Session = Depends(get_db)):
    service = ArticleService(db)
    article = service.get_article(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@router.post("/", response_model=Article)
def create_article(article_data: ArticleCreate, db: Session = Depends(get_db)):
    service = ArticleService(db)
    return service.create_article(article_data)

@router.put("/{article_id}", response_model=Article)
def update_article(article_id: int, article_data: ArticleUpdate, db: Session = Depends(get_db)):
    service = ArticleService(db)
    article = service.update_article(article_id, article_data)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@router.get("/", response_model=List[Article])
def list_articles(project_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    service = ArticleService(db)
    return service.get_articles(project_id, skip, limit)
```

### Person Endpoints

```python
from app.services.person_service import PersonService
from app.schemas.person import PersonCreate, PersonUpdate, Person, PersonDetailed

@router.get("/{person_id}", response_model=PersonDetailed)
def get_person(person_id: int, db: Session = Depends(get_db)):
    service = PersonService(db)
    person = service.get_person(person_id)
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    return person

@router.post("/", response_model=Person)
def create_person(person_data: PersonCreate, db: Session = Depends(get_db)):
    service = PersonService(db)
    return service.create_person(person_data)

@router.get("/race/{race}", response_model=List[Person])
def get_persons_by_race(race: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    service = PersonService(db)
    return service.get_persons_by_race(race, skip, limit)

@router.post("/{person_id}/important-dates")
def add_important_date(
    person_id: int, 
    date: str, 
    event: str, 
    description: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    service = PersonService(db)
    person = service.add_important_date(person_id, date, event, description, location)
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    return {"message": "Important date added successfully"}
```

### Settlement Endpoints

```python
from app.services.settlement_service import SettlementService
from app.schemas.settlement import SettlementCreate, SettlementUpdate, Settlement, SettlementDetailed

@router.get("/{settlement_id}", response_model=SettlementDetailed)
def get_settlement(settlement_id: int, db: Session = Depends(get_db)):
    service = SettlementService(db)
    settlement = service.get_settlement(settlement_id)
    if not settlement:
        raise HTTPException(status_code=404, detail="Settlement not found")
    return settlement

@router.post("/", response_model=Settlement)
def create_settlement(settlement_data: SettlementCreate, db: Session = Depends(get_db)):
    service = SettlementService(db)
    return service.create_settlement(settlement_data)

@router.get("/type/{settlement_type}", response_model=List[Settlement])
def get_settlements_by_type(settlement_type: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    service = SettlementService(db)
    return service.get_settlements_by_type(settlement_type, skip, limit)

@router.post("/{settlement_id}/features")
def add_notable_feature(settlement_id: int, feature: str, db: Session = Depends(get_db)):
    service = SettlementService(db)
    settlement = service.add_notable_feature(settlement_id, feature)
    if not settlement:
        raise HTTPException(status_code=404, detail="Settlement not found")
    return {"message": "Notable feature added successfully"}
```

## Direct Service Usage

### Working with Domain Models

```python
from app.domain.models import Person, Settlement, Article
from app.domain.models.person import Gender, LifeStatus
from app.domain.models.settlement import SettlementType, GovernmentType

# Create a person using domain model factory
person = Person.create(
    name="Gandalf",
    project_id=1,
    race="Maiar",
    gender=Gender.MALE,
    age=2000,
    occupation="Wizard"
)

# Add important dates
person.add_important_date("T.A. 2941", "Joined the Quest for Erebor")
person.add_important_date("T.A. 3019", "Returned as Gandalf the White")

# Add relationships
person.add_relationship("Frodo Baggins", "mentor", "Guided the Ring-bearer")

# Create a settlement
settlement = Settlement.create(
    title="Rivendell",
    settlement_type=SettlementType.CITY,
    project_id=1,
    population=500,
    government_type=GovernmentType.COUNCIL
)

# Add settlement features
settlement.add_notable_feature("House of Elrond")
settlement.add_notable_feature("Council Chamber")
settlement.add_trade_good("Elven crafts")
```

### Repository Usage (Advanced)

```python
from app.repositories.person_repository import PersonRepository
from app.repositories.settlement_repository import SettlementRepository

# Direct repository usage (typically done within services)
def advanced_person_query(db: Session):
    repo = PersonRepository(db)
    
    # Get all alive elves
    alive_elves = repo.get_by_race("Elf")
    alive_elves = [p for p in alive_elves if repo.to_domain(p).person_data.life_status == LifeStatus.ALIVE]
    
    # Get persons in specific location
    persons_in_gondor = repo.get_by_location("Gondor")
    
    return [repo.to_domain(p) for p in persons_in_gondor]

def settlement_analytics(db: Session):
    repo = SettlementRepository(db)
    
    # Get large cities
    large_cities = repo.get_by_population_range(min_pop=10000, max_pop=None)
    
    # Get all monarchies
    monarchies = repo.get_by_government("monarchy")
    
    return {
        "large_cities": len(large_cities),
        "monarchies": len(monarchies)
    }
```

## Testing Examples

### Unit Testing Domain Models

```python
import pytest
from app.domain.models import Person, Settlement
from app.domain.models.person import Gender, LifeStatus
from app.domain.models.settlement import SettlementType

def test_person_creation():
    person = Person.create(
        name="Test Character",
        project_id=1,
        race="Human",
        gender=Gender.FEMALE,
        age=25
    )
    
    assert person.name == "Test Character"
    assert person.person_data.race == "Human"
    assert person.person_data.gender == Gender.FEMALE
    assert person.is_alive() == False  # Default status is UNKNOWN

def test_person_important_dates():
    person = Person.create("Test", 1)
    person.add_important_date("2024-01-01", "Birth", "Born in a small village")
    
    assert len(person.person_data.important_dates) == 1
    assert person.person_data.important_dates[0].event == "Birth"

def test_settlement_population_category():
    village = Settlement.create("Small Village", SettlementType.VILLAGE, 1, population=50)
    city = Settlement.create("Large City", SettlementType.CITY, 1, population=50000)
    
    assert village.population_category == "tiny"
    assert city.population_category == "large"
```

### Integration Testing with Services

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.database import Base
from app.services.person_service import PersonService
from app.schemas.person import PersonCreate

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_person_service_create(db_session):
    service = PersonService(db_session)
    
    person_data = PersonCreate(
        name="Test Person",
        project_id=1,
        race="Human",
        gender="male",
        age=30
    )
    
    person = service.create_person(person_data)
    assert person.name == "Test Person"
    assert person.id is not None

def test_person_service_query(db_session):
    service = PersonService(db_session)
    
    # Create test data
    person1 = PersonCreate(name="Elf1", project_id=1, race="Elf")
    person2 = PersonCreate(name="Elf2", project_id=1, race="Elf")
    person3 = PersonCreate(name="Human1", project_id=1, race="Human")
    
    service.create_person(person1)
    service.create_person(person2)
    service.create_person(person3)
    
    # Query by race
    elves = service.get_persons_by_race("Elf")
    assert len(elves) == 2
```

## Error Handling

```python
from app.services.person_service import PersonService
from app.schemas.person import PersonCreate

def create_person_with_validation(person_data: dict, db: Session):
    try:
        # Validate with Pydantic schema
        validated_data = PersonCreate(**person_data)
        
        # Use service to create
        service = PersonService(db)
        person = service.create_person(validated_data)
        
        return {"success": True, "person": person}
        
    except ValidationError as e:
        return {"success": False, "errors": e.errors()}
    except Exception as e:
        return {"success": False, "error": str(e)}
```

This architecture provides a clean, testable, and maintainable codebase for complex world-building applications.