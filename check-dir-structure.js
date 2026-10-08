const fs = require('fs');
const path = require('path');

// Create a simple test to check the directory structure
console.log('Checking directory structure in server/db');

const dbPath = path.join('F:', 'cs2', 'server', 'db');
const seedDir = path.join(dbPath, 'seed');
const seedsDir = path.join(dbPath, 'seeds');

console.log('DB path exists:', fs.existsSync(dbPath));
console.log('Seed directory exists:', fs.existsSync(seedDir));
console.log('Seeds directory exists:', fs.existsSync(seedsDir));

if (fs.existsSync(seedDir)) {
  console.log('Seed directory contents:');
  const seedContents = fs.readdirSync(seedDir);
  seedContents.forEach(item => console.log('  ' + item));
}

if (fs.existsSync(seedsDir)) {
  console.log('Seeds directory contents:');
  const seedsContents = fs.readdirSync(seedsDir);
  seedsContents.forEach(item => console.log('  ' + item));
}

// Check what's in the dist directory
const distPath = path.join('F:', 'cs2', 'dist', 'db');
console.log('Dist db path exists:', fs.existsSync(distPath));
if (fs.existsSync(distPath)) {
  console.log('Dist db contents:');
  const distContents = fs.readdirSync(distPath);
  distContents.forEach(item => console.log('  ' + item));
}