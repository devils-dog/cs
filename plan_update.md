# CS2 Nades Telegram Mini App — План исправления

## 0. Цель

Привести текущий репозиторий в рабочее состояние и получить минимально готовый к деплою Telegram Mini App для просмотра базы раскидок CS2.

### Целевая архитектура

```text
┌──────────────────────┐
│ Telegram Mini App    │
│ React + Vite         │
└──────────┬───────────┘
           │ HTTP /api
           ▼
┌──────────────────────┐
│ Express API          │
│ Node.js + TypeScript │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ PostgreSQL            │
│ maps + lineups        │
└──────────────────────┘

Видео:
Telegram Channel
      │
      └── telegram_message_id
              │
              ▼
        metadata в PostgreSQL
```

### Что НЕ делать

* Не использовать MinIO/S3 для видео.
* Не хранить Telegram Bot Token в Git.
* Не делать CRUD-панель администратора в первой версии.
* Не придумывать прямые URL на Telegram-файлы.
* Не считать проект готовым только потому, что Docker собирается.
* Не делать `commit`, `push` или `merge` без отдельного разрешения.
* Не переписывать проект полностью без необходимости.

---

# 1. Критический security cleanup

## 1.1 Отозвать скомпрометированный Telegram Bot Token

В репозитории ранее был обнаружен настоящий Bot Token в:

```text
telegram-setup.md
```

### Действия

1. Отозвать токен через `@BotFather`.
2. Получить новый токен.
3. Новый токен НЕ добавлять в Git.
4. Хранить его только через `.env` / secrets.

### Acceptance Criteria

* Старый токен больше не действителен.
* В репозитории отсутствуют Telegram Bot Token.
* `git grep` по подозрительным строкам не находит токен.

---

# 2. Исправить `.gitignore`

Текущий `.gitignore` содержит некорректное содержимое.

Заменить на:

```gitignore
node_modules/
.env
.env.*
!.env.example

*.log

dist/
build/
coverage/

.DS_Store
Thumbs.db

.vscode/
.idea/

%USERPROFILE%/
```

## Acceptance Criteria

Следующее больше не должно отслеживаться Git:

```text
node_modules/
.env
*.log
dist/
build/
coverage/
%USERPROFILE%/
```

---

# 3. Удалить мусор из Git-репозитория

Проверить и удалить из репозитория:

```text
node_modules/
%USERPROFILE%/
```

Перед удалением `%USERPROFILE%/` обязательно проверить содержимое на конфигурации и секреты.

### Проверить:

```powershell
git status
git ls-files
```

Особенно проверить:

```text
%USERPROFILE%/
```

и OpenCode-конфигурацию внутри него.

## Acceptance Criteria

Репозиторий содержит только исходный код и необходимые проектные файлы.

---

# 4. Проверить Git history на секреты

Поскольку токен уже был закоммичен, простого удаления файла недостаточно для полного удаления секрета из истории.

После отзыва токена:

1. Проверить Git history.
2. Удалить секрет из истории, если это необходимо.
3. Не выполнять force-push самостоятельно.
4. Подготовить инструкцию для пользователя, если потребуется переписывание истории.

### Acceptance Criteria

В текущем состоянии репозитория нет действующих секретов.

---

# 5. Привести Node.js проект к нормальной структуре

Текущая структура содержит смешение frontend/backend зависимостей.

Целевая структура:

```text
/
├── src/
│   ├── api/
│   ├── components/
│   ├── telegram/
│   ├── App.tsx
│   └── main.tsx
│
├── server/
│   ├── app.ts
│   ├── database.ts
│   ├── routes/
│   ├── telegram/
│   └── index.ts
│
├── migrations/
├── public/
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Dockerfile
└── docker-compose.yml
```

---

# 6. Исправить `package.json`

Текущий `package.json` не содержит полный набор runtime-зависимостей, которые реально импортируются backend-кодом.

Проверить и добавить необходимые зависимости:

```text
express
pg
dotenv
axios
```

Для разработки:

```text
typescript
tsx
vite
@vitejs/plugin-react
```

Frontend:

```text
react
react-dom
```

Для валидации API рекомендуется:

```text
zod
```

Для тестов:

```text
vitest
```

