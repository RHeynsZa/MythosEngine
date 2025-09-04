"""
Settlement repository for database operations.
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.models.settlement import SettlementDB
from app.db.models.article import ArticleDB
from app.domain.models.settlement import Settlement, SettlementData, SettlementType, GovernmentType
from app.domain.models.article import Article, ArticleContent, ArticleType
from .base_repository import BaseRepository


class SettlementRepository(BaseRepository[SettlementDB, Settlement]):
    """Repository for settlement database operations."""

    def __init__(self, db: Session):
        super().__init__(db, SettlementDB)

    def get_by_type(self, settlement_type: str, skip: int = 0, limit: int = 100) -> List[SettlementDB]:
        """Get settlements by type."""
        return (
            self.db.query(SettlementDB)
            .filter(SettlementDB.settlement_type == settlement_type)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_region(self, region: str, skip: int = 0, limit: int = 100) -> List[SettlementDB]:
        """Get settlements by region."""
        return (
            self.db.query(SettlementDB)
            .filter(SettlementDB.region.ilike(f"%{region}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_population_range(self, min_pop: int, max_pop: int, skip: int = 0, limit: int = 100) -> List[SettlementDB]:
        """Get settlements by population range."""
        query = self.db.query(SettlementDB)
        if min_pop is not None:
            query = query.filter(SettlementDB.population >= min_pop)
        if max_pop is not None:
            query = query.filter(SettlementDB.population <= max_pop)
        return query.offset(skip).limit(limit).all()

    def get_by_government(self, government_type: str, skip: int = 0, limit: int = 100) -> List[SettlementDB]:
        """Get settlements by government type."""
        return (
            self.db.query(SettlementDB)
            .filter(SettlementDB.government_type == government_type)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def to_domain(self, db_obj: SettlementDB) -> Settlement:
        """Convert database model to domain model."""
        # Get the associated article
        article_db = self.db.query(ArticleDB).filter(ArticleDB.id == db_obj.article_id).first()
        if not article_db:
            raise ValueError(f"Article not found for settlement {db_obj.id}")

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

        # Convert settlement data
        settlement_data_dict = db_obj.settlement_data or {}
        
        settlement_data = SettlementData(
            settlement_type=SettlementType(settlement_data_dict.get("settlement_type", db_obj.settlement_type)),
            population=settlement_data_dict.get("population"),
            government_type=GovernmentType(settlement_data_dict["government_type"]) if settlement_data_dict.get("government_type") else None,
            ruler_name=settlement_data_dict.get("ruler_name"),
            founded_date=settlement_data_dict.get("founded_date"),
            notable_features=settlement_data_dict.get("notable_features", []),
            trade_goods=settlement_data_dict.get("trade_goods", []),
            defenses=settlement_data_dict.get("defenses"),
            climate=settlement_data_dict.get("climate"),
            terrain=settlement_data_dict.get("terrain"),
            wealth_level=settlement_data_dict.get("wealth_level"),
            coordinates=settlement_data_dict.get("coordinates"),
            region=settlement_data_dict.get("region"),
            nearby_settlements=settlement_data_dict.get("nearby_settlements", []),
            primary_industry=settlement_data_dict.get("primary_industry"),
            secondary_industries=settlement_data_dict.get("secondary_industries", []),
            predominant_race=settlement_data_dict.get("predominant_race"),
            languages_spoken=settlement_data_dict.get("languages_spoken", []),
            religions=settlement_data_dict.get("religions", []),
            festivals=settlement_data_dict.get("festivals", [])
        )

        return Settlement(article=article, settlement_data=settlement_data)

    def from_domain(self, domain_obj: Settlement) -> tuple[ArticleDB, SettlementDB]:
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

        # Convert settlement data
        settlement_data_dict = {
            "settlement_type": domain_obj.settlement_data.settlement_type.value,
            "population": domain_obj.settlement_data.population,
            "government_type": domain_obj.settlement_data.government_type.value if domain_obj.settlement_data.government_type else None,
            "ruler_name": domain_obj.settlement_data.ruler_name,
            "founded_date": domain_obj.settlement_data.founded_date,
            "notable_features": domain_obj.settlement_data.notable_features,
            "trade_goods": domain_obj.settlement_data.trade_goods,
            "defenses": domain_obj.settlement_data.defenses,
            "climate": domain_obj.settlement_data.climate,
            "terrain": domain_obj.settlement_data.terrain,
            "wealth_level": domain_obj.settlement_data.wealth_level,
            "coordinates": domain_obj.settlement_data.coordinates,
            "region": domain_obj.settlement_data.region,
            "nearby_settlements": domain_obj.settlement_data.nearby_settlements,
            "primary_industry": domain_obj.settlement_data.primary_industry,
            "secondary_industries": domain_obj.settlement_data.secondary_industries,
            "predominant_race": domain_obj.settlement_data.predominant_race,
            "languages_spoken": domain_obj.settlement_data.languages_spoken,
            "religions": domain_obj.settlement_data.religions,
            "festivals": domain_obj.settlement_data.festivals
        }

        settlement_db = SettlementDB(
            settlement_data=settlement_data_dict,
            settlement_type=domain_obj.settlement_data.settlement_type.value,
            population=domain_obj.settlement_data.population,
            government_type=domain_obj.settlement_data.government_type.value if domain_obj.settlement_data.government_type else None,
            region=domain_obj.settlement_data.region,
            primary_industry=domain_obj.settlement_data.primary_industry
        )

        return article_db, settlement_db

    def create_from_domain(self, domain_obj: Settlement) -> Settlement:
        """Create a new settlement from domain model."""
        article_db, settlement_db = self.from_domain(domain_obj)
        
        # Create article first
        self.db.add(article_db)
        self.db.flush()  # Get the article ID without committing
        
        # Set the article_id on settlement
        settlement_db.article_id = article_db.id
        
        # Create settlement
        created_settlement_db = self.create(settlement_db)
        
        return self.to_domain(created_settlement_db)

    def update_from_domain(self, domain_obj: Settlement) -> Optional[Settlement]:
        """Update a settlement from domain model."""
        if not domain_obj.id:
            return None

        settlement_db = self.get_by_id(domain_obj.id)
        if not settlement_db:
            return None

        # Update article
        article_db = self.db.query(ArticleDB).filter(ArticleDB.id == settlement_db.article_id).first()
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

        # Update settlement data
        settlement_data_dict = {
            "settlement_type": domain_obj.settlement_data.settlement_type.value,
            "population": domain_obj.settlement_data.population,
            "government_type": domain_obj.settlement_data.government_type.value if domain_obj.settlement_data.government_type else None,
            "ruler_name": domain_obj.settlement_data.ruler_name,
            "founded_date": domain_obj.settlement_data.founded_date,
            "notable_features": domain_obj.settlement_data.notable_features,
            "trade_goods": domain_obj.settlement_data.trade_goods,
            "defenses": domain_obj.settlement_data.defenses,
            "climate": domain_obj.settlement_data.climate,
            "terrain": domain_obj.settlement_data.terrain,
            "wealth_level": domain_obj.settlement_data.wealth_level,
            "coordinates": domain_obj.settlement_data.coordinates,
            "region": domain_obj.settlement_data.region,
            "nearby_settlements": domain_obj.settlement_data.nearby_settlements,
            "primary_industry": domain_obj.settlement_data.primary_industry,
            "secondary_industries": domain_obj.settlement_data.secondary_industries,
            "predominant_race": domain_obj.settlement_data.predominant_race,
            "languages_spoken": domain_obj.settlement_data.languages_spoken,
            "religions": domain_obj.settlement_data.religions,
            "festivals": domain_obj.settlement_data.festivals
        }

        settlement_db.settlement_data = settlement_data_dict
        settlement_db.settlement_type = domain_obj.settlement_data.settlement_type.value
        settlement_db.population = domain_obj.settlement_data.population
        settlement_db.government_type = domain_obj.settlement_data.government_type.value if domain_obj.settlement_data.government_type else None
        settlement_db.region = domain_obj.settlement_data.region
        settlement_db.primary_industry = domain_obj.settlement_data.primary_industry

        updated_settlement_db = self.update(settlement_db)
        return self.to_domain(updated_settlement_db)