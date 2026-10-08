#!/usr/bin/env node

const http = require('http');
const https = require('https');
const url = require('url');

// Check if the server is responsive by making a simple request
const checkHealth = () => {
  const host = process.env.HEALTH_CHECK_HOST || 'localhost';
  const port = process.env.HEALTH_CHECK_PORT || 3000;
  
  const options = {
    hostname: host,
    port: port,
    path: '/health',
    method: 'GET',
    timeout: 2000
  };
  
  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    res.on('data', (chunk) => {});
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('Health check passed');
        process.exit(0);
      } else {
        console.log('Health check failed');
        process.exit(1);
      }
    });
  });
  
  req.on('error', (e) => {
    console.error(`Health check error: ${e.message}`);
    process.exit(1);
  });
  
  req.on('timeout', () => {
    console.error('Health check timeout');
    req.destroy();
    process.exit(1);
  });
  
  req.setTimeout(2000);
  req.end();
};

checkHealth();