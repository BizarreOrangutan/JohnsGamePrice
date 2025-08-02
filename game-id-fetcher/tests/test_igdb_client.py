import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.igdb_client import IGDBClient

import pytest
from unittest.mock import patch, MagicMock

@pytest.fixture
def igdb_client():
    return IGDBClient("test_id", "test_secret")

@patch("requests.post")
def test_get_access_token_success(mock_post, igdb_client):
    # Mocking response to simulate successfult token retrieval
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"access_token": "fake_token"}
    mock_post.return_value = mock_response

    # Call the method to test
    token = igdb_client._get_access_token()
    assert token == "fake_token"
    assert igdb_client._access_token == "fake_token"

@patch("requests.post")
def test_get_game_ids_success(mock_post, igdb_client):
    # Mocking response to simulate successful game ID retrieval
    igdb_client._access_token = "fake_token"
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = [
        {"id": 1, "name": "Game One"},
        {"id": 2, "name": "Game Two"}
    ]
    mock_post.return_value = mock_response

    # Call the method to test
    result = igdb_client.get_game_ids("Game")
    assert result == [(1, "Game One"), (2, "Game Two")]

@patch("requests.post")
def test_get_game_ids_http_error(mock_post, igdb_client):
    # Mocking response to simulate HTTP error
    igdb_client._access_token = "fake_token"
    mock_response = MagicMock()
    mock_response.status_code = 404
    mock_response.raise_for_status.side_effect = Exception("Not Found")
    mock_post.return_value = mock_response

    # Call the method to test and expect an exception
    with pytest.raises(Exception):
        igdb_client.get_game_ids("Game")