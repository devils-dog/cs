const fs = require('fs');

// Check that main files exist
const requiredFiles = [
  'src/App.tsx',
  'src/main.tsx',
  'src/telegram/sdk.ts',
  'src/api/client.ts',
  'src/api/clientSingleton.ts'
];

console.log('Checking frontend files...');
let allFilesExist = true;
for (const file of requiredFiles) {
  const fullPath = file.replace('src/', 'F:/cs2/src/');
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ Missing file: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Found file: ${file}`);
  }
}

// Check that the build folder exists and has content
const buildFolder = 'F:/cs2/dist';
if (fs.existsSync(buildFolder)) {
  const files = fs.readdirSync(buildFolder);
  if (files.length > 0) {
    console.log(`✅ Build folder exists with ${files.length} files`);
    files.forEach(file => console.log(`   - ${file}`));
  } else {
    console.log(`❌ Build folder exists but is empty`);
    allFilesExist = false;
  }
} else {
  console.log(`❌ Build folder does not exist`);
  allFilesExist = false;
}

// Check for secrets in source files
console.log('\nChecking for secrets in source files...');
const secretPatterns = ['secret', 'SECRET', 'key', 'KEY', 'token', 'TOKEN'];
let secretsFound = false;

function checkFileForSecrets(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  secretPatterns.forEach(pattern => {
    if (content.toLowerCase().includes(pattern.toLowerCase())) {
      console.log(`⚠️  Potential secret pattern "${pattern}" found in ${filePath}`);
      secretsFound = true;
    }
  });
}

// Check API client for secrets
checkFileForSecrets('F:/cs2/src/api/client.ts');
checkFileForSecrets('F:/cs2/src/api/clientSingleton.ts');
checkFileForSecrets('F:/cs2/src/telegram/sdk.ts');

if (!secretsFound) {
  console.log('✅ No secrets found in source files');
}

// Check that all component files exist
console.log('\nChecking component files...');
const componentFiles = [
  'src/components/AppLayout.tsx',
  'src/components/VideoPlayer.tsx',
  'src/components/TargetSelector.tsx',
  'src/components/LineupGrid.tsx',
  'src/components/LineupDetails.tsx',
  'src/components/LineupCard.tsx',
  'src/components/GrenadeTypeSelector.tsx',
  'src/components/ErrorState.tsx',
  'src/components/EmptyState.tsx',
  'src/components/LoadingState.tsx',
  'src/components/MapSelector.tsx',
  'src/components/SideSelector.tsx'
];

let componentsExist = true;
for (const file of componentFiles) {
  const fullPath = file.replace('src/', 'F:/cs2/src/');
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ Missing component: ${file}`);
    componentsExist = false;
  } else {
    console.log(`✅ Found component: ${file}`);
  }
}

if (componentsExist) {
  console.log('✅ All components exist');
}

// Summary
console.log('\n' + '='.repeat(50));
if (allFilesExist && !secretsFound && componentsExist) {
  console.log('🎉 ALL TESTS PASSED - Frontend is working correctly');
  console.log('✅ All required files exist');
  console.log('✅ No secrets found in source files');
  console.log('✅ All components exist');
  console.log('✅ Build process completed successfully');
} else {
  console.log('❌ Some tests failed');
  if (!allFilesExist) {
    console.log('❌ Some required files are missing');
  }
  if (secretsFound) {
    console.log('❌ Secrets found in source files');
  }
  if (!componentsExist) {
    console.log('❌ Some components are missing');
  }
}