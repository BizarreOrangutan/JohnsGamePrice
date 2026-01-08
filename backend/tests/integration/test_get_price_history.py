from unittest.mock import Mock

from fastapi import HTTPException

from jpg_backend.main import app, get_itad_client


def test_get_price_history_happy_path(client):
    # Mock the ITADClient's search_game method
    mock_client = Mock()
    mock_client.get_game_history.return_value = {"games": [{"id": "the-witcher-3-wild-hunt", "title": "The Witcher 3: Wild Hunt"}]}
    app.dependency_overrides[get_itad_client] = lambda: mock_client

    response = client.post(
        "/history",
        json={
            "game_id": "the-witcher-3-wild-hunt",
            "country": "US",
            "shop_ids": [1, 2],
            "since": "2022-12-27T11:21:08+01:00"
        },
    )
    assert response.status_code == 200

def test_get_price_history_empty_game_id(client):
    response = client.post(
        "/history",
        json={
            "game_id": "   ",
            "country": "US",
            "shop_ids": [1, 2],
            "since": "2022-12-27T11:21:08+01:00"
        },
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "game_id parameter cannot be empty"}

def test_get_price_history_itad_failure(client):
    # Mock the ITADClient to raise an exception
    mock_client = Mock()
    mock_client.get_game_history.side_effect = HTTPException(status_code=500)
    app.dependency_overrides[get_itad_client] = lambda: mock_client

    response = client.post(
        "/history",
        json={
            "game_id": "the-witcher-3-wild-hunt",
            "country": "US",
            "shop_ids": [1, 2],
            "since": "2022-12-27T11:21:08+01:00"
        },
    )
    assert response.status_code == 500