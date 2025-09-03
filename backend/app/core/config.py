from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    # API Settings
    PROJECT_NAME: str = "MythosEngine"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # CORS Settings
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Database Settings
    DATABASE_URL: str = (
        "postgresql://postgres:password@localhost:5432/mythosengine"  # Default PostgreSQL for local development
    )
    POSTGRES_SERVER: Optional[str] = "localhost"
    POSTGRES_USER: Optional[str] = "postgres"
    POSTGRES_PASSWORD: Optional[str] = "password"
    POSTGRES_DB: Optional[str] = "mythosengine"

    # Security Settings
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Auth Settings (for future Clerk integration)
    CLERK_SECRET_KEY: Optional[str] = None
    ENABLE_AUTH: bool = False  # Set to False for local development

    # AI Settings (for future implementation)
    OPENAI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def database_url(self) -> str:
        if self.POSTGRES_SERVER:
            return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
        return self.DATABASE_URL


settings = Settings()
