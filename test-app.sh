#!/bin/bash
echo "Тестирование CS2 Nades Telegram Mini App"

# Проверяем, что все необходимые файлы существуют
echo "Проверяем файлы проекта..."
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

echo "Проверяем API endpoint'ы..."
echo "1. Проверяем список карт..."
curl -s http://localhost:3000/api/maps | head -5

echo "2. Проверяем данные карты Mirage..."
curl -s http://localhost:3000/api/maps/mirage | head -5

echo "3. Проверяем линии для Mirage..."
curl -s http://localhost:3000/api/maps/mirage/lineups | head -5

echo "Тестирование завершено!"