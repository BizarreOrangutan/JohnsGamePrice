#!/bin/bash

set -e

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Switch to Minikube's Docker daemon
eval $(minikube docker-env)

# Build all custom images
docker build -t johnsgameprice-api-gateway:latest ./api-gateway
docker build -t johnsgameprice-price-fetcher:latest ./price-fetcher
docker build -t johnsgameprice-web:latest ./web

# Create price-fetcher secret
if [ -z "${API_KEY:-}" ]; then
  echo "❌ ERROR: API_KEY is not set. Please set it in your .env file or as an environment variable."
  exit 1
fi
kubectl delete secret price-fetcher-secret --namespace=default || true
kubectl create secret generic price-fetcher-secret --from-literal=API_KEY="${API_KEY}" --namespace=default

# Create monitoring namespace if it doesn't exist
kubectl get namespace monitoring >/dev/null 2>&1 || kubectl create namespace monitoring

# Add grafana's and prometheus' repo using helm
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Deploy monitoring stack (Loki, Promtail, Grafana) via Helm
helm upgrade --install loki grafana/loki --namespace monitoring --values johnsgameprice-stack/loki-values.yaml
helm upgrade --install promtail grafana/promtail --namespace monitoring --values johnsgameprice-stack/promtail-values.yaml
helm upgrade --install grafana grafana/grafana --namespace monitoring --values johnsgameprice-stack/grafana-values.yaml
helm upgrade --install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --values johnsgameprice-stack/prometheus-values.yaml

# Deploy Redis via Helm in the default namespace
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm upgrade --install redis bitnami/redis --namespace default

# Get the Redis password from the Bitnami Helm release in the default namespace
REDIS_PASSWORD=$(kubectl get secret --namespace default redis -o jsonpath="{.data.redis-password}" | base64 -d)

# Create the secret in the default namespace
kubectl delete secret redis --namespace=default --ignore-not-found
kubectl create secret generic redis --from-literal=redis-password="$REDIS_PASSWORD" --namespace=default

echo "Listing files in k8s directory:"
ls -l k8s/

echo "Applying manifests..."
kubectl apply -f k8s/

echo "Deployments in default namespace after apply:"
kubectl get deployments -n default

echo "✅ All images built, Helm charts deployed, and manifests applied!"

# --- Wait for pods to be ready before port-forwarding ---

echo "⏳ Waiting for pods to be ready..."

# Wait for deployments in default namespace
kubectl rollout status deployment/api-gateway -n default --timeout=180s
kubectl rollout status deployment/price-fetcher -n default --timeout=180s
kubectl rollout status deployment/web -n default --timeout=180s

# Wait for grafana in monitoring namespace
kubectl rollout status deployment/grafana -n monitoring --timeout=180s

# Wait for Prometheus StatefulSet (can take longer)
kubectl rollout status statefulset/prometheus-prometheus-kube-prometheus-prometheus -n monitoring --timeout=240s || true

# --- Expose ports for local access ---

echo "To access your services, run the following port-forward commands in separate terminals as needed:"

echo ""
echo "# API Gateway (8080)"
echo "kubectl port-forward svc/api-gateway 8080:8080 --namespace=default"
echo ""
echo "# Price Fetcher (8000)"
echo "kubectl port-forward svc/price-fetcher 8000:8000 --namespace=default"
echo ""
echo "# Web frontend (3000)"
echo "kubectl port-forward svc/web 3000:3000 --namespace=default"
echo ""
echo "# Grafana (3001)"
echo "kubectl port-forward svc/grafana 3001:80 --namespace=monitoring"
echo "kubectl get secret --namespace monitoring grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo"
echo ""
echo "# Prometheus (9090)"
echo "kubectl port-forward svc/prometheus-kube-prometheus-prometheus 9090:9090 --namespace=monitoring"
echo "For grafana use the URL: http://prometheus-kube-prometheus-prometheus.monitoring.svc.cluster.local:9090"
echo ""
echo "# Redis (6379)"
echo "kubectl port-forward svc/redis-master 6379:6379 --namespace=default"
echo ""
echo "Port-forward commands are ready. Copy and run the ones you need"