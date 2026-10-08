// Simple test to validate API endpoints
const axios = require('axios');

async function testAPIEndpoints() {
  try {
    console.log('Testing API endpoints...');
    
    // Test GET /api/maps
    const mapsResponse = await axios.get('http://localhost:3000/api/maps');
    console.log('GET /api/maps - Status:', mapsResponse.status);
    console.log('GET /api/maps - Data length:', mapsResponse.data.length);
    
    // Test GET /api/maps/:id with first map
    if (mapsResponse.data.length > 0) {
      const firstMapId = mapsResponse.data[0].id;
      const mapResponse = await axios.get(`http://localhost:3000/api/maps/${firstMapId}`);
      console.log('GET /api/maps/:id - Status:', mapResponse.status);
      
      // Test GET /api/maps/:id/lineups 
      const lineupsResponse = await axios.get(`http://localhost:3000/api/maps/${firstMapId}/lineups`);
      console.log('GET /api/maps/:id/lineups - Status:', lineupsResponse.status);
      console.log('GET /api/maps/:id/lineups - Items count:', lineupsResponse.data.items.length);
      
      // Test GET /api/lineups/:id with first lineup
      if (lineupsResponse.data.items.length > 0) {
        const firstLineupId = lineupsResponse.data.items[0].id;
        const lineupResponse = await axios.get(`http://localhost:3000/api/lineups/${firstLineupId}`);
        console.log('GET /api/lineups/:id - Status:', lineupResponse.status);
      }
    }
    
    console.log('All API tests passed successfully!');
  } catch (error) {
    console.error('API test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testAPIEndpoints();