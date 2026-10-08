Ты работаешь непосредственно с текущим репозиторием CS2 Nades Telegram Mini App.

Главный источник требований:
`plan_update.md`

Дополнительный аудит:
`PLAN_UPDATE_AUDIT.md`

Твоя задача — **реально исправить код репозитория**, чтобы он соответствовал `plan_update.md`.

Не переписывай проект с нуля. Используй существующую архитектуру и исправляй только реальные несоответствия.

---

# КРИТИЧЕСКИЕ ПРАВИЛА

1. Сначала изучи текущий репозиторий.
2. Прочитай полностью:

   * `plan_update.md`
   * `PLAN_UPDATE_AUDIT.md`
   * `package.json`
   * `README.md`
   * `App.tsx`
   * API client
   * backend routes
   * database layer
   * Telegram integration
   * Docker files
   * TypeScript configs
3. Не доверяй файлам вида:

   * `*_COMPLETE.md`
   * `FINAL_*.md`
   * `*_SUMMARY.md`

   Состояние проекта определяй по реальному коду.
4. Не создавай фиктивную реализацию только ради прохождения проверки.
5. Не добавляй fake API.
6. Не добавляй fake Telegram video URLs.
7. Не используй несуществующие Telegram Bot API методы.
8. Не добавляй реальные секреты.
9. Не удаляй рабочую функциональность без необходимости.
10. Не делай `git push`.
11. Не делай `git push --force`.
12. Не переписывай Git history автоматически.
13. Не создавай новые `*_COMPLETE.md` как замену реальной реализации.
14. После каждого крупного этапа запускай соответствующие проверки.
15. Если какое-либо требование `plan_update.md` невозможно выполнить буквально — остановись и объясни причину, а не создавай workaround, который нарушает архитектуру.

---

# ЭТАП 0 — АУДИТ ПЕРЕД ИЗМЕНЕНИЯМИ

Сначала ничего не меняй.

Проведи проверку текущего состояния.

Проверь:

```bash
git status
git log --oneline --decorate -10
```

Затем найди:

```bash
git grep -n "8843411917" || true
git grep -n "AAHmlXx" || true
git grep -n "getMessages" || true
git grep -n "fetch('/api" || true
git grep -n 'fetch("/api' || true
```

Проверь существование:

```text
src/App.tsx
src/api/client.ts
src/components/
src/telegram/
server/
server/routes/
server/database.ts
server/telegram/
server/db/migrations/
server/db/seed/
Dockerfile
frontend.Dockerfile
docker-compose.yml
package.json
tsconfig.json
tsconfig.server.json
vite.config.ts
```

Проверь scripts:

```bash
cat package.json
```

Проверь соответствие:

```text
package.json
Dockerfile
frontend.Dockerfile
docker-compose.yml
tsconfig.server.json
```

Особенно внимательно проверь entrypoint backend.

После аудита кратко сообщи:

```text
P0 issues:
P1 issues:
P2 issues:
P3 issues:
```

После этого сразу переходи к исправлениям.

---

# ЭТАП 1 — SECURITY

Исправь все проблемы безопасности.

## 1.1 Token

Удалить настоящий Telegram Bot Token из:

```text
SECURITY_FIXES.md
```

и любых других текущих файлов.

Использовать только placeholder:

```text
YOUR_BOT_TOKEN_HERE
```

или environment variable.

Проверка:

```bash
git grep -n "8843411917" || true
git grep -n "AAHmlXx" || true
```

Результат должен быть пустым.

## 1.2 Secrets

Проверь:

```text
.env
.env.*
node_modules/
credentials
tokens
logs
personal files
```

`.env` не должен попадать в Git.

Создай/исправь:

```text
.env.example
```

с безопасными placeholders.

## 1.3 Git history

НЕ переписывай history.

Только проверь наличие старого токена:

```bash
git log --all --oneline
git grep "8843411917" $(git rev-list --all) || true
```

Если секрет есть в history — зафиксируй проблему в итоговом отчёте.

Не выполняй:

```bash
git push --force
```

---

# ЭТАП 2 — PACKAGE / TYPESCRIPT / ENTRYPOINT

Исправь несогласованность `package.json` и Docker.

Сейчас критически важно проверить:

```text
Dockerfile
package.json
server/server.ts
tsconfig.server.json
```

Docker не должен запускать scripts, которых нет в `package.json`.

Production start должен указывать на реально существующий compiled JS.

Цель:

```bash
npm run build
npm start
```

должны работать.

Также должны работать:

```bash
npm run build:client
npm run build:server
```

Не добавляй fake scripts.

Каждый script должен реально выполнять соответствующую операцию.

---

# ЭТАП 3 — DATABASE

Проверь:

```text
server/database.ts
server/db/migrations/001_initial.sql
server/db/seed/001_maps.sql
```

Убедись, что:

```text
maps
lineups
```

соответствуют `plan_update.md`.

Проверь:

```text
PRIMARY KEY
FOREIGN KEY
NOT NULL
UNIQUE
CHECK
INDEX
```