или другой один выбранный стек тестирования.

## Scripts

Должны быть предусмотрены минимум:

```json
{
  "dev": "...",
  "dev:server": "...",
  "dev:client": "...",
  "build": "...",
  "build:client": "...",
  "build:server": "...",
  "start": "...",
  "test": "..."
}
```

Не оставлять неиспользуемые или фиктивные scripts.

---

# 7. Добавить отсутствующий `index.html`

Проверить наличие:

```text
index.html
```

Если отсутствует — создать полноценный Vite entry point.

Он должен подключать:

```text
/src/main.tsx
```

## Acceptance Criteria

Команда:

```powershell
npm run build
```

создаёт frontend build без ошибки отсутствующего `index.html`.

---

# 8. Разделить порты frontend и backend

Сейчас есть конфликт:

```text
Vite → 3000
Express → 3000
```

Исправить.

Целевая схема для development:

```text
Vite      → 5173
Express   → 3000
Postgres  → 5432
```

Vite должен проксировать:

```text
/api/*
```

на:

```text
http://localhost:3000
```

Например:

```text
Browser
   │
   ├── /api/maps
   │
   ▼
Vite :5173
   │
   ▼
Express :3000
```

---

# 9. Исправить TypeScript-конфигурацию

Проверить разделение:

```text
Frontend TypeScript
Backend TypeScript
```

Backend не должен случайно собираться как browser-код.

Проверить:

* `module`
* `moduleResolution`
* `target`
* `jsx`
* `types`
* `outDir`
* `rootDir`

## Acceptance Criteria

Frontend и backend компилируются независимо.

---

# 10. Исправить database layer

Сейчас:

```text
server/database.ts
```

экспортирует:

```ts
query
connect
close
```

но routes импортируют:

```ts
import pool from '../database'
```

Это несовместимо.

## Выбрать один подход

Рекомендуемый:

```ts
export const pool = new Pool(...)
export const query = ...
```

И использовать:

```ts
import { pool } from '../database'
```

или централизованный `query`.

Не смешивать оба подхода без необходимости.

---

# 11. Проверить PostgreSQL schema

Оставить основную модель:

```text
maps
lineups
```

### `maps`

Минимально:

```text
id
slug
name
created_at
updated_at
```

### `lineups`

Минимально:

```text
id
map_id
side
grenade_type
target
title
description
telegram_message_id
thumbnail_url
created_at
updated_at
```

Связь:

```text
lineups.map_id → maps.id
```

---

# 12. Проверить ограничения БД

Добавить/проверить:

```text
PRIMARY KEY
FOREIGN KEY
UNIQUE
NOT NULL
CHECK
INDEX
```

Особенно:

```text
map_id
side
grenade_type
telegram_message_id
```

Индексы должны соответствовать реальным API-фильтрам.

---

# 13. Исправить backend API

Целевой API:

```http
GET /api/maps
GET /api/maps/:id
GET /api/maps/:id/lineups
GET /api/lineups/:id
```

Для списка раскидок:

```http
GET /api/maps/:id/lineups?side=T&grenade_type=smoke&target=A
```

Поддержать:

```text
side
grenade_type
target
page
limit
```

---

# 14. Добавить нормальную валидацию API

Текущая проверка:

```text
validateMapId()
validateLineupId()
```

слишком слабая.

Использовать schema validation.

Например:

```text
map id → positive integer / UUID
lineup id → positive integer / UUID
side → допустимые значения
grenade_type → допустимые значения
page → integer >= 1
limit → integer в ограниченном диапазоне
```

Рекомендуется `zod`.

## Acceptance Criteria

Некорректный запрос не приводит к:

```text
500 Internal Server Error
```

если ошибка вызвана пользовательским вводом.

Возвращается:

```text
400 Bad Request
```

с понятным JSON error.

---

# 15. Исправить pagination

Проверить SQL для:

```text
COUNT(*)
SELECT ... LIMIT ... OFFSET ...
```

Параметры `COUNT` не должны использовать индексы параметров основного запроса после того, как они были изменены.

Использовать отдельные массивы параметров.

## Acceptance Criteria

Для:

```text
page=1
page=2
page=3
```

получаются корректные результаты и корректный `total`.

---

