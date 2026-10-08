#!/bin/bash
echo "Запуск локальной проверки CS2 Nades Telegram Mini App"

# Проверка, что необходимые файлы существуют
echo "Проверка файлов..."
if [ -f "package.json" ]; then
    echo "✓ package.json найден"
else
    echo "✗ package.json не найден"
    exit 1
fi

if [ -d "server" ]; then
    echo "✓ Директория server найдена"
else
    echo "✗ Директория server не найдена"
    exit 1
fi

if [ -d "src" ]; then
    echo "✓ Директория src найдена"
else
    echo "✗ Директория src не найдена"
    exit 1
fi

# Запуск тестового сервера
echo "Запуск тестового сервера..."
npx ts-node minimal-test-server.ts

echo "Сервер запущен! Проверьте:"
echo "Health check: http://localhost:3000/health"
echo "Test endpoint: http://localhost:3000/test"
echo "API endpoints: http://localhost:3000/api/maps, /api/maps/:id, /api/lineups/:id"