Проверь индексы под реальные API filters:

```text
map_id
side
grenade_type
target
```

Не добавляй ненужные индексы.

`telegram_message_id` должен использоваться как ссылка на Telegram post.

Не добавляй `video_url` как fake storage mechanism.

---

# ЭТАП 4 — BACKEND API

Это один из самых важных этапов.

Реализуй строго:

```text
GET /api/maps
GET /api/maps/:id
GET /api/maps/:id/lineups
GET /api/lineups/:id
```

## Критическая проблема

Сейчас нужно проверить routing между:

```text
server/routes/maps.ts
server/routes/lineups.ts
server/app.ts
server/server.ts
```

Нельзя допустить получение:

```text
/api/lineups/maps/:mapId/lineups
```

вместо:

```text
/api/maps/:mapId/lineups
```

Исправь routing.

---

# ЭТАП 5 — VALIDATION

Используй Zod.

Валидировать:

```text
side
grenade_type
target
page
limit
```

Некорректный пользовательский input:

```text
400
```

Не:

```text
500
```

Ошибки должны иметь единый формат:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "..."
  }
}
```

Поддержать:

```text
MAP_NOT_FOUND
LINEUP_NOT_FOUND
INVALID_REQUEST
DATABASE_ERROR
INTERNAL_ERROR
```

Не возвращать stack trace пользователю в production.

---

# ЭТАП 6 — PAGINATION

Исправь pagination в `server/routes/lineups.ts`.

Особенно проверь проблему с:

```text
countParams
dataParams
paramIndex
```

COUNT и SELECT должны иметь независимые массивы параметров и корректную нумерацию PostgreSQL placeholders.

Проверить:

```text
page=1
page=2
page=3
```

Корректно вернуть:

```text
items
page
limit
total
```

---

# ЭТАП 7 — FRONTEND API CLIENT

Все frontend API requests должны идти через:

```text
src/api/client.ts
```

Найди:

```bash
git grep "fetch('/api"
git grep 'fetch("/api'
```

Исправь все компоненты, которые обращаются к backend напрямую.

Особенно проверь:

```text
MapSelector.tsx
LineupGrid.tsx
LineupDetails.tsx
```

Компоненты не должны самостоятельно реализовывать API protocol.

---

# ЭТАП 8 — APP.TSX

Сейчас `App.tsx` является placeholder.

Реально собери приложение.

Используй существующие компоненты:

```text
AppLayout
MapSelector
SideSelector
GrenadeTypeSelector
LineupGrid
LineupCard
LineupDetails
LoadingState
EmptyState
ErrorState
```

Не создавай дублирующие компоненты без необходимости.

---

# ЭТАП 9 — FRONTEND STATE

В `App.tsx` или подходящем state layer реализуй:

```text
selectedMap
selectedSide
selectedGrenadeType
selectedTarget
selectedLineup
```

Flow:

```text
Map
 ↓
Side
 ↓
Grenade type
 ↓
Target
 ↓
Lineups
 ↓
Lineup details
```

Изменение фильтров должно приводить к соответствующему API request.

Не хранить production lineup data hardcoded в frontend.

---

# ЭТАП 10 — UI STATES

Для всех async операций обеспечить:

```text
loading
success
empty
error
```

Использовать существующие:

```text
LoadingState
EmptyState
ErrorState
```

Не оставлять пустые placeholder screens.

---

# ЭТАП 11 — LINEUP DETAILS

`LineupDetails.tsx` должен показывать реальные данные API:

```text
title
description
map
side
grenade_type
target
```

Видео должно использовать реальную Telegram architecture.

Никаких:

```text
fake video_url
fake file_id
fake metadata
```

---

# ЭТАП 12 — TELEGRAM VIDEO

Это принципиально важно.

Для текущего V1 использовать:

```text
telegram_message_id
```

как идентификатор Telegram Channel post.

НЕ пытаться получать историю Channel через Bot API.

Удалить использование:

```text
getMessages
```

из:

```text
server/telegram/client.ts
```

Не использовать несуществующие Bot API методы.

---

# ЭТАП 13 — TELEGRAM VIDEO FALLBACK

Для V1 реализовать надёжный вариант:

```text
Смотреть видео
```

→ открывает соответствующий Telegram Channel post.

Использовать:

```text
TELEGRAM_CHANNEL_USERNAME
telegram_message_id
```

Не создавать fake video URLs.

Если Telegram Channel username неизвестен из текущего проекта — используй environment variable:

```text
TELEGRAM_CHANNEL_USERNAME
```

и добавь его в `.env.example`.

---

# ЭТАП 14 — УДАЛИТЬ FAKE VIDEO SERVICE

Проверь:

```text
server/telegram/video.ts
```

Если файл нужен только для dummy metadata/fake URL — удали его или полностью переделай.

Для V1 не нужны:

```text
duration: 0
width: 0
height: 0
mime_type: ""
file_id: ""
file_size: 0
fake URLs
```

Не оставляй fake implementation под видом готовой интеграции.

---

# ЭТАП 15 — TELEGRAM MINI APP SDK

Проверь:

```text
src/telegram/sdk.ts
src/main.tsx
src/App.tsx
```

SDK должен инициализироваться один раз при bootstrap.

Использовать существующий helper:

```text
initTelegramWebApp()
```

Если предусмотрено текущей архитектурой:

```text
ready()
expand()
theme
viewport
BackButton
```

Не вызывать initialization из каждого компонента.

`initData` не добавлять, если authentication/identity сейчас реально не используется.

---

# ЭТАП 16 — RESPONSIVE UI

Проверь приложение минимум на:

```text
360px
390px
430px
768px
```

Исправь:

```text
filters
cards
buttons
lineup details
Telegram viewport
```

Не нужно делать дизайнерский overhaul.

Главное — рабочий mobile-first Mini App.

---

# ЭТАП 17 — DOCKER

Исправь:

```text
Dockerfile
frontend.Dockerfile
docker-compose.yml
```

Цель:

```bash
docker compose build
docker compose up -d
```

должны работать.

Backend Dockerfile не должен использовать несуществующие npm scripts.

Frontend production image не должен просто запускать development server:

```bash
npm run dev
```

Production должен использовать результат:

```text
dist/
```

---

# ЭТАП 18 — MIGRATION / SEED

Проверить реальный workflow:

```text
PostgreSQL
 ↓
