FROM python:3.13.0-slim as base

WORKDIR /app

COPY requirements.txt .

COPY requirements-dev.txt .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r requirements-dev.txt

COPY . .

FROM base as test
CMD ["python", "-m", "pytest", "tests/", "-v"]

FROM base as runtime
EXPOSE 8001
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001"]