#!/bin/bash

echo "Waiting for PostgreSQL to be ready..."
sleep 20

npx prisma migrate deploy
npm run start