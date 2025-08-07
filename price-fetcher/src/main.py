from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import JSONResponse
from src.logger import get_logger
from src.itad_client import ITADClient
import os
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = get_logger()

app = FastAPI(
    title="Game Price Fetcher API",
    description="API to fetch game IDs from various stores",
    version="1.0.0"
)

API_KEY = os.getenv("API_KEY")

if not API_KEY:
    logger.error("API_KEY not found in environment variables")
    raise ValueError("API_KEY environment variable is required")

itad = ITADClient(API_KEY, logger=logger)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": "An unexpected error occurred"}
    )

@app.get("/game-ids")
async def get_game(
    title: str = Query(..., description="Game title to search", min_length=1, max_length=100),
    result_num: int = Query(20, description="Number of results to return", ge=1, le=100)
):
    try:
        # Validate input
        if not title.strip():
            raise HTTPException(status_code=400, detail="Game title cannot be empty")
        
        logger.info(f"Searching for game: {title} with {result_num} results")
        
        games = itad.search_game(title.strip(), result_num)
        
        if games is None:
            raise HTTPException(
                status_code=503, 
                detail="External API unavailable. Please try again later."
            )
        
        results = []
        if isinstance(games, dict):
            results = games.get("data", {}).get("results", [])
        elif isinstance(games, list):
            results = games
        else:
            logger.error(f"Unexpected response format from ITAD: {type(games)}")
            raise HTTPException(status_code=500, detail="Unexpected response format")
        
        if not results:
            return {"games": [], "message": f"No games found for '{title}'", "count": 0}
        
        logger.info(f"Found {len(results)} games for '{title}'")
        return {"games": games, "count": len(results)}
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except ConnectionError as e:
        logger.error(f"Connection error: {e}")
        raise HTTPException(status_code=503, detail="Unable to connect to external service")
    except TimeoutError as e:
        logger.error(f"Timeout error: {e}")
        raise HTTPException(status_code=504, detail="Request timed out")
    except Exception as e:
        logger.error(f"Unexpected error in get_game: {e}")
        logger.error(f"Response type: {type(games)}, Response: {games}")  # Debug info
        raise HTTPException(status_code=500, detail="Internal server error")
    
@app.get("/prices")
async def get_prices(
    id: list[str] = Query(..., description="Ids of the games we want prices of", min_length=1),
    country: str = Query("US", description="Country code as a two character string", max_length=2),
):
    try:
        # Validate id
        if len(id) == 0:
            raise HTTPException(status_code=400, detail="Game id cannot be empty")
        
        # Validate country code if provided
        if country and len(country) != 2:
            raise HTTPException(status_code=400, detail="Country code must be 2 characters")

        logger.info(f"Fetching prices for game with ID: {id}")

        # Handle optional parameters - use defaults if not provided
        country_code = country.strip() if country else "GB"

        prices = itad.prices(id, country_code)

        if prices is None:
            raise HTTPException(
                status_code=503, 
                detail="External API unavailable. Please try again later."
            )         
        
        return(prices)

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except ConnectionError as e:
        logger.error(f"Connection error: {e}")
        raise HTTPException(status_code=503, detail="Unable to connect to external service")
    except TimeoutError as e:
        logger.error(f"Timeout error: {e}")
        raise HTTPException(status_code=504, detail="Request timed out")
    except Exception as e:
        logger.error(f"Unexpected error in get_prices: {e}")
        logger.error(f"Response type: {type(id)}, Response: {id}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
@app.get("/health")
async def health_check():
    try:
        itad.search_game("test")

        return {
            "status": "healthy", 
            "service": "price-fetcher",
            "api_key_configured": bool(API_KEY)
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")