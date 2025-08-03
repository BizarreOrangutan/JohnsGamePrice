import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.igdb_client import IGDBClient

import pytest
import requests
from unittest.mock import Mock, patch

# Move fixtures outside classes so they're available to all tests
@pytest.fixture
def client():
    """Create IGDBClient instance for testing."""
    return IGDBClient("test_client_id", "test_client_secret")

@pytest.fixture
def mock_auth_response():
    """Mock successful authentication response."""
    return {
        "access_token": "test_access_token_12345",
        "expires_in": 3600,
        "token_type": "bearer"
    }

@pytest.fixture
def mock_game_response():
    """Mock IGDB games API response."""
    return [
        {
            "id": 1942,
            "name": "Portal",
            "total_rating_count": 1250,
            "cover": {
                "url": "//images.igdb.com/igdb/image/upload/t_thumb/co1r8h.jpg"
            },
            "external_games": [
                {"category": 1, "uid": "400"},      # Steam
                {"category": 5, "uid": "1207658924"} # GOG
            ]
        },
        {
            "id": 2342,
            "name": "Portal 2",
            "total_rating_count": 2100,
            "cover": {
                "url": "//images.igdb.com/igdb/image/upload/t_thumb/co1rs4.jpg"
            },
            "external_games": [
                {"category": 1, "uid": "620"}       # Steam
            ]
        }
    ]


class TestInitialization:
    """Test IGDBClient initialization."""
    
    def test_init_with_valid_credentials(self):
        """Test successful initialization with valid credentials."""
        client = IGDBClient("test_id", "test_secret")
        
        assert client.client_id == "test_id"
        assert client.client_secret == "test_secret"
        assert client.base_url == "https://api.igdb.com/v4/"
        assert client._access_token is None
        assert isinstance(client.store_categories, dict)
        assert client.store_categories[1] == "Steam"
    
    def test_store_categories_mapping(self):
        """Test store categories are properly mapped."""
        client = IGDBClient("test_id", "test_secret")
        
        expected_categories = {
            1: "Steam",
            5: "GOG",
            11: "Epic Games Store",
            26: "Origin"
        }
        
        for category_id, store_name in expected_categories.items():
            assert client.store_categories[category_id] == store_name


class TestAuthentication:
    """Test OAuth2 authentication functionality."""
    
    @patch('src.igdb_client.requests.post')
    def test_get_access_token_success(self, mock_post, client, mock_auth_response):
        """Test successful token retrieval."""
        mock_response = Mock()
        mock_response.json.return_value = mock_auth_response
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response
        
        token = client._get_access_token()
        
        assert token == "test_access_token_12345"
        assert client._access_token == "test_access_token_12345"
        
        # Verify API call
        mock_post.assert_called_once_with(
            "https://id.twitch.tv/oauth2/token",
            params={
                'client_id': 'test_client_id',
                'client_secret': 'test_client_secret',
                'grant_type': 'client_credentials'
            }
        )
    
    @patch('src.igdb_client.requests.post')
    def test_get_access_token_cached(self, mock_post, client):
        """Test that access token is cached and not re-requested."""
        client._access_token = "cached_token"
        
        token = client._get_access_token()
        
        assert token == "cached_token"
        mock_post.assert_not_called()
    
    @patch('src.igdb_client.requests.post')
    def test_get_access_token_failure(self, mock_post, client):
        """Test authentication failure handling."""
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = requests.HTTPError("401 Unauthorized")
        mock_post.return_value = mock_response
        
        with pytest.raises(requests.HTTPError):
            client._get_access_token()


class TestGameSearch:
    """Test game search functionality."""
    
    @patch('src.igdb_client.requests.post')
    def test_get_game_ids_success(self, mock_post, client, mock_game_response):
        """Test successful game search."""
        # Mock authentication
        with patch.object(client, '_get_access_token', return_value="test_token"):
            # Mock games API response
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = mock_game_response
            mock_post.return_value = mock_response
            
            games = client.get_game_ids("portal")
            
            # Verify response structure
            assert len(games) == 2
            assert games[0]['name'] == "Portal 2"  # Higher popularity first
            assert games[1]['name'] == "Portal"
            
            # Verify game data structure
            portal_2 = games[0]
            assert portal_2['igdb_id'] == 2342
            assert portal_2['popularity_score'] == 2100
            assert portal_2['store_ids']['Steam'] == "620"
            assert "https://images.igdb.com" in portal_2['cover_url']
    
    @patch('src.igdb_client.requests.post')
    def test_get_game_ids_no_results(self, mock_post, client):
        """Test search with no results."""
        with patch.object(client, '_get_access_token', return_value="test_token"):
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = []
            mock_post.return_value = mock_response
            
            games = client.get_game_ids("nonexistent_game_xyz")
            
            assert games == []
    
    @patch('src.igdb_client.requests.post')
    def test_get_game_ids_api_error(self, mock_post, client):
        """Test API error handling."""
        with patch.object(client, '_get_access_token', return_value="test_token"):
            mock_response = Mock()
            mock_response.status_code = 500
            mock_response.text = "Internal Server Error"
            mock_response.raise_for_status.side_effect = requests.HTTPError("500 Server Error")
            mock_post.return_value = mock_response
            
            with pytest.raises(requests.HTTPError):
                client.get_game_ids("portal")
    
    @patch('src.igdb_client.requests.post')
    def test_query_parameters(self, mock_post, client):
        """Test that correct query parameters are sent."""
        with patch.object(client, '_get_access_token', return_value="test_token"):
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = []
            mock_post.return_value = mock_response
            
            client.get_game_ids("test query")
            
            # Verify API call parameters
            call_args = mock_post.call_args
            assert call_args[0][0] == "https://api.igdb.com/v4/games"
            
            headers = call_args[1]['headers']
            assert headers['Client-ID'] == 'test_client_id'
            assert headers['Authorization'] == 'Bearer test_token'
            assert headers['Accept'] == 'application/json'
            
            query_data = call_args[1]['data']
            assert 'where name ~ *"test query"*' in query_data
            assert 'fields id, name, external_games.category, external_games.uid' in query_data


