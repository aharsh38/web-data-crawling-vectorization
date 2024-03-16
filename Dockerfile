FROM node:20.10.0 as builder

WORKDIR /app

COPY . .

ARG ENV
ENV ENV ${ENV}

ARG PORT
ENV PORT ${PORT}


ARG MONGO_PROTOCOL
ENV MONGO_PROTOCOL ${MONGO_PROTOCOL}


ARG MONGO_HOST
ENV MONGO_HOST ${MONGO_HOST}


ARG MONGO_PORT
ENV MONGO_PORT ${MONGO_PORT}


ARG MONGO_DBNAME
ENV MONGO_DBNAME ${MONGO_DBNAME}


ARG MONGO_APP_NAME
ENV MONGO_APP_NAME ${MONGO_APP_NAME}


ARG MONGO_USERNAME
ENV MONGO_USERNAME ${MONGO_USERNAME}


ARG MONGO_PASSWORD
ENV MONGO_PASSWORD ${MONGO_PASSWORD}



RUN npm install --frozen-lockfile

RUN npm build

RUN groupadd -r tillnonroot && useradd -r -g tillnonroot tillnonroot

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

ENTRYPOINT ["/tini", "--"]

CMD ["npm", "start"]