### compilation stage
FROM node:latest AS build

RUN npm install -g pnpm@10.28.0

RUN mkdir /build
WORKDIR /build

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

### we will use polyfea/spa_base as the base image for our
### "BackEnd for (micro)FrontEnd" pattern
FROM ghcr.io/polyfea/spa-base

COPY --from=build /build/dist /spa/public

ENV OTEL_SERVICE_NAME=milung-ambulance-ufe
ENV SPA_BASE_PORT=8080
EXPOSE 8080
