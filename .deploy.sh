#!/bin/bash

set -e

# Switch to Minikube's Docker daemon
eval $(minikube docker-env)

# Build all custom images
docker build -t johnsgameprice-api-gateway:latest ./api-gateway
docker build -t johnsgameprice-price-fetcher:latest ./price-fetcher
docker build -t johnsgameprice-web:latest ./web

# Create namespaces if they don't exist
kubectl get namespace monitoring >/dev/null 2>&1 || kubectl create namespace monitoring
kubectl get namespace redis >/dev/null 2>&1 || kubectl create namespace redis

# Deploy monitoring stack (Loki, Promtail, Grafana) via Helm
helm upgrade --install loki grafana/loki --namespace monitoring --values johnsgameprice-stack/loki-values.yaml
helm upgrade --install promtail grafana/promtail --namespace monitoring --values johnsgameprice-stack/promtail-values.yaml
helm upgrade --install grafana grafana/grafana --namespace monitoring --values johnsgameprice-stack/grafana-values.yaml

# Deploy Redis via Helm
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm upgrade --install redis bitnami/redis --namespace redis

# Apply all Kubernetes manifests for your app
kubectl apply -f k8s/

echo "✅ All images built, Helm charts deployed, and