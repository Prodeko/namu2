FROM node:18-alpine as build-stage
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY . .
RUN apk update && apk add git openssh
RUN pnpm install
RUN pnpm build

FROM node:18-alpine as production-stage
WORKDIR /usr/src/app
COPY --from=build-stage /usr/src/app/package.json .
COPY --from=build-stage /usr/src/app/next.config.js ./
COPY --from=build-stage /usr/src/app/public ./standalone/
COPY --from=build-stage /usr/src/app/.next/standalone ./
COPY --from=build-stage /usr/src/app/.next/static ./.next/static
#COPY --from=build-stage /usr/src/app/.next/standlone/server.js .
CMD ["pnpm", "start"]