import requests
from .logger import get_logger
from fastapi import HTTPException


class ITADClient:
    def __init__(self, api_key, logger=None):
        self.api_key = api_key
        self.base_url = "https://api.isthereanydeal.com"
        self.logger = logger or get_logger("ITADClient")

    def search_game(self, title: str, result_num: int = 10) -> object | None:
        """Queries ITAD using a game's title and optionally how many results we want"""
        try:
            response = requests.get(
                f"{self.base_url}/games/search/v1",
                params={"key": self.api_key, "title": title, "results": result_num},
            )
            response.raise_for_status()
            data = response.json()
            return data
        except requests.RequestException as e:
            self.logger.error(f"Error searching for game '{title}': {e}")
            raise HTTPException(
                status_code=500, detail="Error communicating with ITAD API"
            )

    def get_game_prices(self, game_id: str, country: str) -> object | None:
        """Fetches price information for a game using its ITAD game ID"""
        try:
            response = requests.post(
                f"{self.base_url}/games/prices/v3",
                params={"key": self.api_key, "country": country},
                json=[game_id],
                headers={"Content-Type": "application/json"},
            )
            response.raise_for_status()
            data = response.json()
            return data
        except requests.RequestException as e:
            self.logger.error(
                f"Error fetching prices for game ID '{game_id}' and country '{country}': {e}"
            )
            raise HTTPException(
                status_code=500, detail="Error communicating with ITAD API"
            )
