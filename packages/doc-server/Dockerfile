FROM node:20.10.0-bullseye-slim  AS base
RUN apt-get update && apt-get install -y ca-certificates

WORKDIR /usr/src/app
COPY . .

WORKDIR /usr/src/app
RUN npm ci -w doc-server
RUN npm run build:prod -w doc-server

WORKDIR /usr/src/app

USER node
EXPOSE 8080/tcp
ENV PORT=8080
ENTRYPOINT [ "npm", "run", "start", "-w", "doc-server" ]
