from unittest.mock import Mock

from fastapi import HTTPException

from jpg_backend.main import app, get_itad_client


def test_get_prices_happy_path(client):
    # Mock the ITADClient's get_game_prices method
    mock_client = Mock()
    mock_client.get_game_prices.return_value = {
        "prices": [
            {"shop": "Steam", "price": 19.99, "currency": "USD"},
            {"shop": "GOG", "price": 17.99, "currency": "USD"},
        ]
    }
    app.dependency_overrides[get_itad_client] = lambda: mock_client

    response = client.post(
        "/prices",
        json={
            "game_id": "the-witcher-3-wild-hunt",
            "country": "US",
            "shop_ids": [1, 2],
        },
    )
    assert response.status_code == 200
    assert response.json() == {
        "prices": [
            {"shop": "Steam", "price": 19.99, "currency": "USD"},
            {"shop": "GOG", "price": 17.99, "currency": "USD"},
        ]
    }

def test_get_prices_empty_game_id(client):
    mock_client = Mock()
    app.dependency_overrides[get_itad_client] = lambda: mock_client
    response = client.post(
        "/prices",
        json={
            "game_id": "   ",
            "country": "US",
            "shop_ids": [1, 2],
        },
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "game_id parameter cannot be empty"}

def test_get_prices_itad_failure(client):
    # Mock the ITADClient to raise an exception
    mock_client = Mock()
    mock_client.get_game_prices.side_effect = HTTPException(status_code=500)
    app.dependency_overrides[get_itad_client] = lambda: mock_client

    response = client.post(
        "/prices",
        json={
            "game_id": "the-witcher-3-wild-hunt",
            "country": "US",
            "shop_ids": [1, 2],
        },
    )
    assert response.status_code == 500