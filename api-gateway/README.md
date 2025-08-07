# JohnsGamePrice - API Gateway

A high-performance API Gateway built with Bun and TypeScript that orchestrates communication between the frontend and backend services for game price comparison.

## 🚀 Features

- **Service Orchestration**: Routes requests between frontend and price-fetcher service
- **Game Search Proxy**: Seamless integration with ITAD API through price-fetcher
- **CORS Support**: Cross-origin requests handling for web frontend
- **Error Handling**: Comprehensive error responses, service health monitoring, and centralized error logging
- **Type Safety**: Full TypeScript implementation with strict typing
- **Fast Performance**: Built on Bun runtime for optimal speed
- **Redis Caching**: Uses Redis for caching game data and improving response times
- **Centralized Logging**: Integrated with Loki, Promtail, and Grafana for log aggregation and monitoring

## 📁 Project Structure

```
api-gateway/
├── src/
│   ├── app.ts                  # Express application setup
│   ├── index.ts                # Server entry point
│   └── routes/
│       └── games.ts            # Game search endpoint handlers
│   └── utils/
│       ├── errorHandler.ts     # Centralized error handling
│       ├── logger.ts           # Logging utility
│       ├── redisClient.ts      # Redis client setup
│       └── ...
├── tests/
│   ├── app.test.ts             # Core application tests
│   ├── games.test.ts           # Game search endpoint tests
│   └── setups.ts               # Test utilities and mocks
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── eslint.config.js            # ESLint configuration
├── prettier.config.js          # Prettier configuration
├── Dockerfile                  # Container configuration
└── README.md                   # This documentation
```

## 🛠 Tech Stack

- **Bun**: Fast JavaScript runtime and package manager
- **TypeScript**: Type-safe JavaScript with latest features
- **Express**: Web application framework
- **Redis**: In-memory caching for fast data retrieval
- **Supertest**: HTTP assertion testing
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Loki/Promtail/Grafana**: Centralized logging and monitoring

## 🚀 Quick Start

### **Local Development**

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Start development server**:
   ```bash
   bun run dev
   ```

3. **Access the API**:
   - **Health check**: `http://localhost:8080/health`
   - **API docs**: `http://localhost:8080/api-docs/`
   - **Game search**: `http://localhost:8080/api/games/search?query=portal`
   - **Redis status**: `http://localhost:8080/redis-status`

### **Production Build**

1. **Build the application**:
   ```bash
   bun run build
   ```

2. **Start production server**:
   ```bash
   bun run start
   ```

### **Docker Deployment**

1. **Build the image**:
   ```bash
   docker build -t johnsgameprice-api-gateway .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8080:8080 \
     -e PRICE_FETCHER_SERVICE_URL=http://price-fetcher:8000 \
     -e REDIS_URL=redis://redis:6379 \
     johnsgameprice-api-gateway
   ```

## 📚 API Documentation

### **Game Search Endpoint**

**Endpoint**: `GET /api/games/search`

**Parameters**:
- `query` (required): Game title to search for

**Example Request**:
```bash
curl "http://localhost:8080/api/games/search?query=portal"
```

**Example Response**:
```json
{
  "query": "portal",
  "results": [
    {
      "id": "018d937f-21e1-728e-86d7-9acb3c59f2bb",
      "slug": "portal-2",
      "title": "Portal 2",
      "type": "game",
      "mature": false,
      "assets": {
        "boxart": "https://assets.isthereanydeal.com/...",
        "banner": "https://assets.isthereanydeal.com/...",
        "logo": "https://assets.isthereanydeal.com/..."
      }
    }
  ],
  "count": 1,
  "timestamp": "2025-01-01T12:00:00Z"
}
```

### **Health Check Endpoint**

**Endpoint**: `GET /health`

**Example Response**:
```json
{
  "status": "healthy",
  "service": "api-gateway",
  "timestamp": "2025-01-01T12:00:00Z",
  "dependencies": {
    "price-fetcher": "healthy",
    "redis": "healthy"
  }
}
```

### **Redis Status Endpoint**

**Endpoint**: `GET /redis-status`

**Description**: Returns the status of the Redis cache connection.

**Example Response**:
```json
{
  "redis": "connected"
}
```

## 🔧 Configuration

### **Environment Variables**

```bash
# Service URLs
PRICE_FETCHER_SERVICE_URL=http://localhost:8000

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Server Configuration
PORT=8080
NODE_ENV=production
LOG_LEVEL=info

# CORS Configuration (optional)
CORS_ORIGIN=*
```

