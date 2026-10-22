from app.database.base import Base
from app.database.engine import engine

# Import all models so SQLAlchemy registers them
from app.models.research import ResearchJob


def init_db():
    Base.metadata.create_all(bind=engine)