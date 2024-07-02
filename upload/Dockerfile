# app/upload/Dockerfile
FROM node:alpine

RUN mkdir -p /usr/src/upload/data && chown -R node:node /usr/src/upload

WORKDIR /usr/src/upload

COPY --chown=node:node package.json package-lock.json ./

USER node

RUN npm install

COPY --chown=node:node . .

