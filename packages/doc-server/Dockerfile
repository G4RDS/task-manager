FROM oven/bun:1.0.20-slim AS base
RUN apt-get update && apt-get install -y ca-certificates

WORKDIR /usr/src/app
COPY . .

WORKDIR /usr/src/app/packages/doc-server
RUN bun install

# Run prisma generate in Node.js environment
FROM node:20.10.0-bullseye-slim AS prisma
COPY --from=base /usr/src/app /usr/src/app
WORKDIR /usr/src/app/packages/database
RUN npx prisma generate

FROM base AS build

COPY --from=prisma /usr/src/app/node_modules/.prisma /usr/src/app/node_modules/.prisma

USER bun
EXPOSE 8080/tcp
ENV PORT=8080
ENTRYPOINT [ "bun", "run", "start" ]
