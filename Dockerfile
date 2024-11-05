FROM node:20-alpine as build-stage
WORKDIR /usr/src/app

# Setup
RUN apk update && apk add openssh
RUN npm install -g pnpm

# Install node_modules
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile
# Copy source code 
COPY . .

# The DATABASE_URL is needed in the build step to run
# prisma migrations. The CI pipeline has a temporary
# postgres service for this purpose.
ARG DATABASE_URL
# NEXT_PUBLIC environment variables cannot be provided
# at runtime, therefore they are inserted at build time.
ARG NEXT_PUBLIC_STRIPE_TESTMODE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_AZURE_BLOB_STORAGE_URL
ARG NEXT_PUBLIC_URL_PROD

ARG SKIP_ENV_VALIDATION

# Printing the build args makes debugging configs easier
RUN echo $DATABASE_URL
RUN echo $SKIP_ENV_VALIDATION
RUN echo $NEXT_PUBLIC_STRIPE_TESTMODE_PUBLISHABLE_KEY
RUN echo $NEXT_PUBLIC_AZURE_BLOB_STORAGE_URL
RUN echo $NEXT_PUBLIC_URL_PROD

# Run prisma migrations
RUN pnpx prisma generate
RUN pnpx prisma migrate deploy

# Build
RUN pnpm build

CMD ["sh", "/usr/src/app/startup.sh"]