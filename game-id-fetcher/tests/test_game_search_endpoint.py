import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

class TestGameSearchEndpoint:
    def test_game_search_success(self):
        """Test successful game search via API"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.return_value = {
                "data": {
                    "results": [
                        {"title": "Portal 2", "plain": "portal2"}
                    ]
                }
            }
            
            response = client.get("/game-ids?title=Portal%202&result_num=10")
            assert response.status_code == 200
            data = response.json()
            assert "games" in data
            assert data["count"] == 1
    
    def test_game_search_success_list_response(self):
        """Test successful game search with list response from ITAD"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.return_value = [
                {"title": "Portal 2", "plain": "portal2"}
            ]
            
            response = client.get("/game-ids?title=Portal%202&result_num=10")
            assert response.status_code == 200
            data = response.json()
            assert "games" in data
            assert data["count"] == 1

    def test_game_search_no_results(self):
        """Test game search with no results"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.return_value = {"data": {"results": []}}
            
            response = client.get("/game-ids?title=NonexistentGame&result_num=10")
            assert response.status_code == 200
            data = response.json()
            assert data["games"] == []
            assert data["count"] == 0
            assert "message" in data
            assert "No games found" in data["message"]
    
    def test_game_search_no_results_empty_list(self):
        """Test game search with no results (empty list)"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.return_value = []
            
            response = client.get("/game-ids?title=NonexistentGame&result_num=10")
            assert response.status_code == 200
            data = response.json()
            assert data["games"] == []
            assert data["count"] == 0
            assert "message" in data
    
    def test_game_search_api_unavailable(self):
        """Test when ITAD API is unavailable"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.return_value = None
            
            response = client.get("/game-ids?title=Portal&result_num=10")
            assert response.status_code == 503
            data = response.json()
            assert "External API unavailable" in data["detail"]
    
    def test_game_search_empty_title(self):
        """Test game search with empty title"""
        response = client.get("/game-ids?title=&result_num=10")
        assert response.status_code == 422  # FastAPI validation error
    
    def test_game_search_whitespace_title(self):
        """Test game search with whitespace-only title"""
        response = client.get("/game-ids?title=%20%20%20&result_num=10")  # URL encoded spaces
        assert response.status_code == 400
        data = response.json()
        assert "Game title cannot be empty" in data["detail"]
    
    def test_game_search_invalid_result_num_too_low(self):
        """Test game search with result_num too low"""
        response = client.get("/game-ids?title=Portal&result_num=0")
        assert response.status_code == 422  # FastAPI validation error
    
    def test_game_search_invalid_result_num_too_high(self):
        """Test game search with result_num too high"""
        response = client.get("/game-ids?title=Portal&result_num=101")
        assert response.status_code == 422  # FastAPI validation error
    
    def test_game_search_missing_title(self):
        """Test game search without title parameter"""
        response = client.get("/game-ids?result_num=10")
        assert response.status_code == 422  # FastAPI validation error
    
    def test_game_search_connection_error(self):
        """Test game search when connection error occurs"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.side_effect = ConnectionError("Network error")
            
            response = client.get("/game-ids?title=Portal&result_num=10")
            assert response.status_code == 503
            data = response.json()
            assert "Unable to connect to external service" in data["detail"]
    
    def test_game_search_timeout_error(self):
        """Test game search when timeout occurs"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.side_effect = TimeoutError("Request timeout")
            
            response = client.get("/game-ids?title=Portal&result_num=10")
            assert response.status_code == 504
            data = response.json()
            assert "Request timed out" in data["detail"]
    
    def test_game_search_unexpected_response_format(self):
        """Test game search with unexpected response format"""
        with patch('src.main.itad.search_game') as mock_search:
            mock_search.return_value = "unexpected string response"
            
            response = client.get("/game-ids?title=Portal&result_num=10")
            assert response.status_code == 500
            data = response.json()
            assert "Unexpected response format" in data["detail"]