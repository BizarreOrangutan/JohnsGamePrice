#!/bin/bash

set -e

# Detect environment
IS_CI="${CI:-false}"
IS_KIND="${USE_KIND:-false}"

# Load env vars for local
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Create monitoring namespace if it doesn't exist
kubectl get namespace monitoring >/dev/null 2>&1 || kubectl create namespace monitoring

# Add Helm repos
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Build Docker images (parallel, only locally or in Minikube)
if [[ "$IS_CI" != "true" && "$IS_KIND" != "true" ]]; then
  eval $(minikube docker-env)
  docker build -t johnsgameprice-api-gateway:latest ./api-gateway &
  docker build -t johnsgameprice-price-fetcher:latest ./price-fetcher &
  docker build -t johnsgameprice-web:latest ./web &
  wait
fi

# Create secrets (idempotent)
if [ -n "${API_KEY:-}" ]; then
  kubectl create secret generic price-fetcher-secret --from-literal=API_KEY="${API_KEY}" --namespace=default --dry-run=client -o yaml | kubectl apply -f -
elif [ -n "${ISTHEREANYDEAL_API_KEY:-}" ]; then
  kubectl create secret generic price-fetcher-secret --from-literal=API_KEY="${ISTHEREANYDEAL_API_KEY}" --namespace=default --dry-run=client -o yaml | kubectl apply -f -
fi

if [ -n "${GRAFANA_ADMIN_USER:-}" ] && [ -n "${GRAFANA_ADMIN_PASSWORD:-}" ]; then
  kubectl create secret generic grafana-admin-creds \
    --from-literal=admin-user="${GRAFANA_ADMIN_USER}" \
    --from-literal=admin-password="${GRAFANA_ADMIN_PASSWORD}" \
    -n monitoring --dry-run=client -o yaml | kubectl apply -f -
fi

# Deploy monitoring stack (parallel)
helm upgrade --install loki grafana/loki --namespace monitoring --values johnsgameprice-stack/loki-values.yaml &
helm upgrade --install promtail grafana/promtail --namespace monitoring --values johnsgameprice-stack/promtail-values.yaml &
helm upgrade --install grafana grafana/grafana --namespace monitoring --values johnsgameprice-stack/grafana-values.yaml &
helm upgrade --install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --values johnsgameprice-stack/prometheus-values.yaml &
wait

# Deploy Redis
helm upgrade --install redis bitnami/redis --namespace default

# Get Redis password and create secret (idempotent)
REDIS_PASSWORD=$(kubectl get secret --namespace default redis -o jsonpath="{.data.redis-password}" | base64 -d)
kubectl create secret generic redis --from-literal=redis-password="$REDIS_PASSWORD" --namespace=default --dry-run=client -o yaml | kubectl apply -f -

echo "Applying manifests..."
kubectl apply -f k8s/

echo "✅ Helm charts deployed and manifests applied!"

# Wait for deployments to be ready
kubectl rollout status deployment/api-gateway -n default --timeout=180s
kubectl rollout status deployment/price-fetcher -n default --timeout=180s
kubectl rollout status deployment/web -n default --timeout=180s
kubectl rollout status deployment/grafana -n monitoring --timeout=180s
kubectl rollout status statefulset/prometheus-prometheus-kube-prometheus-prometheus -n monitoring --timeout=240s || true