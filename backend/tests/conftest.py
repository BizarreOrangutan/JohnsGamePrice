import fastapi.testclient
import pytest
from dotenv import load_dotenv

from jpg_backend.main import app


@pytest.fixture
def client() -> fastapi.testclient.TestClient:
    return fastapi.testclient.TestClient(app)