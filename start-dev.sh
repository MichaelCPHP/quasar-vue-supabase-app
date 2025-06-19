#!/bin/bash

# Start Supabase in Docker
echo "Starting Supabase in Docker..."
docker-compose up -d

# Wait for Supabase to initialize
echo "Waiting for Supabase to initialize..."
sleep 10

# Start Quasar development server
echo "Starting Quasar development server..."
cd quasar-project
npm run dev 