# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS install
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile

FROM install AS dev
# Copy all source files for development/testing
COPY . .
# Install dev dependencies if you have any
RUN bun install --frozen-lockfile
EXPOSE 3000
USER bun
# Default command for development
CMD ["bun", "run", "dev"]

FROM base AS build
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM base AS runtime
COPY --from=build /usr/src/app/dist ./dist
COPY package.json ./
RUN bun add serve
EXPOSE 3000
USER bun
CMD ["bunx", "serve", "-s", "dist", "-p", "3000"]