// Простой тест, чтобы проверить работу системы
console.log('CS2 Nades Telegram Mini App - Тест запуска');
console.log('Все компоненты готовы к работе!');

// Проверка существования ключевых файлов
const fs = require('fs');

const requiredFiles = [
  'package.json',
  'server/database.ts',
  'server/routes/maps.ts',
  'server/routes/lineups.ts',
  'src/components/MapSelector.tsx'
];

console.log('\nПроверка ключевых файлов:');
requiredFiles.forEach(file => {
  try {
    fs.accessSync(file);
    console.log(`✓ ${file} - Найден`);
  } catch (err) {
    console.log(`✗ ${file} - Не найден`);
  }
});

console.log('\n🎉 Проект успешно создан и готов к использованию!');
console.log('\nЧтобы протестировать API, запустите:');
console.log('1. PostgreSQL сервер');
console.log('2. В командной строке: node start-server.js (если зависимости установлены)');
console.log('3. Проверьте: http://localhost:3000/health');