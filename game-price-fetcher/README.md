# Game Price Fetcher

A microservice-based game price aggregator built with Python, FastAPI, and Docker. This service fetches game pricing information from multiple digital storefronts using a scalable, template-method design pattern.

## 🚀 Features

- **Multi-Store Support**: Currently supports Steam with extensible architecture for additional platforms
- **Template Method Pattern**: Clean, maintainable code structure for adding new price fetchers
- **RESTful API**: FastAPI-powered endpoints with automatic documentation
- **Docker Support**: Multi-stage builds with separate test and runtime environments
- **Comprehensive Testing**: Unit tests with mocking for reliable CI/CD
- **Currency Support**: Fetch prices in multiple currencies (USD, GBP, EUR, etc.)

## 🎥 Demo

Watch the current implementation in action: [Game Price Fetcher Demo](https://youtu.be/Z8OBaXUVD0E)   

## 🛠 Tech Stack

- **Python 3.13**: Modern Python with type hints
- **FastAPI**: High-performance async web framework
- **Docker**: Containerized deployment
- **pytest**: Comprehensive testing framework
- **Design Patterns**: Template Method for extensible fetcher architecture

## 📁 Project Structure

```
game-price-fetcher/
├── src/
│   ├── templates/
│   │   └── price_fetcher.py      # Abstract base class
│   ├── fetchers/
│   │   └── steam.py              # Steam price fetcher implementation
│   └── main.py                   # FastAPI application
├── tests/
│   └── test_steam.py             # Unit tests with mocking
├── Dockerfile                    # Multi-stage Docker build
├── requirements.txt              # Production dependencies
└── requirements-dev.txt          # Development dependencies
```

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd game-price-fetcher
   ```

2. **Set up virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

4. **Run the application**
   ```bash
   uvicorn src.main:app --reload
   ```

5. **Access the API**
   - Interactive docs: `http://localhost:8000/docs`
   - API endpoint: `http://localhost:8000/price/steam?game_id=620&currency=USD`

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t game-price-fetcher .
   ```

2. **Run tests**
   ```bash
   docker build --target test -t game-price-fetcher-test .
   docker run --rm game-price-fetcher-test
   ```

3. **Run the service**
   ```bash
   docker run -p 8000:8000 game-price-fetcher
   ```

## 📚 API Documentation

### Get Steam Price

**Endpoint**: `GET /price/steam`

**Parameters**:
- `game_id` (required): Steam App ID
- `currency` (optional): Currency code (default: "GBP")

**Example Request**:
```bash
curl "http://localhost:8000/price/steam?game_id=620&currency=GBP"
```

**Example Response**:
```json
{
  "currency": "USD",
  "initial": 1999,
  "final": 1999,
  "discount_percent": 0,
  "final_formatted": "$19.99"
}
```

## 🧪 Testing

Run the test suite:

```bash
# Local testing
pytest tests/

# Docker testing
docker build --target test -t game-price-fetcher-test .
docker run --rm game-price-fetcher-test
```

## 🏗 Architecture & Design Patterns

### Template Method Pattern

The project uses the Template Method pattern to create a scalable architecture for multiple price fetchers:

```python
# Abstract base class defines the algorithm structure
class PriceFetcher(ABC):
    def fetch(self, game_id, currency="GBP"):
        raw_data = self._get_raw_data(game_id, currency)  # Step 1: Fetch
        return self._parse_price(raw_data)                # Step 2: Parse
    
    @abstractmethod
    def _get_raw_data(self, game_id, currency="GBP"): pass
    
    @abstractmethod
    def _parse_price(self, raw_data): pass

# Concrete implementations handle store-specific logic
class SteamPriceFetcher(PriceFetcher):
    def _get_raw_data(self, game_id, currency="GBP"):
        # Steam API specific implementation
    
    def _parse_price(self, raw_data):
        # Steam response parsing logic
```

### Benefits:
- **Extensibility**: Easy to add new stores (GOG, Epic, etc.)
- **Maintainability**: Common logic in base class, store-specific logic isolated
- **Testability**: Each component can be tested independently

## 🔮 Future Enhancements

- [ ] Additional store integrations (GOG, Epic Games, PlayStation Store)
- [ ] Price history tracking and trend analysis
- [ ] Caching layer for improved performance
- [ ] Rate limiting and API quotas
- [ ] Game search by name (integration with IGDB)
- [ ] Price comparison across multiple stores
- [ ] WebSocket support for real-time price updates

## 👨‍💻 Development Highlights

This project demonstrates:

- **Clean Architecture**: Separation of concerns with clear abstractions
- **Modern Python**: Type hints, async/await, and Python 3.13 features
- **Testing Best Practices**: Comprehensive unit tests with mocking
- **DevOps Ready**: Docker containerization with multi-stage builds
- **API Design**: RESTful endpoints with automatic documentation
- **Design Patterns**: Practical application of GoF patterns
- **Scalable Structure**: Easy to extend for new requirements

## 📝 License

This project is licensed under the MIT License.