# 16. Удалить дублирующий API route

Проверить:

```text
server/routes/api.ts
server/routes/maps.ts
server/routes/lineups.ts
```

Сейчас функциональность дублируется.

Оставить одну понятную структуру.

Например:

```text
server/routes/
├── maps.ts
└── lineups.ts
```

Удалить неиспользуемый:

```text
api.ts
```

если после проверки он действительно нигде не используется.

---

# 17. Привести API errors к единому формату

Использовать единый формат:

```json
{
  "error": {
    "code": "LINEUP_NOT_FOUND",
    "message": "Lineup not found"
  }
}
```

Минимальные ошибки:

```text
MAP_NOT_FOUND
LINEUP_NOT_FOUND
INVALID_REQUEST
DATABASE_ERROR
INTERNAL_ERROR
```

Не возвращать stack trace клиенту в production.

---

# 18. Исправить frontend API client

Файл:

```text
src/api/client.ts
```

уже содержит нормальную основу.

Все компоненты должны использовать его.

Например, `MapSelector.tsx` сейчас делает собственный:

```ts
fetch('/api/maps')
```

Заменить на централизованный API client.

## Acceptance Criteria

В UI нет разрозненных прямых `fetch('/api/...')`.

Все API-запросы идут через:

```text
src/api/client.ts
```

---

# 19. Реально собрать frontend

Сейчас:

```text
src/App.tsx
```

является заглушкой.

Нужно собрать приложение из существующих компонентов.

Целевая структура:

```text
App
│
├── MapSelector
│
├── SideSelector
│
├── GrenadeTypeSelector
│
├── LineupGrid
│   └── LineupCard
│
└── LineupDetails
    └── VideoPlayer
```

---

# 20. Реализовать состояние приложения

Минимальное состояние:

```text
selectedMap
selectedSide
selectedGrenadeType
selectedTarget
selectedLineup
```

При изменении фильтра:

```text
API → загрузка lineups → обновление списка
```

---

# 21. Реализовать состояния UI

Для каждого API-запроса предусмотреть:

```text
loading
success
empty
error
```

Например:

```text
Загрузка раскидок...
```

```text
Ракидок не найдено
```

```text
Не удалось загрузить раскидки
```

---

# 22. Реализовать Lineup Details

Карточка/страница раскидки должна показывать:

```text
Название
Карта
Сторона
Тип гранаты
Цель
Описание
Видео
```

Использовать реальные данные PostgreSQL/API.

Никаких hardcoded lineup данных в React.

---

# 23. Исправить `VideoPlayer`

Текущий:

```text
src/components/VideoPlayer.tsx
```

является placeholder.

Он не должен просто показывать:

```text
Playing video from Telegram channel message #...
```

Нужно определить реальную стратегию воспроизведения.

---

# 24. Telegram video architecture

Видео хранится:

```text
Telegram Channel
```

В PostgreSQL хранится:

```text
telegram_message_id
```

Не хранить выдуманное:

```text
video_url
```

если такой URL реально не существует.

---

# 25. Вариант V1 для видео — надежный fallback

Если прямое воспроизведение Telegram-видео внутри Mini App невозможно или требует отдельной Telegram API/media-архитектуры, использовать:

```text
Открыть видео в Telegram
```

То есть lineup содержит ссылку/действие:

```text
Смотреть видео
```

которая открывает соответствующий пост Telegram-канала.

Это предпочтительнее неработающего fake player.

---

# 26. Не использовать `getMessages` Bot API

Текущий код:

```text
server/telegram/client.ts
```

пытается использовать:

```text
getMessages
```

через Telegram Bot API.

Это нельзя оставлять как рабочую реализацию.

Не строить архитектуру на несуществующем Bot API методе.

---

# 27. Удалить Telegram video placeholder

Файл:

```text
server/telegram/video.ts
```

сейчас возвращает dummy metadata.

Его необходимо либо:

1. реализовать настоящей интеграцией;

либо:

2. удалить из runtime-контроля и использовать только `telegram_message_id`.

Не должно существовать fake video metadata.

---

# 28. Telegram Mini App SDK

Проверить:

```text
src/telegram/sdk.ts
```

Нужно реализовать:

```text
Telegram.WebApp.ready()
Telegram.WebApp.expand()
```

