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

echo "🚀 Building Docker images..."
docker build -t johnsgameprice-api-gateway:latest ./api-gateway
docker build -t johnsgameprice-price-fetcher:latest ./price-fetcher
docker build -t johnsgameprice-web:latest ./web
echo "✅ Docker images built."

# Use KinD image loading if USE_KIND is set
if [[ "${USE_KIND:-}" == "true" ]]; then
  echo "🔄 Loading images into KinD..."
  kind load docker-image johnsgameprice-api-gateway:latest --name chart-testing
  kind load docker-image johnsgameprice-price-fetcher:latest --name chart-testing
  kind load docker-image johnsgameprice-web:latest --name chart-testing
  echo "✅ Images loaded into KinD."
fi

# Ensure Redis password secret is available in default namespace for api-gateway
if kubectl get secret redis --namespace=redis &>/dev/null; then
  REDIS_PASSWORD=$(kubectl get secret redis --namespace=redis -o jsonpath="{.data.redis-password}" | base64 --decode)
  kubectl delete secret redis --namespace=default --ignore-not-found
  kubectl create secret generic redis --from-literal=redis-password="$REDIS_PASSWORD" --namespace=default
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

echo "🔎 Testing API Gateway /api/games/search endpoint (should use Redis)..."
curl -s "http://localhost:8080/api/games/search?query=portal" > /tmp/search_response.json
echo "✅ /api/games/search endpoint called."

echo "🔎 Checking Redis for cached search key..."
REDIS_PASSWORD=$(kubectl get secret redis --namespace=default -o jsonpath="{.data.redis-password}" | base64 --decode)
# Adjust the key pattern below to match your app's cache key naming
kubectl run redis-client --image=bitnami/redis --restart=Never --rm -i --tty --command -- \
  redis-cli -h redis-master -a "$REDIS_PASSWORD" keys '*portal*' | grep -q portal \
  && echo "✅ Redis contains a cache key for 'portal'." \
  || (echo "❌ Redis does not contain a cache key for 'portal'." && exit 1)

kill $PF1_PID $PF2_PID

echo "🎉 All integration tests completed successfully!"