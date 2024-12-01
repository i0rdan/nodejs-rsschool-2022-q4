FROM node:16-alpine 

EXPOSE ${PORT}

WORKDIR /app

COPY package*.json .

RUN npm install -f

COPY . .
