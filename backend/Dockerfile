FROM python:3.10-slim as base

WORKDIR /app

RUN useradd -m appuser
USER appuser

# Install Poetry as appuser (in user space)
RUN pip install --user poetry
ENV PATH="/home/appuser/.local/bin:${PATH}"

COPY --chown=appuser:appuser . .

# Development image
FROM base as development

WORKDIR /app
ENV PYTHONPATH=/app/src

RUN poetry install --no-root

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "jpg_backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Test image
FROM base as test

WORKDIR /app

ENV PYTHONPATH=/app/src

RUN poetry install --no-root --with dev

CMD ["poetry", "run", "pytest", "tests/"]

# Production image
FROM base as production

WORKDIR /app

ENV PYTHONPATH=/app/src

RUN poetry install --no-root --only main

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "jpg_backend.main:app", "--host", "0.0.0.0", "--port", "8000"]