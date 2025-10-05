FROM node:20.19-slim

WORKDIR /home/node

ENV DEBUG=false \
    SCRAPER=true \
    SERVER=true \
    SERVER_PORT=8283

USER root
RUN apt update \
 && apt install -y openssl

USER node
COPY lerna.json package.json package-lock.json ./
COPY packages/server ./packages/server
COPY images/server/src/package*.json ./
RUN npm i --no-update-notifier

COPY images/server/src/ ./
USER root
RUN chmod +x ./entrypoint.sh

EXPOSE 8283

USER node
ENTRYPOINT ["./entrypoint.sh"]