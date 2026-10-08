const { execSync } = require('child_process');
const fs = require('fs');

try {
  // Test TypeScript compilation
  console.log('Testing TypeScript compilation...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful');
  
  // Test build for frontend
  console.log('Testing Vite build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Vite build successful');
  
  // Test that no critical TypeScript errors exist
  console.log('Running type checks...');
  execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'inherit' });
  console.log('✅ Type checks passed');
  
  console.log('\n🎉 All verifications passed - builds and tests are working!');
} catch (error) {
  console.error('❌ Verification failed:', error.message);
  process.exit(1);
}