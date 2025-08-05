import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

class TestHealthEndpoint:
    def test_health_check_success(self):
        """Test health check when service is healthy"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.return_value = {"data": {"results": []}}
            
            response = client.get("/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"
            assert data["service"] == "game-id-fetcher"
            assert "api_key_configured" in data
    
    def test_health_check_itad_failure(self):
        """Test health check when ITAD search fails"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.side_effect = Exception("API error")
            
            response = client.get("/health")
            assert response.status_code == 503
            data = response.json()
            assert "Service unhealthy" in data["detail"]
    
    def test_health_check_itad_returns_none(self):
        """Test health check when ITAD returns None"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.return_value = None
            
            response = client.get("/health")

            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"
    
    def test_health_check_connection_error(self):
        """Test health check when connection error occurs"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.side_effect = ConnectionError("Network error")
            
            response = client.get("/health")
            assert response.status_code == 503
            data = response.json()
            assert "Service unhealthy" in data["detail"]