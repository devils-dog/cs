const fs = require('fs');
const path = require('path');

const copyDirectory = (source, destination) => {
  if (!fs.existsSync(source)) {
    throw new Error(`Required SQL directory does not exist: ${source}`);
  }

  fs.cpSync(source, destination, { recursive: true });
};

const distDbPath = path.join('dist', 'db');
const migrationsSrc = path.join('server', 'db', 'migrations');
const migrationsDst = path.join(distDbPath, 'migrations');
const seedsSrc = path.join('server', 'db', 'seeds');
const seedsDst = path.join(distDbPath, 'seeds');

fs.mkdirSync(distDbPath, { recursive: true });
copyDirectory(migrationsSrc, migrationsDst);
copyDirectory(seedsSrc, seedsDst);

console.log('SQL migrations and seeds copied to dist/db');
