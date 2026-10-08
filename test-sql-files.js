const fs = require('fs');
const path = require('path');

// Check if dist directory exists
const distPath = './dist';
if (fs.existsSync(distPath)) {
    console.log('dist directory exists');
    
    // Check if db directory exists in dist
    const dbPath = path.join(distPath, 'db');
    if (fs.existsSync(dbPath)) {
        console.log('db directory exists in dist');
        
        // Check if migrations directory exists
        const migrationsPath = path.join(dbPath, 'migrations');
        if (fs.existsSync(migrationsPath)) {
            console.log('migrations directory exists in dist/db');
            const migrationFiles = fs.readdirSync(migrationsPath);
            console.log('Migration files:', migrationFiles);
        } else {
            console.log('migrations directory does NOT exist in dist/db');
        }
        
        // Check if seed directory exists
        const seedPath = path.join(dbPath, 'seed');
        if (fs.existsSync(seedPath)) {
            console.log('seed directory exists in dist/db');
            const seedFiles = fs.readdirSync(seedPath);
            console.log('Seed files:', seedFiles);
        } else {
            console.log('seed directory does NOT exist in dist/db');
        }
    } else {
        console.log('db directory does NOT exist in dist');
    }
} else {
    console.log('dist directory does NOT exist');
}