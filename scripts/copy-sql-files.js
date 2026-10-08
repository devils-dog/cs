const fs = require('fs');
const path = require('path');

// Define source and destination directories
const sourceDir = path.join(__dirname, '../server/db');
const destDir = path.join(__dirname, '../dist/db');

// Ensure destination directory exists
fs.mkdirSync(destDir, { recursive: true });

// Copy migrations directory
const migrationsSrc = path.join(sourceDir, 'migrations');
const migrationsDest = path.join(destDir, 'migrations');
if (fs.existsSync(migrationsSrc)) {
  fs.cpSync(migrationsSrc, migrationsDest, { recursive: true });
  console.log('Migrations copied successfully');
}

// Copy seeds directory
const seedsSrc = path.join(sourceDir, 'seeds');
const seedsDest = path.join(destDir, 'seeds');
if (fs.existsSync(seedsSrc)) {
  fs.cpSync(seedsSrc, seedsDest, { recursive: true });
  console.log('Seeds copied successfully');
}

console.log('SQL files copied successfully');