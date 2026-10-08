#!/bin/bash

# Create a completely new Docker container with explicit path handling
echo "Creating a fixed backend container with explicit working directory structure..."

# First, let's check the exact output of the TypeScript compilation
echo "=== Checking TypeScript compilation output ==="
npm run build:server

# Now let's examine what files are created
echo "=== Files in dist directory ==="
ls -la dist/

# Create a completely new Docker image with explicit structure
echo "=== Creating new Docker image with fixed structure ==="

# Create a Dockerfile that explicitly handles the structure for testing
cat > FinalDockerfile << 'EOF'
FROM node:18

# Create a directory structure matching the expected output
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the server (this is what the container should be using)
RUN npm run build:server

# Verify the expected output exists
RUN ls -la dist/ && echo "=====" && ls -la dist/server/

# Make sure it runs correctly
EXPOSE 3000

# Explicit node path to the correct server.js location
CMD ["node", "dist/server/server.js"]
EOF

# Build with fresh container
docker build -f FinalDockerfile -t cs2-backend-final:latest .

echo "=== Test build completed ==="
echo "Running final container test..."
docker run --rm -p 3000:3000 cs2-backend-final:latest