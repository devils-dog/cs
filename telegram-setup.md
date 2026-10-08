# Telegram Bot Интеграция для CS2 Nades Mini App

## Созданный Bot
- Название: c2_grnd_bot_bot
- Username: t.me/c2_grnd_bot_bot
- Токен: 8843411917:AAHmlXxbsXueXbmaj-ci9B5r5WchUwlqWY0

## Настройка WebApp

### 1. Настройка в Telegram
1. Откройте @BotFather в Telegram
2. Выберите ваш бот: `/mybots`
3. Нажмите на бота
4. Выберите "Web App" 
5. Установите URL для вашего приложения (например, http://localhost:5173 для локальной разработки)

### 2. Конфигурация сервера

Для работы с Telegram нужно обновить наш сервер:

## Основные компоненты для интеграции

### API для Telegram:

- `/webhook` - обработчик вебхуков от Telegram
- `/init-data` - обработка initData от Telegram

### Файлы для реализации:

Создайте файл `src/telegram/bot.ts`:

```typescript
// src/telegram/bot.ts
import { Telegram } from 'telegraf';

const botToken = process.env.TELEGRAM_BOT_TOKEN || '8843411917:AAHmlXxbsXueXbmaj-ci9B5r5WchUwlqWY0';
const telegram = new Telegram(botToken);

export { telegram };
```

И файл `src/telegram/types.ts`:

```typescript
// src/telegram/types.ts
export interface TelegramInitData {
  id: string;
  username?: string;
  first_name: string;
  last_name?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface TelegramUser {
  id: string;
  username?: string;
  first_name: string;
  last_name?: string;
  photo_url?: string;
}
```

### Обновление базовой конфигурации:

В файле `.env` добавьте:
```
TELEGRAM_BOT_TOKEN=8843411917:AAHmlXxbsXueXbmaj-ci9B5r5WchUwlqWY0
TELEGRAM_WEBAPP_URL=https://t.me/c2_grnd_bot_bot
```

### Требования по интеграции:

1. Обработка Telegram initData из веб-приложения
2. Работа с Telegram WebApp API
3. Валидация данных от Telegram
4. Поддержка Telegram темизации

После настройки вебхука и указания URL, бот будет готов к использованию.

## Локальная разработка

Для локальной разработки вы можете использовать:

1. `http://localhost:5173` для фронтенда
2. `http://localhost:3000` для бэкенда API
3. Использовать инструменты вроде ngrok для получения公网 URL для тестирования Telegram

## Следующие шаги:

1. Настроить вебхуки в Telegram
2. Обновить бэкенд для обработки данных Telegram
3. Создать mock-реализацию для локальной разработки
4. Подготовить финальный тест

Это позволит вам полностью тестировать приложение в Telegram-окружении.