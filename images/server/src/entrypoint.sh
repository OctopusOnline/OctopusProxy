#!/bin/bash

if [ -n "$DATABASE_URL" ]; then
  export PRISMA_DATABASE_URL=${DATABASE_URL/mariadb:/mysql:}
fi

echo "Generating prisma client..."
npm run prisma:generate --prefix ./node_modules/@octopusproxy/server > /dev/null

echo "Running database migrations..."
npm run prisma:migrate --prefix ./node_modules/@octopusproxy/server

exec node index.js