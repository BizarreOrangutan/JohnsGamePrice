import os

from sqlalchemy import create_engine
from dotenv import load_dotenv

from jpg_backend.logger import get_logger
from db.schemas.meta import metaData

logger = get_logger()

load_dotenv()
logger.info("Environment variables loaded from .env file")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    logger.error("DATABASE_URL environment variable is not set")
    raise ValueError("DATABASE_URL environment variable is required")

try:
    engine = create_engine(DATABASE_URL)
    logger.info("Database engine created successfully")
except Exception as e:
    logger.error(f"Error creating database engine: {e}")
    raise

try:
    metaData.create_all(engine)  # Creates tables in the database
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")
    raise