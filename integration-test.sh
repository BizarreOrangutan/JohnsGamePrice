#!/bin/bash
set -e

echo "🧪 Testing API Endpoints"
echo "========================"

# Test price-fetcher health
echo "Testing price-fetcher health..."
if curl -f -s http://localhost:8000/health > /dev/null; then
  echo "✅ Price fetcher health check passed"
else
  echo "❌ Price fetcher health check failed"
  curl -v http://localhost:8000/health || true
  exit 1
fi

# Test api-gateway health
echo "Testing api-gateway health..."
if curl -f -s http://localhost:8080/health > /dev/null; then
  echo "✅ API gateway health check passed"
else
  echo "❌ API gateway health check failed"
  curl -v http://localhost:8080/health || true
  exit 1
fi

# Test price-fetcher game search endpoint
echo "Testing price-fetcher game search..."
if curl -f -s "http://localhost:8000/game-ids?title=test" > /dev/null; then
  echo "✅ Price fetcher game search passed"
else
  echo "ℹ️  Price fetcher game search failed (expected with test API key)"
fi

# Test api-gateway games search endpoint
echo "Testing api-gateway games search endpoint..."
if curl -f -s "http://localhost:8080/api/games/search?query=test" > /dev/null; then
  echo "✅ Games search endpoint passed"
else
  echo "❌ Games search endpoint failed"
  exit 1
fi

# Test api-gateway games search endpoint with result_num
echo "Testing api-gateway games search endpoint with result_num..."
if curl -f -s "http://localhost:8080/api/games/search?query=test&result_num=15" > /dev/null; then
  echo "✅ Games search endpoint with result_num passed"
else
  echo "❌ Games search endpoint with result_num failed"
  exit 1
fi

# Test price endpoint with mock data
echo "Testing price endpoint..."
if curl -f -s "http://localhost:8000/prices?id=test-game-id" > /dev/null; then
  echo "✅ Price endpoint responded"
else
  echo "ℹ️  Price endpoint failed (expected with test API key)"
fi

echo "🎉 All endpoint tests completed!"