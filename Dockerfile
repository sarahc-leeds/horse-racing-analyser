FROM node:22.6-bookworm-slim

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app/server.js"]