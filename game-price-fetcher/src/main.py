from src.fetchers.steam import SteamPriceFetcher
from fastapi import FastAPI

app = FastAPI()
steam_fetcher = SteamPriceFetcher()

@app.get("/price/steam")
def get_steam_price(game_id: str, currency: str = "GBP"):
    return steam_fetcher.fetch(game_id, currency)