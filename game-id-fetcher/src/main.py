from fastapi import FastAPI, Query 
from src.igdb_client import IGDBClient
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET") 

igdb = IGDBClient(CLIENT_ID, CLIENT_SECRET)

@app.get("/game-ids")
async def get_game_ids(query: str = Query(..., description="Search query for game names")):
    try:
        game_ids = igdb.get_game_ids(query)
        return {"game_ids": game_ids}
    except Exception as e:
        return {"error": str(e)}

# Add this route to your FastAPI app
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "game-id-fetcher"}