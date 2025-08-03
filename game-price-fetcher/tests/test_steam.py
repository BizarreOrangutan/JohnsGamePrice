import pytest
from unittest.mock import patch, MagicMock
from src.fetchers.steam import SteamPriceFetcher

@pytest.fixture
def steam_fetcher():
    return SteamPriceFetcher()

@patch("requests.get")
def test_get_raw_data_success(mock_get, steam_fetcher):
    # Mocking the response from requests.get
    mock_response = MagicMock()
    mock_response.json.return_value = {"123": {"success": True, "data": {"price_overview": {"currency": "GBP"}}}}
    mock_get.return_value = mock_response

    # Call the method to test
    result = steam_fetcher._get_raw_data("123", "GBP")
    assert result["123"]["success"] is True
    assert result["123"]["data"]["price_overview"]["currency"] == "GBP"

def test_parse_price_success(steam_fetcher):
    # Mocking raw data to simulate a successful price fetch
    raw_data = {
        "123": {
            "success": True,
            "data": {
                "price_overview": {
                    "currency": "GBP",
                    "initial": 1999,
                    "final": 1599,
                    "discount_percent": 20,
                    "final_formatted": "£15.99"
                }
            }
        }
    }

    # Call the method to test
    result = steam_fetcher._parse_price(raw_data)
    assert result == {
        "currency": "GBP",
        "initial": 1999,
        "final": 1599,
        "discount_percent": 20,
        "final_formatted": "£15.99"
    }

def test_parse_price_no_price_info(steam_fetcher):
    # Mocking raw data where price info is not available
    raw_data = {
        "123": {
            "success": True,
            "data": {}
        }
    }

    # Call the method to test
    result = steam_fetcher._parse_price(raw_data)
    assert result == {"error": "No price info available"}

def test_parse_price_invalid_response(steam_fetcher):
    # Mocking raw data that indicates an invalid response
    raw_data = {
        "123": {
            "success": False
        }
    }

    # Call the method to test
    result = steam_fetcher._parse_price(raw_data)
    assert result == {"error": "Invalid response"}