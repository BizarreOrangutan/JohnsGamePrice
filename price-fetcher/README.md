# Price Fetcher Service

A Python microservice that retrieves game metadata and pricing information from the IsThereAnyDeal (ITAD) API. Built with FastAPI for high-performance async operations and comprehensive API integration.

## 🚀 Features

- **ITAD API Integration**: Game search and price comparison from multiple stores
- **FastAPI Framework**: High-performance async web service with automatic documentation
- **Docker Support**: Containerized deployment with multi-stage builds
- **Comprehensive Testing**: Unit tests with mocked external dependencies
- **Type Safety**: Full Python type hints throughout the codebase

## 📁 Project Structure

```
price-fetcher/
├── src/
│   ├── itad_client.py       # ITAD API client for game search and pricing
│   ├── main.py              # FastAPI application
│   └── __init__.py          # Package initialization
├── tests/
│   └── test_itad_client.py  # Unit tests with mocking
├── Dockerfile               # Multi-stage container build
├── requirements.txt         # Production dependencies
├── requirements-dev.txt     # Development dependencies
├── .env.example             # Environment variable template
├── .gitignore              # Git ignore patterns
└── README.md               # This documentation
```

## 🛠 Tech Stack

- **Python 3.13**: Latest Python with enhanced type system
- **FastAPI**: High-performance async web framework
- **requests**: HTTP client for ITAD API integration
- **pytest**: Comprehensive testing framework
- **Docker**: Containerization for deployment

## 🚀 Quick Start

### **Local Development**

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd price-fetcher
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

4. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your ITAD API key
   ```

5. **Run the service**:
   ```bash
   uvicorn src.main:app --reload
   ```

6. **Access the API**:
   - **Interactive docs**: `http://localhost:8000/docs`
   - **Game search**: `http://localhost:8000/game-ids?title=portal`
   - **Price lookup**: `http://localhost:8000/price/steam?game_id=620&currency=USD`

### **Docker Deployment**

1. **Build the image**:
   ```bash
   docker build -t price-fetcher .
   ```

2. **Run tests**:
   ```bash
   docker build --target test -t price-fetcher-test .
   docker run --rm price-fetcher-test
   ```

3. **Run the service**:
   ```bash
   docker run -p 8000:8000 --env-file .env price-fetcher
   ```

## 📚 API Documentation

### **Game Search Endpoint**

**Endpoint**: `GET /game-ids`

**Parameters**:
- `title` (required): Game title to search for
- `result_num` (optional): Maximum number of results (default: 10)

**Example Request**:
```bash
curl "http://localhost:8000/game-ids?title=portal&result_num=5"
```

**Example Response**:
```json
{
  "games": [
    {
      "title": "Portal",
      "plain": "portal"
    }
  ],
  "count": 1
}
```

### **Price Lookup Endpoint**

**Endpoint**: `GET /price/steam`

**Parameters**:
- `game_id` (required): Steam app ID
- `currency` (optional): Currency code (default: USD)

**Example Request**:
```bash
curl "http://localhost:8000/price/steam?game_id=620&currency=USD"
```

**Example Response**:
```json
{
  "currency": "USD",
  "initial": 999,
  "final": 999,
  "discount_percent": 0,
  "final_formatted": "$9.99"
}
```

## 🔐 Environment Configuration

Create a `.env` file with your ITAD API key:

```bash
API_KEY=your_itad_api_key_here
```

### **Getting ITAD API Key**

1. Register at [IsThereAnyDeal API](https://itad.docs.apiary.io/)
2. Request an API key
3. Add the key to your `.env` file

## 🧪 Testing

### **Run Tests Locally**

```bash
# Run all tests
pytest tests/

# Run with coverage
pytest tests/ --cov=src --cov-report=html

# Run specific test file
pytest tests/test_itad_client.py -v
```

### **Run Tests in Docker**

```bash
docker build --target test -t price-fetcher-test .
docker run --rm price-fetcher-test
```

## 🏗 Architecture

### **ITAD Client Design**

```python
class ITADClient:
    def __init__(self, api_key: str):
        """Initialize with ITAD API key"""
        
    def search_games(self, title: str, result_num: int = 10) -> List[Dict]:
        """Search games by title with ITAD API"""
        
    def get_steam_price(self, game_id: str, currency: str = "USD") -> Dict:
        """Get current Steam price for a game"""
```

### **FastAPI Integration**

- **Automatic Documentation**: OpenAPI/Swagger UI at `/docs`
- **Type Safety**: Pydantic models for request/response validation
- **Async Support**: Non-blocking I/O for better performance
- **Error Handling**: Graceful error responses with proper HTTP status codes

## 🚀 Future Enhancements

- [ ] **Multiple Stores**: Support for GOG, Epic Games, and other platforms
- [ ] **Caching**: Redis integration for API response caching
- [ ] **Rate Limiting**: Request throttling for ITAD API compliance
- [ ] **Historical Prices**: Price history tracking and trends
- [ ] **Webhooks**: Real-time price change notifications
- [ ] **Bulk Operations**: Batch price lookups for multiple games

## 📝 License