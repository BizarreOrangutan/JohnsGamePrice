import pytest
from unittest.mock import patch, Mock
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

class TestPricesEndpoint:
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.return_value = {"data": {"results": []}}
            
            response = client.get("/health")
            
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"
            assert "service" in data

    def test_health_endpoint_failure(self):
        """Test health check when external API fails"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.side_effect = Exception("API Error")
            
            response = client.get("/health")
            
            assert response.status_code == 503

    @patch('src.main.itad.search_game')
    def test_game_ids_success(self, mock_search):
        """Test successful game search"""
        mock_search.return_value = {
            "data": {
                "results": [
                    {"id": "game-123", "title": "Portal"},
                    {"id": "game-456", "title": "Portal 2"}
                ]
            }
        }
        
        response = client.get("/game-ids?title=portal")
        
        assert response.status_code == 200
        data = response.json()
        assert "games" in data
        assert "count" in data

    def test_game_ids_missing_title(self):
        """Test game search without title parameter"""
        response = client.get("/game-ids")
        
        assert response.status_code == 422  # Validation error

    def test_game_ids_empty_title(self):
        """Test game search with empty title"""
        response = client.get("/game-ids?title=")
        
        assert response.status_code == 422  # FastAPI validation error, not 400

    @patch('src.main.itad.search_game')
    def test_game_ids_api_unavailable(self, mock_search):
        """Test game search when external API is unavailable"""
        mock_search.return_value = None
        
        response = client.get("/game-ids?title=portal")
        
        assert response.status_code == 503

    @patch('src.main.itad.prices')
    def test_prices_success(self, mock_prices):
        """Test successful price request"""
        mock_prices.return_value = {
            "GameBillet": {
                "shop_id": 20,
                "current_price": 39.53,
                "regular_price": 49.99
            }
        }
        
        response = client.get("/prices?id=game-123")
        
        assert response.status_code == 200
        data = response.json()
        assert "GameBillet" in data

    def test_prices_missing_id(self):
        """Test prices without game ID"""
        response = client.get("/prices")
        
        assert response.status_code == 422  # Validation error

    def test_prices_empty_id(self):
        """Test prices with empty game ID"""
        with patch('src.main.itad.prices') as mock_prices:
            mock_prices.return_value = None  # Simulate API failure with empty ID
            
            response = client.get("/prices?id=")
            
            assert response.status_code == 503  # Your app correctly returns 503 when API fails
            assert "External API unavailable" in response.json()["detail"]

    def test_prices_invalid_country(self):
        """Test prices with invalid country code"""
        response = client.get("/prices?id=game-123&country=USA")
        
        assert response.status_code == 422  # FastAPI validation error, not 400

    @patch('src.main.itad.prices')
    def test_prices_api_unavailable(self, mock_prices):
        """Test prices when external API is unavailable"""
        mock_prices.return_value = None
        
        response = client.get("/prices?id=game-123")
        
        assert response.status_code == 503

    @patch('src.main.itad.prices')
    def test_prices_with_country(self, mock_prices):
        """Test prices with country parameter"""
        mock_prices.return_value = {"Steam": {"current_price": 49.99}}
        
        response = client.get("/prices?id=game-123&country=US")
        
        assert response.status_code == 200
        mock_prices.assert_called_with(["game-123"], "US")

    @patch('src.main.itad.prices')
    def test_prices_multiple_ids(self, mock_prices):
        """Test prices with multiple game IDs"""
        mock_prices.return_value = {"Steam": {"current_price": 49.99}}
        
        response = client.get("/prices?id=game-123&id=game-456")
        
        assert response.status_code == 200
        mock_prices.assert_called_with(["game-123", "game-456"], "US")

    @patch('src.main.itad.prices')
    def test_prices_exception_handling(self, mock_prices):
        """Test prices with unexpected exception"""
        mock_prices.side_effect = ValueError("Invalid input")
        
        response = client.get("/prices?id=game-123")
        
        assert response.status_code == 400

    @patch('src.main.itad.search_game')
    def test_game_ids_with_result_num(self, mock_search):
        """Test game search with custom result number"""
        mock_search.return_value = {"data": {"results": []}}
        
        response = client.get("/game-ids?title=portal&result_num=5")
        
        assert response.status_code == 200
        mock_search.assert_called_with("portal", 5)

    @patch('src.main.itad.search_game')
    def test_game_ids_no_results(self, mock_search):
        """Test game search with no results"""
        mock_search.return_value = {"data": {"results": []}}
        
        response = client.get("/game-ids?title=nonexistent")
        
        assert response.status_code == 200
        data = response.json()
        assert data["count"] == 0
        assert "No games found" in data["message"]