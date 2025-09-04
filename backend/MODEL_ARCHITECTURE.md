# Backend Model Architecture

This document describes the reorganized backend model architecture that separates domain logic from database concerns and establishes a clear hierarchy with `Article` as the base model.

## Architecture Overview

The backend now follows a clean architecture pattern with clear separation of concerns:

```
┌─────────────────────┐
│   API Layer        │ (FastAPI endpoints)
├─────────────────────┤
│   Schema Layer     │ (Pydantic models for validation)
├─────────────────────┤
│   Service Layer    │ (Business logic)
├─────────────────────┤
│   Repository Layer │ (Data access abstraction)
├─────────────────────┤
│   Database Layer   │ (SQLAlchemy models)
└─────────────────────┘
```

## Domain Models

Located in `app/domain/models/`, these represent pure business logic without database concerns.

### Article (Base Model)
The fundamental unit of content in the system. All other content types are built on top of articles.

```python
@dataclass
class Article:
    title: str
    content: ArticleContent
    article_type: ArticleType
    project_id: int
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
```

**Features:**
- Rich content structure with main content, sidebar, footer, summary, tags, and metadata
- Type-safe article types (GENERAL, CHARACTER, LOCATION, ITEM, LORE, EVENT, ORGANIZATION)
- Built-in methods for tag management and content analysis

### Person Model
Represents characters, NPCs, and historical figures. Built on top of the Article model.

```python
@dataclass
class Person:
    article: Article
    person_data: PersonData
```

**Key Features:**
- Comprehensive character information (race, gender, age, occupation, etc.)
- Important dates and timeline management
- Relationship tracking with other persons
- Skills, abilities, and personality traits
- Goals, fears, and secrets for story development
- Life status tracking (alive, dead, missing, etc.)

**Supported Data:**
- Physical characteristics (height, weight, eye color, hair color, distinguishing marks)
- Background information (birthplace, current location, social class)
- Timeline events with dates and descriptions
- Relationships with other characters
- Skills, abilities, and personality traits
- Story elements (goals, fears, secrets)
- Possessions and wealth level
- Organizational affiliations and titles

### Settlement Model
Represents cities, towns, villages, and other locations. Built on top of the Article model.

```python
@dataclass
class Settlement:
    article: Article
    settlement_data: SettlementData
```

**Key Features:**
- Multiple settlement types (city, town, village, hamlet, metropolis, capital, fortress, etc.)
- Government and leadership tracking
- Population and demographic information
- Economic and trade information
- Geographic and cultural data

**Supported Data:**
- Settlement classification and population
- Government type and ruler information
- Geographic data (coordinates, region, nearby settlements)
- Economic information (industries, trade goods)
- Cultural aspects (languages, religions, festivals)
- Notable features and defenses

### Project Model
Represents campaigns, worlds, or collections of related content.

```python
@dataclass
class Project:
    name: str
    description: Optional[str] = None
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
```

## Database Models

Located in `app/db/models/`, these handle persistence with SQLAlchemy.

### Key Design Decisions:
1. **Separate namespace**: Database models use `DB` suffix (e.g., `ArticleDB`, `PersonDB`)
2. **JSONB storage**: Complex nested data stored as JSONB for flexibility
3. **Indexed fields**: Common query fields are indexed for performance
4. **Foreign key relationships**: Proper relationships between tables

### Table Structure:

#### Articles Table
- Core content storage for all article types
- JSONB content field for flexible content structure
- Indexed title and article_type fields

#### Persons Table
- Links to articles table via `article_id`
- JSONB `person_data` field for complex person information
- Indexed fields for common queries (race, gender, occupation, etc.)

#### Settlements Table
- Links to articles table via `article_id`
- JSONB `settlement_data` field for complex settlement information
- Indexed fields for common queries (settlement_type, population, region, etc.)

#### Projects Table
- Simple structure for project metadata
- One-to-many relationship with articles

## Repository Pattern

Located in `app/repositories/`, these provide data access abstraction.

### BaseRepository
Abstract base class with common CRUD operations:
- `get_by_id(id)` - Get single record
- `get_all(skip, limit)` - Get paginated records
- `create(db_obj)` - Create new record
- `update(db_obj)` - Update existing record
- `delete(id)` - Delete record
- `to_domain(db_obj)` - Convert DB model to domain model
- `from_domain(domain_obj)` - Convert domain model to DB model

