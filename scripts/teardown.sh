echo "Killing all kubectl port-forward processes..."

if command -v pkill >/dev/null 2>&1; then
  pkill -f "kubectl port-forward" || true
elif command -v taskkill >/dev/null 2>&1; then
  # For Windows
  taskkill //IM kubectl.exe //F >/dev/null 2>&1 || true
else
  # Fallback for Unix-like systems without pkill
  ps aux | grep 'kubectl port-forward' | grep -v grep | awk '{print $2}' | xargs -r kill || true
fi

sleep 2

kubectl delete -f deploy/k8s/ --ignore-not-found &

# Uninstall Helm releases in parallel
helm uninstall grafana -n monitoring || true &
helm uninstall promtail -n monitoring || true &
helm uninstall loki -n monitoring || true &
helm uninstall prometheus -n monitoring || true &
helm uninstall redis -n default || true &

wait

# Delete resources in parallel per namespace
kubectl delete deployment --all -n monitoring --ignore-not-found &
kubectl delete statefulset --all -n monitoring --ignore-not-found &
kubectl delete daemonset --all -n monitoring --ignore-not-found &
kubectl delete service --all -n monitoring --ignore-not-found &

kubectl delete deployment --all -n default --ignore-not-found &
kubectl delete statefulset --all -n default --ignore-not-found &
kubectl delete daemonset --all -n default --ignore-not-found &
kubectl delete service --all -n default --ignore-not-found &

wait

kubectl delete pod --all -n monitoring --ignore-not-found &
kubectl delete pod --all -n default --ignore-not-found &

wait