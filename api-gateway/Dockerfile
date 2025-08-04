# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Development stage
FROM base as dev
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Runtime stage  
FROM base as runtime
RUN bun install --frozen-lockfile --production
COPY . .
EXPOSE 8080
CMD ["bun", "run", "start"]