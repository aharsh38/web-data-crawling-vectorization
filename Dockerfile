FROM --platform=linux/x86_64 ubuntu:20.04

FROM node:20.10.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

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

ARG MONGO_SEARCH_INDEX_NAME
ENV MONGO_SEARCH_INDEX_NAME ${MONGO_SEARCH_INDEX_NAME}

ARG MONGO_SEARCH_TEXT_KEY
ENV MONGO_SEARCH_TEXT_KEY ${MONGO_SEARCH_TEXT_KEY}

ARG MONGO_SEARCH_ENBEDDING_KEY
ENV MONGO_SEARCH_ENBEDDING_KEY ${MONGO_SEARCH_ENBEDDING_KEY}

ARG COHERE_API_KEY
ENV COHERE_API_KEY ${COHERE_API_KEY}

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY ${OPENAI_API_KEY}

RUN npm install --frozen-lockfile

WORKDIR /app
RUN node node_modules/puppeteer/install.mjs

RUN npm run build

EXPOSE 3000

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

ENTRYPOINT ["/tini", "--"]

CMD ["npm", "run", "start:prod"]