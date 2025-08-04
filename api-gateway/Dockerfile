# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies
FROM base AS install
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile

# Development dependencies
FROM install AS install-with-dev
RUN bun install --frozen-lockfile --dev

# Copy source code
FROM base AS prerelease
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .

# Build the application
FROM prerelease AS build
RUN bun run build

# Development target
FROM base AS dev
COPY --from=install-with-dev /usr/src/app/node_modules ./node_modules
COPY . .
RUN chown -R bun:bun /usr/src/app
USER bun
EXPOSE 8080
ENTRYPOINT ["bun", "run", "dev"]

# Production runtime target
FROM base AS runtime
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .

# Create non-root user for security
RUN chown -R bun:bun /usr/src/app
USER bun

# Expose API Gateway port
EXPOSE 8080

# Run the API Gateway
ENTRYPOINT ["bun", "run", "start"]