# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install all dependencies (including dev)
FROM base AS install
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile

# Copy all project files
FROM base AS prerelease
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .

# Final image to run the dev server
FROM base AS dev
COPY --from=prerelease /usr/src/app .

# Fix permissions so 'bun' user can write to node_modules if needed
RUN chown -R bun:bun /usr/src/app/node_modules

USER bun
EXPOSE 80
ENTRYPOINT ["bun", "run", "dockerdev"]