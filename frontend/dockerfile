FROM oven/bun:latest as build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . ./

RUN bun run build 


FROM oven/bun:latest as development

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . ./

EXPOSE 3000

CMD ["bun", "run", "start"]


FROM nginx:alpine as production

WORKDIR /app

ARG VITE_API_URL

ENV VITE_API_URL=${VITE_API_URL}

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
