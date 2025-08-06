# JohnsGamePrice

A modern, microservices-based game price comparison platform that helps users find the best deals across multiple gaming platforms. Built with a React TypeScript frontend, Node.js API Gateway, and Python FastAPI backend.

# 🎥 EARLY DEVELOPMENT DEMO

Apologies for the echo in this video, my camera and headphones were both picking up audio.
YouTube link: https://youtu.be/14r3h3mTnzs

## 🚀 Features

- **Real-time Game Search**: Autocomplete search with game images and metadata
- **Multi-platform Price Comparison**: Compare prices across Steam, GOG, and other platforms
- **Modern UI**: Responsive design with dark/light theme support
- **Microservices Architecture**: Scalable and maintainable service-oriented design
- **Type Safety**: Full TypeScript and Python type safety throughout
- **Containerized Deployment**: Docker support for all services

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   API Gateway   │    │ Price Fetcher   │
│  (React/TS/Vite)│────│  (Bun/Express)  │────│ (Python/FastAPI)│
│     Port 3000   │    │    Port 8080    │    │    Port 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                                ┌─────────────────┐
                                                │   ITAD API      │
                                                │  (External)     │
                                                └─────────────────┘
```

## 📁 Project Structure

```
JohnsGamePrice/
├── web/                           # React TypeScript Frontend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── core/              # Core UI components and hooks
│   │   │   ├── error/             # Error handling
│   │   │   └── pages/             # Page components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
├── api-gateway/                   # API Gateway Service
│   ├── src/
│   │   ├── app.ts                 # Express application
│   │   ├── index.ts               # Server entry point
│   │   └── routes/
│   │       └── games.ts           # Game search endpoints
│   ├── tests/                     # Comprehensive test suite
│   ├── Dockerfile
│   └── package.json
├── price-fetcher/                 # Python Backend Service
│   ├── src/
│   │   ├── main.py                # FastAPI application
│   │   └── itad_client.py         # ITAD API client
│   ├── tests/                     # Unit and integration tests
│   ├── Dockerfile
│   └── requirements.txt
├── .github/
│   └── workflows/
│       └── test.yml               # CI/CD pipeline
├── docker-compose.yml             # Development environment
├── docker-compose.test.yml        # Testing environment
└── README.md                      # This documentation
```

## 🛠 Tech Stack

### **Frontend (Web)**
- **React 19**: Modern React with latest features
- **TypeScript 5.8**: Type-safe JavaScript
- **Vite 7**: Fast build tool and dev server
- **Material-UI 7**: Component library
- **Bun**: Runtime and package manager

### **API Gateway**
- **Bun**: Fast JavaScript runtime
- **TypeScript**: Type-safe development
- **Express**: Web framework
- **Supertest**: Testing framework

### **Backend (Price Fetcher)**
- **Python 3.13**: Latest Python
- **FastAPI**: High-performance async framework
- **pytest**: Testing framework
- **requests**: HTTP client library

### **Infrastructure**
- **Docker**: Containerization
- **Docker Compose**: Multi-service orchestration
- **GitHub Actions**: CI/CD pipeline

## 🚀 Quick Start

### **Prerequisites**

- **Bun** (for web and api-gateway)
- **Python 3.13+** (for price-fetcher)
- **Docker & Docker Compose** (for containerized deployment)
- **ITAD API Key** (sign up at [IsThereAnyDeal](https://itad.docs.apiary.io/))

### **Local Development**

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd JohnsGamePrice
   ```

2. **Set up environment variables**:
   ```bash
   # Create .env file with your ITAD API key
   echo "API_KEY=your_itad_api_key_here" > .env
   ```

3. **Start all services with Docker Compose**:
   ```bash
   docker compose up --build
   ```

4. **Access the application**:
   - **Web Frontend**: http://localhost:3000
   - **API Gateway**: http://localhost:8080
   - **Price Fetcher**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

### **Individual Service Development**

#### **Web Frontend**
```bash
cd web
bun install
bun run dev
# Access at http://localhost:3000
```

#### **API Gateway**
```bash
cd api-gateway
bun install
bun run dev
# Access at http://localhost:8080
```

#### **Price Fetcher**
```bash
cd price-fetcher
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn src.main:app --reload
# Access at http://localhost:8000
```

## 🧪 Testing

### **Run All Tests**

```bash
# Using GitHub Actions workflow locally
act -j test-price-fetcher
act -j test-api-gateway
act -j integration-tests
```

### **Individual Service Tests**

