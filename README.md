# JohnsGamePrice

A modern, microservices-based game price comparison platform that helps users find the best deals across multiple gaming platforms. Built with a React TypeScript frontend, Node.js API Gateway, and Python FastAPI backend.

---

## 🎬 Demo Videos (~10-20 secs each)

- **Kubernetes & Helm Deployment:**  
  [![Kubernetes & Helm Deployment](https://img.youtube.com/vi/v-vjEqX9jUE/0.jpg)](https://youtu.be/v-vjEqX9jUE)
- **Integration Test Run:**  
  [![Integration Test Demo](https://img.youtube.com/vi/X9teUze1XmY/0.jpg)](https://youtu.be/X9teUze1XmY)
- **Grafana & Loki Log Monitoring:**  
  [![Grafana & Loki Demo](https://img.youtube.com/vi/lJPa0Fr9G2o/0.jpg)](https://youtu.be/lJPa0Fr9G2o)
- **Frontend Live Search:**  
  [![Frontend Live Search](https://img.youtube.com/vi/GytnT7mRk2Q/0.jpg)](https://youtu.be/GytnT7mRk2Q)

---

## 🚀 Features

- **Real-time Game Search**: Autocomplete search with game images and metadata
- **Multi-platform Price Comparison**: Compare prices across Steam, GOG, and other platforms
- **Modern UI**: Responsive design with dark/light theme support
- **Microservices Architecture**: Scalable and maintainable service-oriented design
- **Type Safety**: Full TypeScript and Python type safety throughout
- **Containerized Deployment**: Docker support for all services
- **Kubernetes & Helm Support**: Production-grade orchestration and deployment
- **Centralized Logging & Monitoring**: Loki, Promtail, and Grafana integration
- **Automated Code Scanning**: CodeQL integration for security and code quality

---

## 🆕 Infrastructure Additions

### Kubernetes & Helm

- **Kubernetes**: The platform is now fully deployable to Kubernetes clusters, supporting both local (KinD, Minikube) and cloud environments.
- **Helm**: All services and dependencies are managed via Helm charts in the `johnsgameprice-stack` directory, making deployments reproducible and configurable.

### Monitoring & Observability

- **Grafana**: Provides dashboards and visualization for application metrics and logs.
- **Loki**: Aggregates logs from all services for centralized querying and troubleshooting.
- **Promtail**: Collects logs from pods and forwards them to Loki.

---

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

**Infrastructure Layer:**
- **Kubernetes** orchestrates all services and dependencies.
- **Helm** manages deployments and configuration.
- **Grafana, Loki, Promtail** provide observability and monitoring.

---

## 📁 Project Structure

```
JohnsGamePrice/
├── web/                           # React TypeScript Frontend
├── api-gateway/                   # API Gateway Service
├── price-fetcher/                 # Python Backend Service
├── johnsgameprice-stack/          # Helm chart for full stack deployment (Kubernetes)
├── .github/
│   └── workflows/
├── docker-compose.yml             # Development environment
├── docker-compose.test.yml        # Testing environment
└── README.md                      # This documentation
```

---

## 🛠 Tech Stack

### **Frontend (Web)**
- React 19, TypeScript 5.8, Vite 7, Material-UI 7, Bun

### **API Gateway**
- Bun, TypeScript, Express, Supertest

### **Backend (Price Fetcher)**
- Python 3.13, FastAPI, pytest, requests

### **Infrastructure**
- Docker, Docker Compose
- **Kubernetes** (KinD/Minikube/Cloud)
- **Helm** (johnsgameprice-stack)
- **Grafana, Loki, Promtail** (monitoring/logging)
- GitHub Actions (CI/CD)
- CodeQL (security/code scanning)

---

## 🚀 Quick Start

### **Kubernetes & Helm Deployment**

1. **Install Prerequisites**
   - [Docker](https://www.docker.com/)
   - [Kubernetes](https://kubernetes.io/) (KinD or Minikube recommended for local dev)
   - [Helm](https://helm.sh/)

2. **Build Docker Images**
   ```sh
   docker build -t johnsgameprice-api-gateway:latest ./api-gateway
   docker build -t johnsgameprice-price-fetcher:latest ./price-fetcher
   docker build -t johnsgameprice-web:latest ./web
   ```

3. **Load Images into Your Cluster (KinD example)**
   ```sh
   kind load docker-image johnsgameprice-api-gateway:latest
   kind load docker-image johnsgameprice-price-fetcher:latest
   kind load docker-image johnsgameprice-web:latest
   ```

4. **Deploy the Stack with Helm**
   ```sh
   cd johnsgameprice-stack
   helm dependency update
   helm install johnsgameprice .
   ```

5. **Access Grafana**
   ```sh
   kubectl port-forward svc/grafana -n monitoring 3000:80
   ```
   - Visit [http://localhost:3000](http://localhost:3000) (default user: `admin`, password: see Helm output or secret).

6. **View Logs in Grafana**
   - Go to the **Explore** tab, select **Loki** as the data source, and query logs by service.

---

### **Local Docker Compose Development**

```bash
docker compose up --build
```

- **Web Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Price Fetcher**: http://localhost:8000
- **Grafana Monitoring**: http://localhost:3001

---

## 📊 Logging & Monitoring: Loki, Promtail, and Grafana

- **Promtail** collects logs from all pods and forwards them to **Loki**.
- **Loki** stores and indexes logs for fast querying.
- **Grafana** provides dashboards and log search capabilities.
- Example query in Grafana Explore:
  ```
  {app="api-gateway"}
  ```
- Use functions like `count_over_time` for time series graphs:
  ```
  count_over_time({app="api-gateway"}[5m])
  ```

---

## 📝 Notes

- See the `integration_test.sh` script for automated integration testing.
- All Kubernetes manifests and Helm charts are in the `johnsgameprice-stack` directory.
- For local development, see `.env.example` for required environment variables.

---

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
