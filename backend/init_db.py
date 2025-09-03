"""
Initialize the database with tables
"""
from app.db.database import engine, Base
from app.models import project, article  # Import all models to register them

def init_db():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()