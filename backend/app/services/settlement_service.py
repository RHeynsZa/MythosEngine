"""
Settlement service for business logic operations.
"""

from sqlalchemy.orm import Session
from app.domain.models.settlement import Settlement, SettlementData, SettlementType, GovernmentType
from app.domain.models.article import Article, ArticleContent, ArticleType
from app.repositories.settlement_repository import SettlementRepository
from app.schemas.settlement import SettlementCreate, SettlementUpdate
from typing import Optional, List


class SettlementService:
    """Service layer for settlement operations using domain models and repositories."""

    def __init__(self, db: Session):
        self.repository = SettlementRepository(db)

    def get_settlement(self, settlement_id: int) -> Optional[Settlement]:
        """Get a settlement by ID."""
        db_settlement = self.repository.get_by_id(settlement_id)
        if db_settlement:
            return self.repository.to_domain(db_settlement)
        return None

    def get_settlements(self, skip: int = 0, limit: int = 100) -> List[Settlement]:
        """Get all settlements with pagination."""
        db_settlements = self.repository.get_all(skip, limit)
        return [self.repository.to_domain(db_settlement) for db_settlement in db_settlements]

    def get_settlements_by_type(self, settlement_type: str, skip: int = 0, limit: int = 100) -> List[Settlement]:
        """Get settlements by type."""
        db_settlements = self.repository.get_by_type(settlement_type, skip, limit)
        return [self.repository.to_domain(db_settlement) for db_settlement in db_settlements]

    def get_settlements_by_region(self, region: str, skip: int = 0, limit: int = 100) -> List[Settlement]:
        """Get settlements by region."""
        db_settlements = self.repository.get_by_region(region, skip, limit)
        return [self.repository.to_domain(db_settlement) for db_settlement in db_settlements]

    def get_settlements_by_population_range(self, min_pop: Optional[int] = None, max_pop: Optional[int] = None, 
                                          skip: int = 0, limit: int = 100) -> List[Settlement]:
        """Get settlements by population range."""
        db_settlements = self.repository.get_by_population_range(min_pop, max_pop, skip, limit)
        return [self.repository.to_domain(db_settlement) for db_settlement in db_settlements]

    def get_settlements_by_government(self, government_type: str, skip: int = 0, limit: int = 100) -> List[Settlement]:
        """Get settlements by government type."""
        db_settlements = self.repository.get_by_government(government_type, skip, limit)
        return [self.repository.to_domain(db_settlement) for db_settlement in db_settlements]

    def create_settlement(self, settlement_data: SettlementCreate) -> Settlement:
        """Create a new settlement."""
        # Create the settlement using the domain model factory method
        domain_settlement = Settlement.create(
            title=settlement_data.name,
            settlement_type=SettlementType(settlement_data.settlement_type),
            project_id=settlement_data.project_id,
            population=settlement_data.population,
            government_type=GovernmentType(settlement_data.government_type) if settlement_data.government_type else None
        )

        # Set additional fields if provided
        if settlement_data.description:
            domain_settlement.article.content.summary = settlement_data.description
        if settlement_data.region:
            domain_settlement.settlement_data.region = settlement_data.region

        return self.repository.create_from_domain(domain_settlement)

    def update_settlement(self, settlement_id: int, settlement_data: SettlementUpdate) -> Optional[Settlement]:
        """Update an existing settlement."""
        # Get current settlement
        current_settlement = self.get_settlement(settlement_id)
        if not current_settlement:
            return None

        # Update fields that are provided
        if settlement_data.name is not None:
            current_settlement.article.title = settlement_data.name
        if settlement_data.description is not None:
            current_settlement.article.content.summary = settlement_data.description
        if settlement_data.settlement_type is not None:
            current_settlement.settlement_data.settlement_type = SettlementType(settlement_data.settlement_type)
        if settlement_data.population is not None:
            current_settlement.settlement_data.population = settlement_data.population
        if settlement_data.government_type is not None:
            current_settlement.settlement_data.government_type = GovernmentType(settlement_data.government_type)
        if settlement_data.region is not None:
            current_settlement.settlement_data.region = settlement_data.region
        if settlement_data.ruler_name is not None:
            current_settlement.settlement_data.ruler_name = settlement_data.ruler_name

        return self.repository.update_from_domain(current_settlement)

    def delete_settlement(self, settlement_id: int) -> Optional[Settlement]:
        """Delete a settlement."""
        # Get the settlement before deletion
        settlement = self.get_settlement(settlement_id)
        if settlement:
            self.repository.delete(settlement_id)
        return settlement

    def add_notable_feature(self, settlement_id: int, feature: str) -> Optional[Settlement]:
        """Add a notable feature to a settlement."""
        settlement = self.get_settlement(settlement_id)
        if settlement:
            settlement.add_notable_feature(feature)
            return self.repository.update_from_domain(settlement)
        return None

    def add_trade_good(self, settlement_id: int, good: str) -> Optional[Settlement]:
        """Add a trade good to a settlement."""
        settlement = self.get_settlement(settlement_id)
        if settlement:
            settlement.add_trade_good(good)
            return self.repository.update_from_domain(settlement)
        return None

    def set_ruler(self, settlement_id: int, ruler_name: str) -> Optional[Settlement]:
        """Set the ruler of a settlement."""
        settlement = self.get_settlement(settlement_id)
        if settlement:
            settlement.set_ruler(ruler_name)
            return self.repository.update_from_domain(settlement)
        return None

    def add_nearby_settlement(self, settlement_id: int, nearby_settlement_name: str) -> Optional[Settlement]:
        """Add a nearby settlement."""
        settlement = self.get_settlement(settlement_id)
        if settlement:
            settlement.add_nearby_settlement(nearby_settlement_name)
            return self.repository.update_from_domain(settlement)
        return None