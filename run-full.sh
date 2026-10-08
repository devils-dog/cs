#!/bin/bash
echo "🚀 Запуск CS2 Nades Telegram Mini App"

# Показать текущую директорию
echo "📍 Текущая директория: $(pwd)"

# Проверить наличие необходимых файлов
echo "📋 Проверка необходимых файлов..."
if [ -f "package.json" ]; then
    echo "✅ package.json найден"
else
    echo "❌ package.json не найден"
    exit 1
fi

if [ -d "server" ]; then
    echo "✅ server директория найдена"
else
    echo "❌ server директория не найдена"
    exit 1
fi

if [ -d "src" ]; then
    echo "✅ src директория найдена"
else
    echo "❌ src директория не найдена"
    exit 1
fi

# Установка зависимостей
echo "🔄 Установка зависимостей..."
npm install

# Проверка состояния базы данных
echo "🔄 Проверка подключения к базе данных..."
if [ -f "server/database.ts" ]; then
    echo "✅ Файл базы данных найден"
fi

# Запуск тестового сервера
echo "🚀 Запуск тестового сервера..."
echo "📊 Сервер будет доступен по адресу: http://localhost:3000"
echo "🔧 Health check: http://localhost:3000/health"
echo "🔍 Тест endpoint: http://localhost:3000/test"

# Запуск сервера в фоне и вывод логов
npx ts-node minimal-test-server.ts

echo "🛑 Сервер остановлен"