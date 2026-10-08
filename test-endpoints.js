const http = require('http');

// Test API endpoints
const baseUrl = 'http://localhost:3000';

// Function to make requests
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    req.end();
  });
}

async function testEndpoints() {
  console.log('Testing API endpoints...');
  
  try {
    // Test /api/maps
    console.log('1. Testing /api/maps');
    const mapsResponse = await makeRequest('/api/maps');
    console.log(`   Status: ${mapsResponse.statusCode}`);
    console.log(`   Body: ${mapsResponse.body.substring(0, 100)}...`);
    
    // Test /api/maps/1
    console.log('2. Testing /api/maps/1');
    const map1Response = await makeRequest('/api/maps/1');
    console.log(`   Status: ${map1Response.statusCode}`);
    console.log(`   Body: ${map1Response.body.substring(0, 100)}...`);
    
    // Test /api/maps/1/lineups
    console.log('3. Testing /api/maps/1/lineups');
    const lineupsResponse = await makeRequest('/api/maps/1/lineups');
    console.log(`   Status: ${lineupsResponse.statusCode}`);
    console.log(`   Body: ${lineupsResponse.body.substring(0, 100)}...`);
    
    // Test /api/lineups/1
    console.log('4. Testing /api/lineups/1');
    const lineupResponse = await makeRequest('/api/lineups/1');
    console.log(`   Status: ${lineupResponse.statusCode}`);
    console.log(`   Body: ${lineupResponse.body.substring(0, 100)}...`);
    
    console.log('All endpoints tested successfully!');
    
  } catch (error) {
    console.error('Error testing endpoints:', error);
  }
}

testEndpoints();