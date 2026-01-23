from unittest.mock import Mock

from fastapi import HTTPException

from jpg_backend.main import app, get_itad_client


def test_search_game_happy_path(client):
    # Mock the ITADClient's search_game method
    mock_client = Mock()
    mock_client.search_game.return_value = {
        "games": [
            {"id": "the-witcher-3-wild-hunt", "title": "The Witcher 3: Wild Hunt"}
        ]
    }
    app.dependency_overrides[get_itad_client] = lambda: mock_client

    response = client.get("/search-game", params={"title": "The Witcher 3"})
    assert response.status_code == 200


def test_search_game_empty_title(client):
    response = client.get("/search-game", params={"title": "   "})
    assert response.status_code == 400
    assert response.json() == {"detail": "Title parameter cannot be empty"}


def test_search_game_itad_failure(client):
    # Mock the ITADClient to raise an exception
    mock_client = Mock()
    mock_client.search_game.side_effect = HTTPException(status_code=500)
    app.dependency_overrides[get_itad_client] = lambda: mock_client

    response = client.get("/search-game", params={"title": "The Witcher 3"})
    assert response.status_code == 500
