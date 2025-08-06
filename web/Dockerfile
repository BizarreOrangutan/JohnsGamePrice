# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base as install
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile

FROM base as build
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM base as runtime
COPY --from=build /usr/src/app/dist ./dist
COPY package.json ./

# Install serve for serving static files
RUN bun add serve

EXPOSE 3000
USER bun

# Serve the built static files
CMD ["bunx", "serve", "-s", "dist", "-p", "3000"]