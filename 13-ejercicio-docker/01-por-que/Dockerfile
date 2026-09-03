FROM node:16-alpine

WORKDIR /app

COPY package-lock.json .
COPY package.json .

RUN npm ci

COPY app.js .

USER node

CMD ["node", "app.js"]