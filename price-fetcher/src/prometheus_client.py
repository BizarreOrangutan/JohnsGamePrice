from prometheus_client import Histogram, start_http_server

# Histogram to track endpoint durations
endpoint_duration = Histogram(
    'price_fetcher_endpoint_duration_seconds',
    'Duration of endpoint execution in seconds',
    ['endpoint']
)

def start_metrics_server(port=8001):
    """Start Prometheus metrics server on the given port."""
    start_http_server(port)