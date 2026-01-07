FROM python:3.11-slim as base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY ./src ./src

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install dev dependencies
FROM base as dev
COPY requirements-dev.txt .
RUN pip install --no-cache-dir -r requirements-dev.txt
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Setup testing environment
FROM base as test
COPY requirements-dev.txt .
RUN pip install --no-cache-dir -r requirements-dev.txt
COPY ./tests ./tests
CMD ["python", "-m", "pytest", "tests/", "-v"]