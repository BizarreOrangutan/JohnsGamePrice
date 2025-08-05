# Game ID Fetcher Service

A Python microservice that retrieves game metadata and identifiers from the Internet Game Database (IGDB) API. Built with FastAPI for high-performance async operations and comprehensive OAuth2 authentication.

## 🚀 Features

- **IGDB API Integration**: Secure OAuth2 authentication with IGDB
- **FastAPI Framework**: High-performance async web service with automatic documentation
- **Docker Support**: Containerized deployment with multi-stage builds
- **Comprehensive Testing**: Unit tests with mocked external dependencies
- **Type Safety**: Full Python type hints throughout the codebase

## 📁 Project Structure

```
game-id-fetcher/
├── src/
│   ├── igdb_client.py       # IGDB API client with OAuth2 authentication
│   ├── main.py              # FastAPI application
│   └── __init__.py          # Package initialization
├── tests/
│   └── test_igdb_client.py  # Unit tests with mocking
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
- **requests**: HTTP client for IGDB API integration
- **pytest**: Comprehensive testing framework
- **Docker**: Containerization for deployment

## 🚀 Quick Start

### **Local Development**

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd game-id-fetcher
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
   # Edit .env with your IGDB credentials
   ```

5. **Run the service**:
   ```bash
   uvicorn src.main:app --reload
   ```

6. **Access the API**:
   - **Interactive docs**: `http://localhost:8000/docs`
   - **API endpoint**: `http://localhost:8000/game-ids?name=portal`

### **Docker Deployment**

1. **Build the image**:
   ```bash
   docker build -t game-id-fetcher .
   ```

2. **Run tests**:
   ```bash
   docker build --target test -t game-id-fetcher-test .
   docker run --rm game-id-fetcher-test
   ```

3. **Run the service**:
   ```bash
   docker run -p 8000:8000 --env-file .env game-id-fetcher
   ```

## 📚 API Documentation

### **Game Search Endpoint**

**Endpoint**: `GET /game-ids`

**Parameters**:
- `name` (required): Game name to search for
- `limit` (optional): Maximum number of results (default: 10)

**Example Request**:
```bash
curl "http://localhost:8000/game-ids?name=portal&limit=5"
```

**Example Response**:
```json
{
  "games": [
    {
      "id": 1234,
      "name": "Portal",
      "release_date": "2007-10-10",
      "summary": "A puzzle-platform game..."
    }
  ]
}
```

## 🔐 Environment Configuration

Create a `.env` file with your IGDB credentials:

```bash
IGDB_CLIENT_ID=your_client_id_here
IGDB_CLIENT_SECRET=your_client_secret_here
```

### **Getting IGDB Credentials**

1. Register at [Twitch Developer Console](https://dev.twitch.tv/console)
2. Create a new application
3. Note your Client ID and Client Secret
4. IGDB uses Twitch authentication for API access

## 🧪 Testing

### **Run Tests Locally**

```bash
# Run all tests
pytest tests/

# Run with coverage
pytest tests/ --cov=src --cov-report=html

# Run specific test file
pytest tests/test_igdb_client.py -v
```

### **Run Tests in Docker**

```bash
docker build --target test -t game-id-fetcher-test .
docker run --rm game-id-fetcher-test
```

## 🏗 Architecture

### **IGDB Client Design**

```python
class IGDBClient:
    def __init__(self, client_id: str, client_secret: str):
        """Initialize with OAuth2 credentials"""
        
    def authenticate(self) -> str:
        """Get OAuth2 access token"""
        
    def search_games(self, name: str, limit: int = 10) -> List[Dict]:
        """Search games by name with IGDB API"""
```

### **FastAPI Integration**

- **Automatic Documentation**: OpenAPI/Swagger UI at `/docs`
- **Type Safety**: Pydantic models for request/response validation
- **Async Support**: Non-blocking I/O for better performance
- **Error Handling**: Graceful error responses with proper HTTP status codes

## 🚀 Future Enhancements

- [ ] **Caching**: Redis integration for API response caching
- [ ] **Rate Limiting**: Request throttling for IGDB API compliance
- [ ] **Advanced Search**: Support for multiple search criteria
- [ ] **Game Details**: Extended metadata retrieval
- [ ] **Authentication**: API key management for service access

## 📝 License