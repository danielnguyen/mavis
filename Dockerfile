FROM node:8-alpine

# Create app directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Install dependencies
COPY *.json ./
RUN npm install

# Copy over the app
COPY . ./

WORKDIR /usr/app/policies/proxy
RUN npm install
WORKDIR /usr/app

EXPOSE 3000

CMD [ "npm", "start" ]