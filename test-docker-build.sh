#!/bin/bash
# Test Docker build with debug output

echo "=== Testing Docker Build ==="
# Build the backend container 
docker build -f Dockerfile.fixed -t cs2-backend-test .

echo "=== Creating test container ==="
# Create minimal test container to execute commands inside it
docker run -it --rm --entrypoint /bin/bash cs2-backend-test -c "
  echo '=== Current Working Directory ==='
  pwd

  echo '=== Files in dist/ ==='
  ls -la dist/

  echo '=== Files in dist/server/ ==='
  ls -la dist/server/

  echo '=== Checking server.js ==='
  if [ -f 'dist/server/server.js' ]; then
    echo 'server.js exists - good!'
    head -5 dist/server/server.js
  else
    echo 'ERROR: server.js does not exist!'
  fi

  echo '=== Running healthcheck ==='
  node scripts/healthcheck.js
"