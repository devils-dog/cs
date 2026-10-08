const fs = require('fs');
const path = require('path');

// Check if the file exists
const filePath = path.join(__dirname, 'dist', 'server', 'server.js');
console.log('Looking for file at:', filePath);
console.log('File exists:', fs.existsSync(filePath));

try {
  // Try to require the module
  console.log('Attempting to require...');
  const module = require(filePath);
  console.log('Module loaded successfully:', module);
} catch (error) {
  console.error('Error loading module:', error.message);
}