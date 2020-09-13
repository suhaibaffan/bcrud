# A dockerfile that includes devDependencies.

FROM node:13.12.0-alpine

RUN apk add --no-cache git && \
    mkdir -p /app

WORKDIR /app

COPY package.json ./package.json
COPY yarn.lock ./

RUN yarn --frozen-lockfile

COPY . ./

EXPOSE 3000

RUN yarn

CMD ["yarn", "start"]
