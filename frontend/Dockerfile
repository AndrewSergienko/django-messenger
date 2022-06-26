FROM node:14-alpine
WORKDIR /app/frontend

COPY package.json ./
RUN npm config set legacy-peer-deps true
RUN npm install --network=host
RUN npm install react-scripts@5.0.0 -g --network=host

COPY src src
COPY . ./
EXPOSE 3000