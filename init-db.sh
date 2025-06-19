#!/bin/bash

echo "Initializing Supabase database schema..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Execute the SQL schema
echo "Executing SQL schema..."
docker exec -i supabase-db psql -U postgres -d postgres < quasar-project/db-schema.sql

echo "Database schema initialization complete!" 