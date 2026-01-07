from fastapi import FastAPI, HTTPException
from itad_client import ITADClient
from logger import get_logger
from dotenv import load_dotenv
import os
import re

load_dotenv()
api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("API_KEY environment variable is required")

logger = get_logger()

itad_client = ITADClient(api_key, logger)

app = FastAPI()


@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"Hello": "World"}


@app.get("/search-game")
def search_game(title: str):
    title = title.strip()
    logger.info(f"Searching for game with title: {title}")

    if title == "":
        raise HTTPException(status_code=400, detail="Title parameter cannot be empty")

    search_result = perform_game_search(title)
    return search_result


def perform_game_search(title: str):
    if title == "NonExistentGame":
        raise HTTPException(status_code=404, detail="Game not found")

    return itad_client.search_game(title)


@app.get("/prices")
def get_prices(game_id: str, country: str):
    game_id = game_id.strip()
    country = country.strip().upper()
    logger.info(f"Fetching prices for game ID: {game_id} and country: {country}")

    if game_id == "":
        raise HTTPException(status_code=400, detail="game_id parameter cannot be empty")

    if not re.match(r"^[A-Z]{2}$", country):
        raise HTTPException(
            status_code=400, detail="Country must be 2-letter code (e.g., US, GB)"
        )

    price_results = itad_client.get_game_prices(game_id, country)
    return price_results