class TestStoreIdsExtraction:
    """Test store ID extraction functionality."""
    
    def test_extract_store_ids_multiple_stores(self, client):
        """Test extraction of multiple store IDs."""
        game_data = {
            "external_games": [
                {"category": 1, "uid": "400"},      # Steam
                {"category": 5, "uid": "1207658924"}, # GOG
                {"category": 11, "uid": "catnip-4ff2b8"} # Epic
            ]
        }
        
        store_ids = client._extract_store_ids(game_data)
        
        assert store_ids["Steam"] == "400"
        assert store_ids["GOG"] == "1207658924"
        assert store_ids["Epic Games Store"] == "catnip-4ff2b8"
    
    def test_extract_store_ids_no_external_games(self, client):
        """Test extraction when no external games exist."""
        game_data = {}
        
        store_ids = client._extract_store_ids(game_data)
        
        assert store_ids == {}
    
    def test_extract_store_ids_unknown_category(self, client):
        """Test extraction with unknown store category."""
        game_data = {
            "external_games": [
                {"category": 999, "uid": "unknown_store_id"}
            ]
        }
        
        store_ids = client._extract_store_ids(game_data)
        
        assert store_ids["Unknown_999"] == "unknown_store_id"
    
    def test_extract_store_ids_missing_data(self, client):
        """Test extraction with missing category or uid."""
        game_data = {
            "external_games": [
                {"category": 1},  # Missing uid
                {"uid": "123"}    # Missing category
            ]
        }
        
        store_ids = client._extract_store_ids(game_data)
        
        # Should handle missing data gracefully
        assert "Steam" in store_ids
        assert store_ids["Steam"] is None


class TestCoverUrlExtraction:
    """Test cover URL extraction and formatting."""
    
    def test_get_cover_url_success(self, client):
        """Test successful cover URL extraction."""
        game_data = {
            "cover": {
                "url": "//images.igdb.com/igdb/image/upload/t_thumb/co1r8h.jpg"
            }
        }
        
        cover_url = client._get_cover_url(game_data)
        
        assert cover_url == "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8h.jpg"
    
    def test_get_cover_url_no_cover(self, client):
        """Test when game has no cover."""
        game_data = {}
        
        cover_url = client._get_cover_url(game_data)
        
        assert cover_url is None
    
    def test_get_cover_url_no_url_field(self, client):
        """Test when cover exists but has no URL."""
        game_data = {
            "cover": {}
        }
        
        cover_url = client._get_cover_url(game_data)
        
        assert cover_url is None
    
    def test_get_cover_url_already_https(self, client):
        """Test URL that already has https protocol."""
        game_data = {
            "cover": {
                "url": "https://images.igdb.com/igdb/image/upload/t_thumb/co1r8h.jpg"
            }
        }
        
        cover_url = client._get_cover_url(game_data)
        
        assert cover_url == "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8h.jpg"


class TestSorting:
    """Test popularity sorting functionality."""
    
    def test_popularity_sorting(self, client):
        """Test that games are sorted by popularity score."""
        # Mock games with different popularity scores
        games_data = [
            {"id": 1, "name": "Game A", "total_rating_count": 100, "external_games": []},
            {"id": 2, "name": "Game B", "total_rating_count": 500, "external_games": []},
            {"id": 3, "name": "Game C", "total_rating_count": 200, "external_games": []}
        ]
        
        with patch.object(client, '_get_access_token', return_value="test_token"):
            with patch('src.igdb_client.requests.post') as mock_post:
                mock_response = Mock()
                mock_response.status_code = 200
                mock_response.json.return_value = games_data
                mock_post.return_value = mock_response
                
                games = client.get_game_ids("test")
                
                # Should be sorted by popularity (highest first)
                assert games[0]['name'] == "Game B"  # 500 rating count
                assert games[1]['name'] == "Game C"  # 200 rating count
                assert games[2]['name'] == "Game A"  # 100 rating count


# Test configuration
if __name__ == "__main__":
    pytest.main([__file__, "-v"])