FROM node:18.7-slim

WORKDIR /home/node

ENV DEBUG=false \
    SCRAPER=true \
    SERVER=true \
    SERVER_PORT=8283

COPY src/package*.json ./
RUN npm ci --no-update-notifier

COPY src/ ./
RUN chmod +x ./entrypoint.sh \
 && node node_modules/@octopusproxy/server/scripts/prismaGenerate.js

ENTRYPOINT ["./entrypoint.sh"]