#!/bin/bash

echo "Starting development environment..."

# Build and start containers
docker-compose up --build

echo "Environment started. Check logs for any errors."