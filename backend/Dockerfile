# docker build -t react_backend .
# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install

COPY . .
CMD ["npm", "run", "serve"]