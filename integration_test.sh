#!/bin/bash

set -euo pipefail

trap 'echo ❌ Script failed at line $LINENO. Last command: $BASH_COMMAND; kubectl get pods --all-namespaces; exit 1' ERR

# Detect OS for port cleanup
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  # Windows/MINGW64
  for port in 8080 8000; do
    for pid in $(netstat -ano | grep ":$port" | awk '{print $5}' | sort | uniq); do
      if [[ "$pid" =~ ^[0-9]+$ ]]; then
        taskkill //PID $pid //F || true
      fi
    done
  done
else
  # Linux/Mac
  lsof -i :8080 -t | xargs -r kill || true
  lsof -i :8000 -t | xargs -r kill || true
fi

# Only run minikube docker-env locally
if [[ "${USE_KIND:-}" != "true" ]] && command -v minikube &> /dev/null; then
  eval $(minikube docker-env)
fi

# Only build Docker images locally (not in CI)
if [[ "${USE_KIND:-}" != "true" ]]; then
  echo "🚀 Building Docker images..."
  docker build -t johnsgameprice-api-gateway:latest ./api-gateway
  docker build -t johnsgameprice-price-fetcher:latest ./price-fetcher
  docker build -t johnsgameprice-web:latest ./web
  echo "✅ Docker images built."
fi

if [[ "${USE_KIND:-}" != "true" && "${CI:-}" != "true" ]]; then
  # Only run locally, not in CI
  if ! kubectl get secret price-fetcher-secret --namespace=default &>/dev/null; then
    echo "Creating price-fetcher-secret from .env"
    source .env
    kubectl create secret generic price-fetcher-secret --from-literal=API_KEY="$API_KEY" --namespace=default
  else
    echo "price-fetcher-secret already exists, skipping creation."
  fi
fi

echo "📦 Deploying stack..."
bash .deploy.test.sh
echo "✅ Stack deployed."

echo "🔗 Starting port-forwards..."
kubectl port-forward svc/api-gateway 8080:8080 &
PF1_PID=$!
kubectl port-forward svc/price-fetcher 8000:8000 &
PF2_PID=$!
sleep 10
echo "✅ Port-forwards established."

echo "🔎 Testing API Gateway /api-docs endpoint..."
curl -f http://localhost:8080/api-docs
echo "✅ /api-docs endpoint passed."

echo "🔎 Testing API Gateway /api/games/search endpoint..."
curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080/api/games/search?query=portal"
echo "✅ /api/games/search endpoint passed."

echo "🔎 Testing Price Fetcher /health endpoint..."
curl -f http://localhost:8000/health
echo "✅ /health endpoint passed."

echo "🔎 Testing Price Fetcher /game-ids endpoint..."
curl -f "http://localhost:8000/game-ids?title=portal"
echo "✅ /game-ids endpoint passed."

kill $PF1_PID $PF2_PID

echo "🎉 All integration tests"