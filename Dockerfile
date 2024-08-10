# Use a base image with Node.js and a slim Linux distribution
FROM node:18-alpine

RUN apk --no-cache add \
    bash \
    g++ \
    ca-certificates \
    lz4-dev \
    musl-dev \
    cyrus-sasl-dev \
    openssl-dev \
    make \
    python3
RUN apk add --no-cache --virtual .build-deps gcc zlib-dev libc-dev bsd-compat-headers py-setuptools
#install bash

RUN apk add --no-cache --upgrade bash

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install -- production

# Copy the application code to the working directory
COPY . .

# Expose the port that the application will run on
EXPOSE 80

RUN npm run build

# Command to run the application

CMD ["npm","run", "start"]