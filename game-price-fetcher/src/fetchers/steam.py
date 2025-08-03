from src.templates.price_fetcher import PriceFetcher
import requests

class SteamPriceFetcher(PriceFetcher):
    def _get_raw_data(self, game_id, currency="GBP"):
        url = f"https://store.steampowered.com/api/appdetails?appids={game_id}&cc={currency}&l=en"
        response = requests.get(url)
        return response.json()

    def _parse_price(self, raw_data) -> dict:
        for appdata in raw_data.values():
            if appdata.get('success') and 'data' in appdata:
                price_info = appdata['data'].get('price_overview')
                if price_info:
                    return {
                        "currency": price_info.get("currency"),
                        "initial": price_info.get("initial"),
                        "final": price_info.get("final"),
                        "discount_percent": price_info.get("discount_percent"),
                        "final_formatted": price_info.get("final_formatted"),
                    }
                else:
                    return {"error": "No price info available"}
        return {"error": "Invalid response"}

