import requests
import os
from dotenv import load_dotenv
import traceback
import sys

from .itad_error_handlers import (
    handle_http_error,
    handle_connection_error,
    handle_timeout_error,
    handle_request_error,
    handle_json_error,
    handle_generic_exception,
)
from .logger import get_logger

load_dotenv()

class ITADClient:
    def __init__(self, api_key, logger=None):
        self.api_key = api_key    
        self.base_url = "https://api.isthereanydeal.com"
        self.logger = logger or get_logger("ITADClient")

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
            handle_http_error(e, response)
        except requests.exceptions.ConnectionError as e:
            handle_connection_error(e)
        except requests.exceptions.Timeout as e:
            handle_timeout_error(e)
        except requests.exceptions.RequestException as e:
            handle_request_error(e)
        except ValueError as e:
            handle_json_error(e)
        except Exception as e:
            handle_generic_exception(e)

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
            handle_http_error(e, response)
        except requests.exceptions.ConnectionError as e:
            handle_connection_error(e)
        except requests.exceptions.Timeout as e:
            handle_timeout_error(e)
        except requests.exceptions.RequestException as e:
            handle_request_error(e)
        except ValueError as e:
            handle_json_error(e)
        except Exception as e:
            handle_generic_exception(e)

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
            handle_generic_exception(e)
