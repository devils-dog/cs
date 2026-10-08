#!/usr/bin/env node

// Test API endpoints to verify functionality
const http = require('http');
const https = require('https');

// Create a simple HTTP server test for the API
function testEndpoint(method, path, expectedStatus, description) {
  return new Promise((resolve) => {
    const options = {
      host: 'localhost',
      port: 3000,
      path: path,
      method: method,
      timeout: 2000
    };

    const request = http.request(options, (res) => {
      console.log(`${description}: ${res.statusCode}`);
      if (res.statusCode === expectedStatus) {
        console.log(`✓ ${description} - PASSED`);
      } else {
        console.log(`✗ ${description} - FAILED (expected ${expectedStatus}, got ${res.statusCode})`);
      }
      resolve(res.statusCode);
    });

    request.on('error', (err) => {
      console.log(`✗ ${description} - ERROR: ${err.message}`);
      resolve(0);
    });

    request.setTimeout(2000, () => {
      console.log(`✗ ${description} - TIMEOUT`);
      resolve(0);
    });

    request.end();
  });
}

async function runTests() {
  console.log('Testing API endpoints...\n');
  
  // Test endpoints that should return 200
  try {
    await testEndpoint('GET', '/health', 200, 'GET /health');
    await testEndpoint('GET', '/api/maps', 200, 'GET /api/maps');
    await testEndpoint('GET', '/api/maps/mirage', 200, 'GET /api/maps/mirage');
    await testEndpoint('GET', '/api/maps/mirage/lineups', 200, 'GET /api/maps/mirage/lineups');
    await testEndpoint('GET', '/api/lineups/mirage-smoke-1', 200, 'GET /api/lineups/mirage-smoke-1');
    
    // Test endpoints that should return 404
    await testEndpoint('GET', '/api/maps/not-existing-map', 404, 'GET /api/maps/not-existing-map');
    await testEndpoint('GET', '/api/lineups/not-existing-id', 404, 'GET /api/lineups/not-existing-id');
    
  } catch (error) {
    console.error('Test error:', error);
  }
  
  console.log('\nTest completed.');
}

runTests();