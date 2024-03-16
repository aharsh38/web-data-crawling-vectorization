FROM node:20.10.0 as builder

WORKDIR /app

COPY . .

ARG NPM_TOKEN
ENV NPM_TOKEN ${NPM_TOKEN}

RUN npm install --frozen-lockfile

RUN npm build

FROM node:18.18.0

WORKDIR /app
RUN groupadd -r tillnonroot && useradd -r -g tillnonroot tillnonroot

ARG NPM_TOKEN
ENV NPM_TOKEN ${NPM_TOKEN}

ARG ENV
ENV ENV ${ENV}

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

ENTRYPOINT ["/tini", "--"]

CMD ["npm", "start"]