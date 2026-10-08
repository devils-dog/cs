// Simple script to validate that key files compile correctly
import * as ts from 'typescript';

// List of files to check
const filesToCheck = [
  'server/server.ts',
  'server/app.ts', 
  'server/database.ts',
  'server/routes/maps.ts',
  'server/routes/lineups.ts',
  'server/middleware/validation.ts',
  'server/middleware/errorHandler.ts'
];

console.log('Validating TypeScript compilation of key files...\n');

// Check each file
filesToCheck.forEach(file => {
  try {
    const filePath = `F:\\cs2\\${file}`;
    const content = require('fs').readFileSync(filePath, 'utf8');
    
    // Try to compile the file
    const result = ts.transpile(content, {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS
    });
    
    console.log(`✓ ${file} compiles successfully`);
    
  } catch (error) {
    console.error(`✗ Error compiling ${file}:`, error.message);
  }
});

console.log('\n=== Compilation Check Complete ===');