import requests
import os
from dotenv import load_dotenv

load_dotenv()

class ITADClient:
    def __init__(self, api_key):
        self.api_key = api_key    
        self.base_url = "https://api.isthereanydeal.com"

    def search_game(self, title: str, result_num: int=10) -> object | None:
        """ Query's ITAD using a game's title and optionally how many results we want"""
        try:
            response = requests.get(f'{self.base_url}/games/search/v1', params={
                'key': self.api_key,
                'title': title,
                'results': result_num
            })

            response.raise_for_status()

            return response.json()
        
        except requests.exceptions.HTTPError as e:
            self._handle_http_error(e, response)
        except requests.exceptions.ConnectionError as e:
            self._handle_connection_error(e)
        except requests.exceptions.Timeout as e:
            self._handle_timeout_error(e)
        except requests.exceptions.RequestException as e:
            self._handle_request_error(e)
        except ValueError as e:
            self._handle_json_error(e)
        except Exception as e:
            self._handle_generic_exception(e)

    def _handle_http_error(self, e, response) -> None:
        """Handle HTTP status code errors (4xx, 5xx)"""
        status_code = response.status_code
        if status_code == 401:
            print(f"HTTP 401: Invalid API key")
        elif status_code == 429:
            print(f"HTTP 429: Rate limit exceeded")
        elif status_code == 404:
            print(f"HTTP 404: Endpoint not found")
        else:
            print(f"HTTP {status_code}: {e}")
        return None

    def _handle_connection_error(self, e) -> None:
        """Handle network connection issues"""
        print(f"Connection Error: {e}")
        return None

    def _handle_timeout_error(self, e) -> None:
        """Handle request timeout"""
        print(f"Timeout Error: {e}")
        return None

    def _handle_request_error(self, e) -> None:
        """Handle other requests-related errors"""
        print(f"Request Error: {e}")
        return None

    def _handle_json_error(self, e) -> None:
        """Handle JSON parsing errors"""
        print(f"JSON Error: Invalid response format - {e}")
        return None

    def _handle_generic_exception(self, e) -> None:
        """Handle any other unexpected errors"""
        print(f"Unexpected Error: {e}")
        return None






