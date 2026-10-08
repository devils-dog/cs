const http = require('http');
const https = require('https');

// Check if the backend is healthy by making a request to the health endpoint
const options = {
  host: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET',
  timeout: 2000
};

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.log('ERROR');
  process.exit(1);
});

request.setTimeout(2000, () => {
  console.log('TIMEOUT');
  process.exit(1);
});

request.end();