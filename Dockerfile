FROM node:alpine

RUN mkdir -p /usr/src/playground-be && chown -R node:node /usr/src/playground-be

WORKDIR /usr/src/playground-be

COPY package.json ./

USER node

COPY --chown=node:node . .

EXPOSE 8080
