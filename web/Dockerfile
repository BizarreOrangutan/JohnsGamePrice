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

# Build the application with API URL
FROM prerelease AS build
# Set API URL for production build
ENV VITE_API_URL=""
RUN bun run build

# Development target
FROM base AS dev
COPY --from=install-with-dev /usr/src/app/node_modules ./node_modules
COPY . .
RUN chown -R bun:bun /usr/src/app/node_modules
USER bun
# Use environment variable for port (defaults to 3000)
ENTRYPOINT ["sh", "-c", "bun run dockerdev --host 0.0.0.0 --port ${PORT:-3000}"]

# Production runtime target
FROM base AS runtime
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package.json ./

# Create non-root user for security
RUN chown -R bun:bun /usr/src/app
USER bun

# Use environment variable for port (defaults to 3000)
ENTRYPOINT ["sh", "-c", "bun run start --host 0.0.0.0 --port ${PORT:-3000}"]