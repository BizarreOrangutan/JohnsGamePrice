import pytest
import requests  # Add this import
from unittest.mock import Mock, patch
from src.itad_client import ITADClient

class TestITADClient:
    def test_init_with_api_key(self):
        """Test ITAD client initialization"""
        itad = ITADClient("test_key")
        assert itad.api_key == "test_key"
        assert itad.base_url == "https://api.isthereanydeal.com"
    
    def test_init_without_api_key(self):
        """Test ITAD client initialization with None"""
        itad = ITADClient(None)
        assert itad.api_key is None
    
    @patch('src.itad_client.requests.get')
    def test_search_game_success(self, mock_get):
        """Test successful game search"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": {
                "results": [
                    {"title": "Portal 2", "plain": "portal2"}
                ]
            }
        }
        mock_get.return_value = mock_response
        
        itad = ITADClient("test_key")
        result = itad.search_game("Portal 2")
        
        assert result is not None
        assert "data" in result
        assert len(result["data"]["results"]) == 1
    
    @patch('src.itad_client.requests.get')
    def test_search_game_invalid_key(self, mock_get):
        """Test game search with invalid API key"""
        mock_response = Mock()
        mock_response.status_code = 401
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("401 Client Error")
        mock_get.return_value = mock_response
        
        itad = ITADClient("invalid_key")
        result = itad.search_game("Portal 2")
        
        assert result is None
    
    @patch('src.itad_client.requests.get')
    def test_search_game_connection_error(self, mock_get):
        """Test game search with connection error"""
        mock_get.side_effect = ConnectionError("Network error")
        
        itad = ITADClient("test_key")
        result = itad.search_game("Portal 2")
        
        assert result is None
    
    @patch('src.itad_client.requests.get')
    def test_search_game_timeout(self, mock_get):
        """Test game search with timeout"""
        mock_get.side_effect = requests.exceptions.Timeout("Request timeout")
        
        itad = ITADClient("test_key")
        result = itad.search_game("Portal 2")
        
        assert result is None