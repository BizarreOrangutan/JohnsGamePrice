#!/bin/bash

set -e

echo "⏳ Setting up port-forwarding for local services..."

# Function to port-forward in background
port_forward_bg() {
  svc=$1
  local_port=$2
  svc_port=$3
  ns=$4
  echo "Port-forwarding $svc:$svc_port to localhost:$local_port in namespace $ns"
  kubectl port-forward svc/$svc $local_port:$svc_port --namespace=$ns &
}

# API Gateway (8080, 9100)
port_forward_bg api-gateway 8080 8080 default
port_forward_bg api-gateway 9100 9100 default

# Price Fetcher (8000)
port_forward_bg price-fetcher 8000 8000 default

# Web frontend (3000)
port_forward_bg web 3000 3000 default

# Grafana (3001)
port_forward_bg grafana 3001 80 monitoring

# Prometheus (9090)
port_forward_bg prometheus-kube-prometheus-prometheus 9090 9090 monitoring

# Redis (6379)
port_forward_bg redis-master 6379 6379 default

echo "✅ Port-forwarding started for all services in the background."
echo "To stop all port-forwards, run: kill \$(jobs -p)"
wait