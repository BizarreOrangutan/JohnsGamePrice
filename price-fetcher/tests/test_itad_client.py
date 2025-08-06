import pytest
import requests
from unittest.mock import Mock, patch
from src.itad_client import ITADClient

class TestITADClient:
    
    def test_init(self):
        """Test client initialization"""
        itad = ITADClient("test_key")
        assert itad.api_key == "test_key"
        assert itad.base_url == "https://api.isthereanydeal.com"

    @patch('src.itad_client.requests.post')
    def test_prices_success(self, mock_post):
        """Test successful prices request"""
        # Mock response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = [{
            'deals': [{
                'shop': {'id': 20, 'name': 'GameBillet'},
                'price': {'amount': 39.53},
                'regular': {'amount': 49.99},
                'cut': 21,
                'storeLow': {'amount': 32.09},
                'drm': [{'id': 61, 'name': 'Steam'}],
                'platforms': [{'id': 1, 'name': 'Windows'}]
            }]
        }]
        mock_post.return_value = mock_response
        
        itad = ITADClient("test_key")
        result = itad.prices(["game-123"])
        
        assert result is not None
        assert 'GameBillet' in result
        mock_post.assert_called_once()

    @patch('src.itad_client.requests.post')
    def test_prices_empty_list(self, mock_post):
        """Test prices with empty game ID list"""
        itad = ITADClient("test_key")
        result = itad.prices([])
        
        assert result is None
        mock_post.assert_not_called()

    @patch('src.itad_client.requests.post')
    def test_prices_http_error(self, mock_post):
        """Test prices with HTTP error"""
        mock_response = Mock()
        mock_response.status_code = 401
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError()
        mock_post.return_value = mock_response
        
        itad = ITADClient("invalid_key")
        result = itad.prices(["game-123"])
        
        assert result is None

    def test_extract_prices_valid_data(self):
        """Test extract prices with valid data"""
        # Mock response object
        mock_response = Mock()
        mock_response.json.return_value = [{
            'deals': [
                {
                    'shop': {'id': 20, 'name': 'GameBillet'},
                    'price': {'amount': 39.53},
                    'regular': {'amount': 49.99},
                    'cut': 21,
                    'storeLow': {'amount': 32.09},
                    'drm': [{'id': 61, 'name': 'Steam'}],
                    'platforms': [{'id': 1, 'name': 'Windows'}]
                },
                {
                    'shop': {'id': 61, 'name': 'Steam'},
                    'price': {'amount': 49.99},
                    'regular': {'amount': 49.99},
                    'cut': None,  # Keep this as None to test None handling
                    'storeLow': {'amount': 44.99},
                    'drm': [],
                    'platforms': [{'id': 1, 'name': 'Windows'}]
                }
            ]
        }]
        
        itad = ITADClient("test_key")
        result = itad._extract_prices(mock_response)
        
        # Test structure
        assert isinstance(result, dict)
        assert len(result) == 2
        
        # Test GameBillet data
        assert 'GameBillet' in result
        assert result['GameBillet']['shop_id'] == 20
        assert result['GameBillet']['current_price'] == 39.53
        assert result['GameBillet']['regular_price'] == 49.99
        assert result['GameBillet']['cut'] == 21
        assert result['GameBillet']['shop_low'] == 32.09
        
        # Test Steam data
        assert 'Steam' in result
        assert result['Steam']['shop_id'] == 61
        assert result['Steam']['current_price'] == 49.99
        assert result['Steam']['cut'] is None  # Changed to test None instead of 0

    def test_extract_prices_empty_deals(self):
        """Test extract prices with empty deals"""
        mock_response = Mock()
        mock_response.json.return_value = [{'deals': []}]
        
        itad = ITADClient("test_key")
        result = itad._extract_prices(mock_response)
        
        assert isinstance(result, dict)
        assert len(result) == 0

    def test_extract_prices_missing_data(self):
        """Test extract prices with missing optional data"""
        mock_response = Mock()
        mock_response.json.return_value = [{
            'deals': [{
                'shop': {'id': 20, 'name': 'GameBillet'},
                'price': {'amount': 39.53},
                'regular': {'amount': 49.99},
                'cut': None,  # Missing cut
                'storeLow': {'amount': 32.09},
                'drm': [],   # Empty DRM
                'platforms': None  # Missing platforms
            }]
        }]
        
        itad = ITADClient("test_key")
        result = itad._extract_prices(mock_response)
        
        assert 'GameBillet' in result
        assert result['GameBillet']['cut'] is None
        assert result['GameBillet']['drm'] == []
        assert result['GameBillet']['platforms'] is None

    def test_extract_prices_invalid_response(self):
        """Test extract prices with invalid response format"""
        mock_response = Mock()
        mock_response.json.side_effect = KeyError("deals")
        
        itad = ITADClient("test_key")
        result = itad._extract_prices(mock_response)
        
        assert result is None

    @patch('src.itad_client.requests.post')
    def test_prices_with_country_param(self, mock_post):
        """Test prices with country parameter"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = [{'deals': []}]
        mock_post.return_value = mock_response
        
        itad = ITADClient("test_key")
        result = itad.prices(["game-123"], country="US")
        
        # Check that country param was passed
        call_args = mock_post.call_args
        assert call_args[1]['params']['country'] == "US"
        assert call_args[1]['json'] == ["game-123"]

    @patch('src.itad_client.requests.post')
    def test_prices_multiple_games(self, mock_post):
        """Test prices with multiple game IDs"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = [{'deals': []}, {'deals': []}]
        mock_post.return_value = mock_response
        
        itad = ITADClient("test_key")
        game_ids = ["game-123", "game-456"]
        result = itad.prices(game_ids)
        
        # Check that all game IDs were passed
        call_args = mock_post.call_args
        assert call_args[1]['json'] == game_ids
