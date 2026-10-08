const fs = require('fs');
const path = require('path');

// Check if dist directory exists and what's in it
const distPath = './dist';
if (fs.existsSync(distPath)) {
    console.log('dist directory exists');
    const files = fs.readdirSync(distPath);
    console.log('Files in dist:', files);
    
    // Check if server.js exists in dist
    const serverJsPath = path.join(distPath, 'server.js');
    if (fs.existsSync(serverJsPath)) {
        console.log('server.js exists in dist');
        const serverContent = fs.readFileSync(serverJsPath, 'utf8');
        console.log('server.js content:', serverContent.substring(0, 100) + '...');
    } else {
        console.log('server.js does NOT exist in dist');
    }
} else {
    console.log('dist directory does NOT exist');
}