И использовать:

```text
themeParams
colorScheme
viewport
BackButton
```

если соответствующий UX используется.

---

# 29. Инициализация Telegram WebApp

В `App.tsx` или отдельном bootstrap:

```text
SDK initialization
       ↓
ready()
       ↓
expand()
       ↓
render application
```

Не дублировать вызовы в разных компонентах.

---

# 30. `initData` и авторизация

Если приложение не требует идентификации пользователя:

```text
НЕ вводить авторизацию без необходимости.
```

Если потребуется пользовательская идентичность:

```text
Telegram initData
        ↓
Backend
        ↓
HMAC validation
        ↓
trusted user
```

Никогда не доверять:

```text
initDataUnsafe
```

как источнику серверной авторизации.

---

# 31. Responsive UI

Mini App должен нормально работать:

```text
Android
iOS
Desktop Telegram
```

Минимально проверить:

```text
360px
390px
430px
768px
```

Карточки не должны ломать layout.

Видео не должно выходить за пределы viewport.

---

# 32. Docker development

Исправить текущий конфликт:

```text
frontend 5173
backend 3000
postgres 5432
```

`docker-compose.yml` должен соответствовать реальным портам.

---

# 33. Docker production architecture

Не запускать Vite dev server в production.

Целевая схема:

```text
             ┌─────────────┐
             │   Nginx     │
             │ reverse     │
             │ proxy       │
             └──────┬──────┘
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
     Static React         Express API
       frontend              :3000
                              │
                              ▼
                         PostgreSQL
```

Frontend:

```text
npm run build
```

и затем отдаётся как static files.

---

# 34. Backend Dockerfile

Backend container должен:

1. установить dependencies;
2. собрать TypeScript;
3. запустить production server.

Не нужно собирать frontend внутри backend container, если frontend является отдельным production artifact.

---

# 35. Frontend Dockerfile

Использовать multi-stage build:

```text
Node
 ↓
npm install
 ↓
npm run build
 ↓
Nginx
 ↓
static files
```

---

# 36. Environment variables

Создать:

```text
.env.example
```

Например:

```env
NODE_ENV=development

PORT=3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cs2_nades

TELEGRAM_BOT_TOKEN=
TELEGRAM_CHANNEL_ID=
TELEGRAM_WEBAPP_URL=
```

Никаких реальных значений в Git.

---

# 37. Database migrations

Не полагаться на ручное создание таблиц.

Должна быть воспроизводимая процедура:

```text
fresh database
    ↓
migrations
    ↓
schema
    ↓
seed
    ↓
working application
```

---

# 38. Seed data

Создать минимальный seed:

```text
Mirage
```

и несколько реальных тестовых lineup.

Например:

```text
Smoke
Flash
Molotov
HE
```

Но данные должны соответствовать реальной модели проекта.

---

# 39. Первое end-to-end тестирование

Проверить полный путь:

```text
PostgreSQL
    ↓
Express
    ↓
API
    ↓
React
    ↓
Telegram Mini App
```

Тестовый сценарий:

1. Открыть приложение.
2. Выбрать Mirage.
3. Выбрать сторону.
4. Выбрать тип гранаты.
5. Получить список lineup.
6. Открыть lineup.
7. Увидеть описание.
8. Нажать просмотр видео.
9. Видео/Telegram post открывается корректно.

---

# 40. API tests

Минимально протестировать:

```text
GET /api/maps
GET /api/maps/:id
GET /api/maps/:id/lineups
GET /api/lineups/:id
```

Проверить:

```text
200
400
404
500
empty result
pagination
filters
```

---

# 41. Frontend tests

Минимально:

```text
App renders
MapSelector works
filters work
Lineup list renders
Lineup details renders
error state renders
empty state renders
```

---

# 42. Проверка production build

После исправлений:

```powershell
npm install
npm run build
```

Затем:

```powershell
docker compose build
docker compose up
```

Проверить:

```text
frontend
backend
postgres
API
```

---

# 43. Финальная проверка security

Перед deployment проверить:

