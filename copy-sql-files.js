const fs = require('fs');
const path = require('path');

// Create dist/db directory if it doesn't exist
const distDbPath = path.join('dist', 'db');
if (!fs.existsSync(distDbPath)) {
  fs.mkdirSync(distDbPath, { recursive: true });
}

// Copy migration files
const migrationsSrc = path.join('server', 'db', 'migrations');
const migrationsDst = path.join('dist', 'db', 'migrations');
if (fs.existsSync(migrationsSrc)) {
  fs.cpSync(migrationsSrc, migrationsDst, { recursive: true });
}

// Copy seed files  
const seedsSrc = path.join('server', 'db', 'seed');
const seedsDst = path.join('dist', 'db', 'seed');
if (fs.existsSync(seedsSrc)) {
  fs.cpSync(seedsSrc, seedsDst, { recursive: true });
}

console.log("SQL files copied to dist directory");