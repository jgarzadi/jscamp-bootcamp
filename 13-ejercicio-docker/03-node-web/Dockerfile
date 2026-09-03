FROM node:22-alpine

WORKDIR /app

COPY package-lock.json .
COPY package.json .

RUN npm ci

COPY . .

EXPOSE 3000

USER node

CMD ["node", "server.js"]