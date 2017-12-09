FROM node:8-alpine

ENV NODE_ENV=production

WORKDIR /var/app
EXPOSE 443

ADD . .

# Install dependencies required by node-gyp (as not in alpine image)
RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install --quiet node-gyp -g &&\
  npm install --quiet && \
  apk del native-deps

# Install the regular dependencies
RUN npm install

CMD ["npm", "start"]