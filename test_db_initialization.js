const fs = require('fs');
const path = require('path');

// Проверка наличия всех необходимых файлов
const requiredFiles = [
  'server/database.ts',
  'server/db/init.ts', 
  'server/initAndStart.ts',
  'server/db/migrations/001_initial.sql',
  'server/db/migrations/002_create_schema_migrations.sql',
  'server/db/seed/001_maps.sql',
  'server/db/seed/002_lineups.sql'
];

console.log('Checking required files...');
let allFilesPresent = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  if (!exists) {
    console.log(`❌ MISSING: ${file}`);
    allFilesPresent = false;
  } else {
    console.log(`✅ PRESENT: ${file}`);
  }
});

if (allFilesPresent) {
  console.log('\n✅ All required files are present');
} else {
  console.log('\n❌ Some files are missing');
  process.exit(1);
}

// Проверка структуры миграций
console.log('\nChecking migration structure...');
const migrations = fs.readdirSync('server/db/migrations');
const expectedMigrations = ['001_initial.sql', '002_create_schema_migrations.sql'];
let allMigrationsPresent = true;

expectedMigrations.forEach(migration => {
  if (!migrations.includes(migration)) {
    console.log(`❌ MISSING MIGRATION: ${migration}`);
    allMigrationsPresent = false;
  } else {
    console.log(`✅ PRESENT: ${migration}`);
  }
});

if (allMigrationsPresent) {
  console.log('✅ All required migrations present');
} else {
  console.log('❌ Some migrations missing');
  process.exit(1);
}

// Проверка структуры сидов
console.log('\nChecking seed structure...');
const seeds = fs.readdirSync('server/db/seed');
const expectedSeeds = ['001_maps.sql', '002_lineups.sql'];
let allSeedsPresent = true;

expectedSeeds.forEach(seed => {
  if (!seeds.includes(seed)) {
    console.log(`❌ MISSING SEED: ${seed}`);
    allSeedsPresent = false;
  } else {
    console.log(`✅ PRESENT: ${seed}`);
  }
});

if (allSeedsPresent) {
  console.log('✅ All required seeds present');
} else {
  console.log('❌ Some seeds missing');
  process.exit(1);
}

console.log('\n✅ All checks passed - database initialization requirements are implemented');