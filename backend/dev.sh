docker build -t jgp-backend-dev -f Dockerfile --target dev .
docker run --env-file .env.local -it --rm -p 8000:8000 jgp-backend-dev