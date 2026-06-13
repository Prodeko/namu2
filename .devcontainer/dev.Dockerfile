FROM node:22
WORKDIR /namu
RUN apt-get update && apt-get install git lsof -y 
RUN npm install -g pnpm@11.6.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
RUN pnpm install