### **Service Dependencies**

The API Gateway requires the Price Fetcher service and Redis to be running:

- **Price Fetcher**: `http://localhost:8000` (or container network)
- **Redis**: `redis://localhost:6379` (or container network)
- **Health Checks**: Monitors service and cache availability
- **Error Handling**: Graceful fallbacks when services are unavailable

## 🧪 Testing

### **Run Tests Locally**

```bash
# Run all tests
bun test

# Run with verbose output
bun test --verbose

# Run specific test file
bun test games.test.ts

# Run with timeout
bun test --timeout 30000
```

### **Run Tests in Docker**

```bash
docker build --target dev -t api-gateway-test .
docker run --rm api-gateway-test bun test
```

### **Test Coverage**

```bash
# Run tests with coverage
bun test --coverage

# Generate coverage report
bun test --coverage --coverage-reporter=html
```

## 🔍 Code Quality

### **Linting**

```bash
# Run ESLint
bun run lint

# Fix linting issues
bun run lint:fix
```

### **Formatting**

```bash
# Format code with Prettier
bun run format

# Check formatting
bun run format:check
```

### **CodeQL Security Scanning**

- Automated security analysis is enabled via GitHub Actions and CodeQL.
- See `.github/workflows/codeql.yml` for configuration.

## 🏗 Architecture

### **Request Flow**

```
Web Frontend
    ↓ HTTP Request
API Gateway (Express/Bun)
    ↓ Proxy Request
Price Fetcher Service
    ↓ External API Call
ITAD API
```

### **Error Handling**

- **Service Errors**: Proper HTTP status codes and error messages
- **Timeout Handling**: Request timeouts with appropriate responses
- **Fallback Responses**: Graceful degradation when services are unavailable
- **Centralized Logging**: All errors and warnings are logged and can be viewed in Grafana
- **Logging Utility**: All logs are structured and sent to Loki via Promtail

### **CORS Configuration**

- **Cross-Origin Support**: Enables frontend-backend communication
- **Configurable Origins**: Environment-based CORS configuration
- **Preflight Handling**: Proper OPTIONS request handling

## 🔗 Service Integration

### **Price Fetcher Integration**

The API Gateway acts as a proxy to the Price Fetcher service:

```typescript
// Game search proxy
app.get('/api/games/search', async (req, res) => {
  const { query } = req.query;
  
  try {
    const response = await fetch(
      `${PRICE_FETCHER_URL}/game-ids?title=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    
    res.json({
      query,
      results: data.games || [],
      count: data.count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Search failed', { error });
    res.status(500).json({ error: 'Search failed' });
  }
});
```

### **Response Transformation**

- **Data Mapping**: Transforms price-fetcher responses for frontend consumption
- **Error Normalization**: Consistent error response format
- **Metadata Addition**: Adds timestamps and request tracking

## 📊 Monitoring & Logging

### **Centralized Logging with Loki, Promtail, and Grafana**

- **Promtail** collects logs from all Docker containers and forwards them to **Loki**.
- **Loki** stores and indexes logs for fast querying.
- **Grafana** provides dashboards and log search capabilities.
- **How to use**:
  1. Start the stack:
     ```bash
     docker compose up -d
     ```
  2. Access Grafana at [http://localhost:3001](http://localhost:3001) (default: `admin`/`admin`)
  3. Use the **Explore** tab to query logs, e.g.:
     ```
     {compose_service="api-gateway"}
     ```
     or visualize log rates with:
     ```
     count_over_time({compose_service="api-gateway"}[5m])
     ```

### **Health Checks**

- **Service Health**: Monitors price-fetcher and Redis availability
- **Response Times**: Tracks API response performance
- **Error Rates**: Monitors error frequency and types

### **Logging**

- **Request Logging**: HTTP request/response logging
- **Error Logging**: Detailed error information
- **Performance Logging**: Response time tracking
- **Centralized Log Viewing**: All logs can be viewed and analyzed in Grafana

## 🚀 Future Enhancements

- [ ] **Rate Limiting**: Request throttling and quota management
- [ ] **Caching**: Response caching for improved performance
- [ ] **Authentication**: JWT token validation and user management
- [ ] **Load Balancing**: Multiple price-fetcher instance support
- [ ] **Metrics**: Prometheus metrics integration
- [ ] **Circuit Breaker**: Fault tolerance for service failures
- [ ] **API Versioning**: Support for multiple API versions

## 📝 License

This project is part of the JohnsGamePrice application suite.
