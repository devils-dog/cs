#!/bin/bash
echo "Starting CS2 Nades Telegram Mini App..."

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
if ! pg_isready -U postgres -d cs2_nades; then
    echo "PostgreSQL is not running. Please start PostgreSQL service."
    exit 1
fi

# Check if database exists
echo "Checking database..."
if ! psql -U postgres -d cs2_nades -c "SELECT 1;" > /dev/null 2>&1; then
    echo "Database cs2_nades does not exist. Please create it."
    exit 1
fi

echo "Starting server..."
npx ts-node server/server.ts