#### **Price Fetcher Tests**
```bash
cd price-fetcher
pytest tests/ -v --cov=src
```

#### **API Gateway Tests**
```bash
cd api-gateway
bun test
bun run lint
```

#### **Web Frontend Tests**
```bash
cd web
bun test
```

### **Docker Tests**

```bash
# Test with Docker Compose
docker compose -f docker-compose.test.yml up --build
```

## 📚 API Documentation

### **Game Search**

**Endpoint**: `GET /api/games/search?query={game_title}`

**Example**:
```bash
curl "http://localhost:8080/api/games/search?query=portal"
```

**Response**:
```json
{
  "query": "portal",
  "results": [
    {
      "id": "018d937f-21e1-728e-86d7-9acb3c59f2bb",
      "slug": "portal-2",
      "title": "Portal 2",
      "type": "game",
      "assets": {
        "boxart": "https://assets.isthereanydeal.com/...",
        "banner": "https://assets.isthereanydeal.com/..."
      }
    }
  ],
  "count": 1,
  "timestamp": "2025-01-01T12:00:00Z"
}
```

### **Health Checks**

- **API Gateway**: `GET http://localhost:8080/health`
- **Price Fetcher**: `GET http://localhost:8000/health`

## 🔧 Configuration

### **Environment Variables**

#### **API Gateway**
```bash
PRICE_FETCHER_SERVICE_URL=http://localhost:8000
PORT=8080
NODE_ENV=production
LOG_LEVEL=info
```

#### **Price Fetcher**
```bash
API_KEY=your_itad_api_key
```

#### **Web Frontend**
```bash
VITE_API_URL=http://localhost:8080
```

## 🚀 Deployment

### **Production Docker Compose**

```yaml
version: '3.8'
services:
  web:
    build:
      context: ./web
      target: runtime
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=https://api.yourdomain.com
    
  api-gateway:
    build:
      context: ./api-gateway
      target: runtime
    ports:
      - "8080:8080"
    environment:
      - PRICE_FETCHER_SERVICE_URL=http://price-fetcher:8000
    
  price-fetcher:
    build:
      context: ./price-fetcher
      target: runtime
    environment:
      - API_KEY=${API_KEY}
    ports:
      - "8000:8000"
```

### **CI/CD Pipeline**

The project includes a comprehensive GitHub Actions workflow:

- **Automated Testing**: Runs tests for all services
- **Docker Builds**: Builds and tests Docker images
- **Integration Tests**: End-to-end service testing
- **Conditional Execution**: Only tests changed services

Trigger full test suite with commit message: `[test all]`

## 🎯 Key Features

### **Game Search with Autocomplete**
- Real-time search as you type
- Game images and metadata
- Debounced API calls for performance
- Error handling and loading states

### **Responsive Design**
- Mobile-first approach
- Dark/light theme support
- Material-UI components
- Touch-friendly interface

### **Microservices Architecture**
- Service isolation and scalability
- Docker containerization
- Health monitoring
- Graceful error handling

### **Type Safety**
- Full TypeScript coverage in frontend and API Gateway
- Python type hints in backend
- API contract validation
- Compile-time error detection

## 🔗 Service Communication

### **Request Flow**

1. **User Search**: User types in search box
2. **Debounced Request**: Frontend sends debounced request to API Gateway
3. **Service Proxy**: API Gateway forwards request to Price Fetcher
4. **External API**: Price Fetcher queries ITAD API
5. **Response Chain**: Data flows back through services with transformations

### **Error Handling**

- **Network Errors**: Graceful fallbacks and user-friendly messages
- **Service Unavailable**: Health checks and circuit breaker patterns
- **Invalid Data**: Input validation and sanitization
- **Rate Limiting**: Debouncing and request throttling

## 🚀 Future Enhancements

### **Frontend**
- [ ] User authentication and profiles
- [ ] Game details pages with comprehensive information
- [ ] Price tracking and wishlist functionality
- [ ] Progressive Web App (PWA) support

### **Backend**
- [ ] Multiple store support (GOG, Epic Games, etc.)
- [ ] Price history and trend analysis
- [ ] Real-time price alerts
- [ ] Caching layer with Redis

### **Infrastructure**
- [ ] Kubernetes deployment
- [ ] Monitoring and observability
- [ ] Load balancing and auto-scaling
- [ ] Database integration for user data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Run the full test suite
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License. See LICENSE file for details.

---

Built with ❤️ for gamers who love great deals!
