from src.fetchers.steam import SteamPriceFetcher
from fastapi import FastAPI
import os
import uvicorn

app = FastAPI()
steam_fetcher = SteamPriceFetcher()

@app.get("/price/steam")
def get_steam_price(game_id: str, currency: str = "GBP"):
    return steam_fetcher.fetch(game_id, currency)

# Add this route to your FastAPI app
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "game-price-fetcher"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001)) 
    uvicorn.run(
        "src.main:app", 
        host="0.0.0.0", 
        port=port,
        reload=True
    )