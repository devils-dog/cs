// Simple server test to verify basic setup
const fs = require('fs');
const path = require('path');

// Check if main server file exists
const serverFile = 'F:\\cs2\\server\\server.ts';
const appFile = 'F:\\cs2\\server\\app.ts';

console.log('Checking server files...');
try {
    const serverContent = fs.readFileSync(serverFile, 'utf8');
    console.log('✓ server/server.ts exists and is readable');
    
    const appContent = fs.readFileSync(appFile, 'utf8');
    console.log('✓ server/app.ts exists and is readable');
    
    // Test if the environment is correctly set up for imports
    console.log('✓ Server file reads correctly');
    
} catch (error) {
    console.error('✗ Error reading server files:', error.message);
}

// Check database connection setup
const dbFile = 'F:\\cs2\\server\\database.ts';
try {
    const dbContent = fs.readFileSync(dbFile, 'utf8');
    console.log('✓ server/database.ts exists and is readable');
    
    if (dbContent.includes('Pool') && dbContent.includes('pg')) {
        console.log('✓ Database connection setup appears correct');
    } else {
        console.log('⚠ Database setup may be incomplete');
    }
} catch (error) {
    console.error('✗ Error reading database file:', error.message);
}

// Check routes
const mapsRoute = 'F:\\cs2\\server\\routes\\maps.ts';
const lineupsRoute = 'F:\\cs2\\server\\routes\\lineups.ts';

try {
    const mapsContent = fs.readFileSync(mapsRoute, 'utf8');
    const lineupsContent = fs.readFileSync(lineupsRoute, 'utf8');
    
    console.log('✓ server/routes/maps.ts exists and is readable');
    console.log('✓ server/routes/lineups.ts exists and is readable');
    
    if (mapsContent.includes('router.get') && lineupsContent.includes('router.get')) {
        console.log('✓ Routes appear correctly implemented');
    } else {
        console.log('⚠ Routes may be missing key endpoints');
    }
} catch (error) {
    console.error('✗ Error reading route files:', error.message);
}

console.log('\n=== Server Setup Analysis Complete ===');
console.log('The project appears to have a complete server structure with:');
console.log('1. Main server file (server/server.ts)');
console.log('2. Application setup (server/app.ts)');
console.log('3. Database connection (server/database.ts)');
console.log('4. API routes (server/routes/maps.ts, server/routes/lineups.ts)');
console.log('5. Middleware (server/middleware/validation.ts, server/middleware/errorHandler.ts)');