### Specialized Repositories
Each entity has its own repository with specific query methods:

**ArticleRepository:**
- `get_by_project(project_id)`
- `get_by_type(article_type)`
- `search_by_title(pattern)`

**PersonRepository:**
- `get_by_race(race)`
- `get_by_location(location)`
- `get_by_occupation(occupation)`
- `get_alive_persons()`

**SettlementRepository:**
- `get_by_type(settlement_type)`
- `get_by_region(region)`
- `get_by_population_range(min_pop, max_pop)`
- `get_by_government(government_type)`

## Service Layer

Located in `app/services/`, these contain business logic and orchestrate repository operations.

### Design Pattern:
```python
class ArticleService:
    def __init__(self, db: Session):
        self.repository = ArticleRepository(db)
    
    def create_article(self, article_data: ArticleCreate) -> Article:
        # Convert schema to domain model
        # Apply business rules
        # Use repository to persist
        # Return domain model
```

### Legacy Compatibility:
Each service provides legacy functions for backward compatibility:
```python
def get_article(db: Session, article_id: int):
    service = ArticleService(db)
    return service.get_article(article_id)
```

## Schema Layer

Located in `app/schemas/`, these handle API validation with Pydantic.

### Schema Types:
- **Base schemas**: Common fields for creation/updates
- **Create schemas**: Required fields for new records
- **Update schemas**: Optional fields for modifications
- **Response schemas**: Full data for API responses
- **Summary schemas**: Minimal data for list views
- **Detailed schemas**: Extended information for specific use cases

### Example:
```python
class PersonCreate(PersonBase):
    project_id: int

class PersonUpdate(BaseModel):
    name: Optional[str] = None
    race: Optional[str] = None
    # ... other optional fields

class Person(PersonBase):
    id: int
    created_at: datetime
    updated_at: datetime
```

## Migration Strategy

### Database Migration
A migration file has been created at `alembic/versions/001_add_person_settlement_models.py` that:
1. Creates the new table structure
2. Adds proper indexes for performance
3. Sets up foreign key relationships
4. Includes rollback procedures

### Backward Compatibility
The `app/models/__init__.py` file provides aliases for existing code:
```python
from app.db.models.article import ArticleDB as Article
from app.db.models.project import ProjectDB as Project
# ... etc
```

## Usage Examples

### Creating a Person
```python
from app.services.person_service import PersonService
from app.schemas.person import PersonCreate

service = PersonService(db)
person_data = PersonCreate(
    name="Aragorn",
    project_id=1,
    race="Human",
    gender="male",
    age=30,
    occupation="Ranger"
)
person = service.create_person(person_data)
```

### Creating a Settlement
```python
from app.services.settlement_service import SettlementService
from app.schemas.settlement import SettlementCreate

service = SettlementService(db)
settlement_data = SettlementCreate(
    name="Minas Tirith",
    project_id=1,
    settlement_type="city",
    population=50000,
    government_type="monarchy"
)
settlement = service.create_settlement(settlement_data)
```

### Querying Data
```python
# Get all persons of a specific race
persons = person_service.get_persons_by_race("Elf")

# Get settlements in a region
settlements = settlement_service.get_settlements_by_region("Gondor")

# Search articles by title
articles = article_service.search_articles("Aragorn")
```

## Benefits of This Architecture

1. **Separation of Concerns**: Clear boundaries between business logic, data access, and persistence
2. **Testability**: Domain models can be tested independently of database
3. **Flexibility**: Easy to change database schema without affecting business logic
4. **Type Safety**: Strong typing throughout the application
5. **Performance**: Indexed fields and optimized queries
6. **Scalability**: Repository pattern allows for easy caching and optimization
7. **Maintainability**: Clear structure makes code easier to understand and modify

## Future Enhancements

1. **Caching Layer**: Add Redis caching to repositories
2. **Event Sourcing**: Track changes to domain models
3. **Search Integration**: Add full-text search capabilities
4. **API Versioning**: Support multiple API versions
5. **Audit Trail**: Track who made what changes when
6. **Validation Rules**: Add complex business rule validation
7. **Import/Export**: Bulk operations for data management