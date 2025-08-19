kubectl delete -f k8s/ --ignore-not-found

helm uninstall grafana -n monitoring || true
helm uninstall promtail -n monitoring || true
helm uninstall loki -n monitoring || true
helm uninstall prometheus -n monitoring || true
helm uninstall redis -n default || true

kubectl delete deployment --all -n monitoring --ignore-not-found
kubectl delete statefulset --all -n monitoring --ignore-not-found
kubectl delete daemonset --all -n monitoring --ignore-not-found
kubectl delete service --all -n monitoring --ignore-not-found

kubectl delete deployment --all -n default --ignore-not-found
kubectl delete statefulset --all -n default --ignore-not-found
kubectl delete daemonset --all -n default --ignore-not-found
kubectl delete service --all -n default --ignore-not-found

kubectl delete pod --all -n monitoring --ignore-not-found
kubectl delete pod --all -n default --ignore-not-found