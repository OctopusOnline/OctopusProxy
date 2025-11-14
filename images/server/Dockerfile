FROM node:20.19-slim

WORKDIR /home/node

ENV SERVER=true \
    SERVER_PORT=8283 \
    SCRAPER=false \
    SCRAPER_FETCH_INTERVAL=900000

USER root
RUN apt update \
 && apt install -y openssl \
 && apt autoremove -y \
 && apt clean \
 && rm -rf /var/lib/apt/lists/*

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