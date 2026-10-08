#!/bin/bash
# Test Docker build with debug output

# Build the backend container 
docker build -f Dockerfile.fixed -t cs2-backend-test .

# Create minimal test container to execute commands inside it
docker run -it --rm --entrypoint /bin/bash cs2-backend-test -c "
  echo '=== Current Working Directory ==='
  pwd

  echo '=== Files in dist/ ==='
  ls -la dist/

  echo '=== Package JSON scripts ==='
  cat package.json | grep -A 5 -B 5 \"start\"

  echo '=== Trying to run server ==='
  node dist/server/server.js 2>&1
"