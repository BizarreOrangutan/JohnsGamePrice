set -e

kubectl delete -f k8s/

helm uninstall grafana -n monitoring || true
helm uninstall promtail -n monitoring || true
helm uninstall loki -n monitoring || true
helm uninstall redis || true