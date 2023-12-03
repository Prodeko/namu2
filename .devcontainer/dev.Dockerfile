FROM oven/bun:1.0.13
WORKDIR /namu
RUN apt-get update && apt-get install git -y
COPY --from=node:18 /usr/local/bin/node /usr/local/bin/node
COPY package.json bun.lockb ./
RUN bun install