#!/bin/bash
# Copy SQL files to dist directory during build process

# Create dist/db directory if it doesn't exist
mkdir -p dist/db

# Copy migration files
cp -r server/db/migrations dist/db/migrations

# Copy seed files  
cp -r server/db/seed dist/db/seed

echo "SQL files copied to dist directory"