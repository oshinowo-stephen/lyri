FROM node:alpine AS docker_build

WORKDIR /usr/builds/lyri

COPY dist/src ./dist
COPY config ./config
COPY pnpm-lock.yaml package.json ./

RUN npm i -g npm pnpm
RUN pnpm install

FROM alpine:latest

WORKDIR /usr/apps/lyri

COPY --from=docker_build /usr/builds/lyri/ /usr/apps/lyri/

RUN apk add --update nodejs

CMD [ "node", "./dist/index.js" ]
