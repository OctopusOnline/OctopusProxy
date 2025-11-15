FROM node:20.19-slim

ARG TZ="Europe/Berlin"

WORKDIR /home/node

ENV TZ=${TZ} \
    SERVER=true \
    SERVER_PORT=8283 \
    SCRAPER=false \
    SCRAPER_FETCH_INTERVAL=900000

USER node
COPY src/package*.json ./
RUN npm ci --no-update-notifier \
 && npm cache clean --force

COPY src/ ./
USER root
RUN chmod +x ./entrypoint.sh

EXPOSE ${SERVER_PORT}

USER node
ENTRYPOINT ["./entrypoint.sh"]