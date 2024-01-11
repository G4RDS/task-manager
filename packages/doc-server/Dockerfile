FROM node:20.10.0-bullseye-slim  AS base
RUN apt-get update && apt-get install -y ca-certificates

WORKDIR /usr/src/app
COPY . .

WORKDIR /usr/src/app/packages/doc-server
RUN npm ci

# Build
FROM node:20.10.0-bullseye-slim AS build
COPY --from=base /usr/src/app /usr/src/app

WORKDIR /usr/src/app/packages/database
RUN npx prisma generate

WORKDIR /usr/src/app/packages/doc-server
RUN npm run build

# App
FROM node:20.10.0-bullseye-slim AS app
COPY --from=build /usr/src/app/packages/doc-server/dist /usr/src/app
WORKDIR /usr/src/app

USER node
EXPOSE 8080/tcp
ENV PORT=8080
ENTRYPOINT [ "node", "index.cjs" ]
