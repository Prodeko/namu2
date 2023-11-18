FROM oven/bun:1.0.13
WORKDIR /namu
RUN apt-get update && apt-get install git -y
COPY package.json bun.lockb ./
RUN bun install