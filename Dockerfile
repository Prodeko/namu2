FROM node:20-alpine as build-stage
WORKDIR /usr/src/app

ARG DATABASE_URL
ENV SKIP_ENV_VALIDATION=true

# Setup
RUN apk update && apk add openssh
RUN npm install -g pnpm

# Install node_modules
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

# Copy source code 
COPY . .

# Run prisma migrations
RUN pnpx prisma generate
RUN pnpx prisma migrate deploy

# Build
RUN pnpm build

CMD ["pnpm", "run", "start"]