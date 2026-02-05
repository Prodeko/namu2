FROM node:22
WORKDIR /namu
RUN apt-get update && apt-get install git lsof -y 
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install