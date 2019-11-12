FROM node:10-alpine
# install compile  time dependencies for  node-gyp
RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers autoconf automake make cmake nasm git


# Installs latest python
RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
    python


# Add user
RUN addgroup -S alpine && adduser -S -g alpine alpine \
    && chown -R alpine:alpine /home/alpine\
    && mkdir -p /home/alpine/app \
    && chown -R alpine:alpine /home/alpine/app

# Run everything after as non-privileged user.
USER alpine

WORKDIR /home/alpine/app

# install dependency
ADD package.json .
RUN npm install
