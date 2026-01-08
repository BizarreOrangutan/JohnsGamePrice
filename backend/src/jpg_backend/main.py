from fastapi import Depends, FastAPI, HTTPException

from .itad_client import ITADClient, get_itad_client
from .logger import get_logger
from .models import HistoryRequest, PriceRequest
from .utils import verify_country_code, verify_date_format

logger = get_logger()

app = FastAPI()


@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"Hello": "World"}


@app.get("/search-game")
def search_game(title: str, client: ITADClient = Depends(get_itad_client)):
    title = title.strip()
    logger.info(f"Searching for game with title: {title}")

    if title == "":
        raise HTTPException(status_code=400, detail="Title parameter cannot be empty")

    search_result = client.search_game(title)
    return search_result


@app.post("/prices")
def get_prices(req: PriceRequest, client: ITADClient = Depends(get_itad_client)):
    game_id = req.game_id.strip()
    country = req.country.strip().upper()
    shops = req.shops
    logger.info(
        f"Fetching prices for game ID: {game_id} and country: {country} with shops: {shops}"
    )

    if game_id == "":
        raise HTTPException(status_code=400, detail="game_id parameter cannot be empty")

    verify_country_code(country)

    price_results = client.get_game_prices(game_id, country, shops)
    return price_results


@app.post("/history")
def get_price_history(req: HistoryRequest, client: ITADClient = Depends(get_itad_client)):
    game_id = req.game_id.strip()
    country = req.country.strip().upper()
    shops = req.shops
    since = req.since
    logger.info(
        f"Fetching price history for game ID: {game_id} and country: {country} with shops: {shops} and since: {since}"
    )

    if game_id == "":
        raise HTTPException(status_code=400, detail="game_id parameter cannot be empty")

    if since:
        verify_date_format(since)

    verify_country_code(country)

    price_history = client.get_game_history(game_id, country, shops, since)
    return price_history
