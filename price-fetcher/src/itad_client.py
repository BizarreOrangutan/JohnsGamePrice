import requests
import os
from dotenv import load_dotenv
import traceback
import sys

load_dotenv()

class ITADClient:
    def __init__(self, api_key):
        self.api_key = api_key    
        self.base_url = "https://api.isthereanydeal.com"

    def search_game(self, title: str, result_num: int=10) -> object | None:
        """ Queries ITAD using a game's title and optionally how many results we want"""
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

    def prices(self, game_id: list[str], country:str="GB") -> object | None:
        """ Queries ITAD using a game's ID"""

        try:
            # Validate input
            if not game_id:
                raise ValueError("game_id cannot be empty")

            response = requests.post(f'{self.base_url}/games/prices/v3', params={
                'key': self.api_key,
                'country': country,
            }, 
            json = game_id,
            headers={
                'Content-Type': 'application/json'
            }
            )

            response.raise_for_status()

            return(self._extract_prices(response))

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

    def _extract_prices(self, raw_data) -> dict | None:
        """
        Output: dict
        Entry example : 
        "shop_name": {
            "shop_id": int | None,
            "current_price": float | None,
            "regular_price": float | None,
            "cut": float | None,
            "shop_low": float | None,
            "drm": obj,
            "platforms": list
        }
        """

        try:
            data = raw_data.json()[0]
            deals = data["deals"]
            shop_prices = {}
            for deal in deals:
                shop_name = deal["shop"]["name"]
                entry = {
                    "shop_id": deal["shop"]["id"] or None,
                    "current_price": deal["price"]["amount"] or None,
                    "regular_price": deal["regular"]["amount"] or None,
                    "cut": deal.get("cut", None),  # Use .get() to handle missing or None values
                    "shop_low": deal["storeLow"]["amount"] or None,
                    "drm": deal["drm"],
                    "platforms": deal["platforms"] or None,
                }

                shop_prices[shop_name] = entry

            return shop_prices
        
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
        """Handle any other unexpected errors with line info"""
        # Get current exception info
        exc_type, exc_value, exc_traceback = sys.exc_info()
        
        # Get line number
        line_no = exc_traceback.tb_lineno
        filename = exc_traceback.tb_frame.f_code.co_filename
        
        print(f"Unexpected Error: {e}")
        print(f"File: {filename}, Line: {line_no}")
        print(f"Full traceback:\n{traceback.format_exc()}")
        return None






