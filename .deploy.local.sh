#!/bin/bash

set -e

# Switch to Minikube's Docker daemon
eval $(minikube docker-env)

# Build all custom images
docker build -t johnsgameprice-api-gateway:latest ./api-gateway
docker build -t johnsgameprice-price-fetcher:latest ./price-fetcher
docker build -t johnsgameprice-web:latest ./web

bash .deploy.test.sh

echo "✅ All images built, Helm charts deployed, and manifests applied