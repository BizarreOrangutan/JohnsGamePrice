import fastapi.testclient
import pytest
from dotenv import load_dotenv

from db.connection import engine
from db.schemas.user import user as user_table
from jpg_backend.main import app

@pytest.fixture(autouse=True)
def clean_user_table():
    with engine.connect() as conn:
        conn.execute(user_table.delete())
        conn.commit()

@pytest.fixture
def client() -> fastapi.testclient.TestClient:
    return fastapi.testclient.TestClient(app)
