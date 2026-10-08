@echo off
echo Starting development environment...

echo Building and starting containers...
docker-compose up --build

echo Environment started. Check logs for any errors.
pause