```text
[ ] нет Telegram Bot Token
[ ] нет .env
[ ] нет passwords
[ ] нет API keys
[ ] node_modules не tracked
[ ] %USERPROFILE% не tracked
[ ] debug endpoints отсутствуют
[ ] stack traces не выдаются production-клиенту
[ ] CORS настроен корректно
[ ] database credentials не hardcoded
```

---

# 44. Telegram Bot / Mini App configuration

После того как приложение реально работает:

1. Создать/настроить Mini App через BotFather.
2. Указать HTTPS URL frontend.
3. Проверить открытие из Telegram.
4. Проверить Telegram theme.
5. Проверить BackButton.
6. Проверить открытие Telegram video post.

Не настраивать BotFather раньше, чем локальная версия полностью работает.

---

# 45. Финальный Definition of Done

Проект считается исправленным только если одновременно выполнены все пункты:

## Backend

* [ ] Express запускается.
* [ ] PostgreSQL подключается.
* [ ] migrations работают.
* [ ] API maps работает.
* [ ] API lineups работает.
* [ ] pagination работает.
* [ ] filters работают.
* [ ] validation работает.
* [ ] errors унифицированы.

## Frontend

* [ ] Vite собирается.
* [ ] `index.html` присутствует.
* [ ] App реально использует компоненты.
* [ ] API client используется централизованно.
* [ ] map selector работает.
* [ ] filters работают.
* [ ] lineup list работает.
* [ ] lineup details работает.
* [ ] loading/error/empty states реализованы.

## Telegram

* [ ] Telegram WebApp SDK инициализируется.
* [ ] `ready()` вызывается.
* [ ] `expand()` вызывается.
* [ ] theme учитывается.
* [ ] BackButton работает там, где необходим.
* [ ] Bot Token не находится в Git.
* [ ] Telegram video flow реально работает.

## Docker

* [ ] frontend и backend не используют один порт.
* [ ] frontend production build работает.
* [ ] backend production build работает.
* [ ] PostgreSQL работает.
* [ ] `docker compose up` поднимает весь стек.

## Security

* [ ] старый Bot Token отозван.
* [ ] секреты удалены.
* [ ] `.gitignore` исправлен.
* [ ] `node_modules` удалён из Git.
* [ ] `%USERPROFILE%` удалён из Git.
* [ ] история проверена на секреты.

## Quality

* [ ] tests проходят.
* [ ] `npm run build` проходит.
* [ ] Docker build проходит.
* [ ] приложение работает локально.
* [ ] приложение работает внутри Telegram.
* [ ] нет placeholder video player.
* [ ] нет fake Telegram API методов.
* [ ] нет заявлений о production readiness до фактической проверки.

---

# 46. Порядок выполнения

Не делать всё одним большим изменением.

Выполнять строго последовательно:

```text
01 Security cleanup
       ↓
02 Git cleanup
       ↓
03 package.json / TypeScript / Vite
       ↓
04 Database layer
       ↓
05 Backend API
       ↓
06 Frontend composition
       ↓
07 Telegram SDK
       ↓
08 Telegram video
       ↓
09 Docker
       ↓
10 Tests
       ↓
11 Telegram Mini App
       ↓
12 Production verification
```

После каждого этапа:

```text
изменить
   ↓
проверить
   ↓
исправить ошибки
   ↓
только затем переходить дальше
```

---

# 47. Главное правило для OpenCode

OpenCode должен работать с существующим кодом и исправлять его поэтапно.

Перед изменением каждого крупного блока:

1. Прочитать существующие файлы.
2. Найти реальные зависимости.
3. Не удалять рабочую функциональность без причины.
4. Не создавать fake implementation.
5. Не добавлять секреты.
6. Не менять архитектуру без необходимости.
7. После изменений запускать соответствующие проверки.
8. Не делать `git commit`.
9. Не делать `git push`.
10. Не делать `git merge`.

---

# 48. Первый этап для запуска в OpenCode

Начать только с:

```text
Security cleanup
Git cleanup
Project foundation
```

После успешного выполнения проверить:

```powershell
npm install
npm run build
```

Только когда эти команды проходят, переходить к backend.

Следующий этап:

```text
Database → API → Frontend → Telegram → Video → Docker → Tests
```

Так проще локализовать ошибки и не получить ситуацию, когда одновременно сломаны Vite, Express, PostgreSQL и Telegram integration.