migration
 ↓
seed
 ↓
backend
```

После запуска DB должны существовать карты.

Не считать migration/seed готовыми только потому, что SQL-файл существует.

---

# ЭТАП 19 — TESTS

Добавь реальные тесты.

Минимум backend:

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
pagination
filters
```

Frontend:

```text
MapSelector
LineupGrid
LineupDetails
App flow
```

Используй один реальный test stack.

Не создавать:

```text
"test": "echo tests passed"
```

или аналогичные fake scripts.

---

# ЭТАП 20 — BUILD

После исправлений обязательно выполнить:

```bash
npm install
npm run build
npm test
```

Если есть ошибки — исправить их.

Нельзя завершать задачу с формулировкой:

```text
build should work
```

Нужно реально проверить.

---

# ЭТАП 21 — DOCKER TEST

После успешного npm build:

```bash
docker compose build
docker compose up -d
```

Проверить backend.

Проверить:

```text
/api/maps
/api/maps/:id
/api/maps/:id/lineups
/api/lineups/:id
```

Проверить frontend.

---

# ЭТАП 22 — FINAL SECURITY CHECK

Перед завершением обязательно:

```bash
git grep -n "8843411917" || true
git grep -n "AAHmlXx" || true
git grep -n "getMessages" || true
git grep -n "fake" server src || true
git status
```

Также:

```bash
git ls-files | grep -E 'node_modules|\.env$|%USERPROFILE%'
```

Не должно быть секретов или мусора.

---

# ЭТАП 23 — FINAL E2E

Проверить полный пользовательский сценарий:

```text
Открыть приложение
        ↓
Telegram SDK initialization
        ↓
Выбрать карту
        ↓
Выбрать сторону
        ↓
Выбрать тип гранаты
        ↓
Получить список lineup
        ↓
Открыть lineup
        ↓
Посмотреть описание
        ↓
Нажать "Смотреть видео"
        ↓
Открывается соответствующий Telegram Channel post
```

---

# ФОРМАТ РАБОТЫ

Работай итерациями.

После каждого этапа сообщай:

```text
[STEP X]
Что исправлено:
- ...

Что проверено:
- ...

Ошибки:
- ...

Следующий этап:
- ...
```

Не пиши:

```text
Done
```

если ты не проверил результат.

---

# ВАЖНО: НЕ ОСТАНАВЛИВАЙСЯ НА АНАЛИЗЕ

После первоначального аудита начинай вносить изменения.

Не спрашивай разрешение на каждую мелкую правку.

Самостоятельно исправляй P0/P1/P2 проблемы.

Если возникает архитектурное решение, которое невозможно определить однозначно из `plan_update.md`, выбери минимальное изменение, сохраняющее существующую архитектуру.

---

# ФИНАЛЬНЫЙ ОТЧЁТ

В конце выдай таблицу:

| #   | Требование         | Статус                | Что изменено | Проверка |
| --- | ------------------ | --------------------- | ------------ | -------- |
| 1   | Security           | DONE/PARTIAL/NOT DONE | ...          | ...      |
| 2   | Git cleanup        | ...                   | ...          | ...      |
| ... | ...                | ...                   | ...          | ...      |
| 48  | Definition of Done | ...                   | ...          | ...      |

После таблицы отдельно:

```text
BUILD:
TESTS:
DOCKER:
SECURITY:
E2E:
```

И отдельно перечисли всё, что осталось `PARTIAL` или `NOT DONE`.

Не утверждай, что проект готов, если хотя бы один критический пункт остаётся неисправленным.
