# CS2 Nades — Telegram Mini App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Goal

Create a Telegram Mini App that serves as a visual catalog for CS2 grenade lineups.

Users should be able to:

1. Select a CS2 map.
2. Select a side: T / CT.
3. Select a grenade type: Smoke / Flash / Molotov / HE.
4. Browse available lineups.
5. Open a lineup.
6. Watch the associated video stored in an open Telegram channel.

The Telegram channel is the video storage layer. PostgreSQL stores lineup metadata and the relationship between a lineup and its Telegram channel message.

---

## Architecture

```text
                    ┌──────────────────────┐
                    │   Telegram Channel   │
                    │                      │
                    │  lineup videos       │
                    │  stored as posts     │
                    └──────────┬───────────┘
                               │
                               │ telegram_message_id
                               │
                    ┌──────────▼───────────┐
                    │      PostgreSQL      │
                    │                      │
                    │ maps                 │
                    │ lineups              │
                    │ metadata             │
                    │ Telegram references  │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               │
                    ┌──────────▼───────────┐
                    │      Node.js API     │
                    │       Express        │
                    └──────────┬───────────┘
                               │
                               │ HTTPS
                               │
                    ┌──────────▼───────────┐
                    │ Telegram Mini App    │
                    │ React + TypeScript    │
                    │ Vite                  │
                    └──────────────────────┘
```

### Important architectural decision

**Do not use MinIO/S3 for videos.**

Videos are stored in the open Telegram channel.

The database stores the Telegram message reference instead of a permanent external video URL.

---

## Tech Stack

* Frontend: React + TypeScript + Vite
* Backend: Node.js + TypeScript + Express
* Database: PostgreSQL
* Video storage: Telegram channel
* Telegram integration: Telegram WebApp SDK
* API: REST
* Testing: Vitest + React Testing Library + Supertest
* Validation: Zod or equivalent schema validation
* Deployment: Docker + reverse proxy + HTTPS

---

# Global Constraints

* All API endpoints must be prefixed with `/api`.
* The application must run inside Telegram WebApp.
* The UI must be responsive on mobile, tablet and desktop.
* Mobile Telegram UX is the primary target.
* The application must support Telegram light and dark themes.
* All user-facing identifiers must be meaningful and human-readable.
* PostgreSQL is the only production database.
* SQLite is NOT required.
* Videos are stored in the Telegram channel.
* The backend must never trust arbitrary frontend input.
* All API input must be validated.
* API errors must have consistent JSON responses.
* No random/generated fake data may be used in production components.
* No `Math.random()` may be used for lineup counts or production UI data.
* Public catalog endpoints are read-only in the first version.
* Administrative CRUD is outside the initial Mini App scope.

---

# Data Model

## Map

```typescript
interface Map {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}
```

Example:

```json
{
  "id": "mirage",
  "slug": "mirage",
  "name": "MIRAGE",
  "sort_order": 1
}
```

---

## Lineup

```typescript
interface Lineup {
  id: string;
  map_id: string;
  side: 'T' | 'CT';
  grenade_type: 'smoke' | 'flash' | 'molotov' | 'he';
  target: string;
  title: string;
  description?: string;

  telegram_message_id: number;

  thumbnail_url?: string;

  created_at: Date;
  updated_at: Date;
}
```

### Important

`map_id` must reference `maps.id`.

Do not store the map name directly inside the lineup as an arbitrary string.

Example:

```text
lineups.map_id → maps.id
```

---

# Telegram Video Storage

Videos are stored as posts in an open Telegram channel.

Each lineup contains:

```text
telegram_message_id
```

which identifies the Telegram channel post containing the video.

The Telegram channel itself is configured on the backend.

Example environment variables:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHANNEL_ID=
TELEGRAM_CHANNEL_USERNAME=
```

Do not expose the bot token to the frontend.

---

## Telegram video requirements

The implementation must determine the correct playback strategy for videos stored in Telegram.

The preferred UX is:

```text
Lineup card
    ↓
Open lineup
    ↓
Play video inside Mini App
```

If direct in-app playback of the Telegram-hosted video cannot be implemented reliably using the available Telegram APIs, the fallback UX is:

```text
Lineup card
    ↓
Open Telegram channel post
    ↓
Play video in Telegram
```

This decision must be verified during implementation rather than assuming that a normal permanent `video_url` exists.

Do not invent permanent Telegram file URLs.

---

# API

## GET `/api/maps`

Return all available maps.

Example:

```json
[
  {
    "id": "mirage",
    "slug": "mirage",
    "name": "MIRAGE",
    "thumbnail_url": null,
    "sort_order": 1,
    "lineup_count": 42
  }
]
```

`lineup_count` must come from the database.

Never generate the value randomly.

---

## GET `/api/maps/:id`

Return a single map.

Responses:

```text
200 — map found
404 — map not found
```

---

## GET `/api/maps/:id/lineups`

Return lineups belonging to the selected map.

Supported query parameters:

```text
side
grenade_type
target
page
limit
```

Example:

```http
GET /api/maps/mirage/lineups?side=T&grenade_type=smoke
```

Response:

```json
{
  "items": [],
  "page": 1,
  "limit": 30,
  "total": 12
}
```

---

## GET `/api/lineups/:id`

Return one lineup with all metadata required by the frontend.

Example:

```json
{
  "id": "mirage-t-smoke-window",
  "map_id": "mirage",
  "side": "T",
  "grenade_type": "smoke",
  "target": "Window",
  "title": "Window Smoke",
  "description": "Default smoke for Mid control.",
  "telegram_message_id": 123,
  "thumbnail_url": null
}
```

---

# API Error Format

All API errors must use a consistent structure:

```json
{
  "error": {
    "code": "MAP_NOT_FOUND",
    "message": "Map not found"
  }
}
```

Expected HTTP statuses:

```text
400 Bad Request
404 Not Found
500 Internal Server Error
```

Do not expose internal database errors or stack traces to clients.

---

# Frontend UX

The primary navigation flow is:

```text
MAP
 ↓
SIDE
 ↓
GRENADE TYPE
 ↓
LINEUP
 ↓
VIDEO
```

Example:

```text
MIRAGE
 ├── T
 │    ├── Smoke
 │    ├── Flash
 │    ├── Molotov
 │    └── HE
 │
 └── CT
      ├── Smoke
      ├── Flash
      ├── Molotov
      └── HE
```

---

# UI Components

Create:

```text
src/components/
  AppLayout.tsx
  MapSelector.tsx
  SideSelector.tsx
  GrenadeTypeSelector.tsx
  LineupGrid.tsx
  LineupCard.tsx
  LineupDetails.tsx
  VideoPlayer.tsx
  LoadingState.tsx
  EmptyState.tsx
  ErrorState.tsx
```

---

# Task 1: Project Foundation

## Files

Create:

```text
package.json
vite.config.ts
tsconfig.json
src/main.tsx
src/App.tsx
src/index.css
src/types.ts
src/api/client.ts
src/api/types.ts
server/app.ts
server/server.ts
```

## Requirements

* React + TypeScript + Vite
* Express + TypeScript
* Frontend and backend build successfully.
* ESLint/formatter configured.
* Test framework configured.

## Tests

Create at least one meaningful smoke test for frontend rendering.

Do not create tests that only check whether a function exists.

---

# Task 2: PostgreSQL Database

## Files

Create:

```text
server/db/
  migrations/
    001_initial.sql
  seed/
    001_maps.sql
server/database.ts
```

## Tables

### `maps`

```sql
id
slug
name
thumbnail_url
sort_order
created_at
updated_at
```

### `lineups`

```sql
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

---

## Constraints

Add:

* primary keys
* foreign key from `lineups.map_id` to `maps.id`
* unique map slug
* appropriate `NOT NULL` constraints
* valid side constraint
* valid grenade type constraint

---

## Indexes

At minimum:

```sql
CREATE INDEX idx_lineups_map_id
ON lineups(map_id);

CREATE INDEX idx_lineups_filters
ON lineups(map_id, side, grenade_type);
```

---

# Task 3: Database Seed

Create initial map records:

```text
Mirage
Inferno
Ancient
Anubis
Nuke
Dust 2
Train
Overpass
```

Do not create fake lineup records unless explicitly needed for development/testing.

If test data is required, keep it in a dedicated test seed.

---

# Task 4: Backend Application

Create:

```text
server/app.ts
server/server.ts
server/routes/maps.ts
server/routes/lineups.ts
server/middleware/errorHandler.ts
server/middleware/validation.ts
```

## Architecture

`app.ts` must:

* create Express app
* register middleware
* register routes
* register error handler
* export the app

`server.ts` must:

* import the app
* start the HTTP server

This allows Supertest to test the Express application without starting a real HTTP server.

---

# Task 5: Map API

Implement:

```text
GET /api/maps
GET /api/maps/:id
```

Tests:

```text
GET /api/maps → 200
GET /api/maps/unknown → 404
```

Verify that returned map data comes from PostgreSQL.

---

# Task 6: Lineup API

Implement:

```text
GET /api/maps/:id/lineups
GET /api/lineups/:id
```

Filtering:

```text
side
grenade_type
target
```

Pagination:

```text
page
limit
```

Tests must cover:

```text
valid map
unknown map
valid filter
invalid filter
empty result
pagination
unknown lineup
database error
```

---

# Task 7: API Client

Create:

```text
src/api/client.ts
```

The API client must:

* use a configurable API base URL
* support GET requests
* check `response.ok`
* parse JSON errors
* expose typed responses
* never silently accept HTTP 4xx/5xx responses

Example:

```typescript
const response = await fetch(url);

if (!response.ok) {
  throw new ApiError(...);
}
```

Do not hardcode:

```text
http://localhost:3000/api
```

for production.

Use environment configuration.

---

# Task 8: Map Selector

Create:

```text
MapSelector.tsx
```

Requirements:

* Load maps from API.
* Display map name.
* Display real lineup count.
* Allow map selection.
* Show selected state.
* Handle loading.
* Handle API errors.
* Handle empty response.

Do not keep a separate hardcoded map list in the component.

Do not generate fake lineup counts.

---

# Task 9: Side and Grenade Filters

Create:

```text
SideSelector.tsx
GrenadeTypeSelector.tsx
```

Side:

```text
T
CT
```

Grenade types:

```text
Smoke
Flash
Molotov
HE
```

Changing a filter must reload/filter the lineup catalog.

The current selected map must remain selected while changing filters.

---

# Task 10: Lineup Catalog

Create:

```text
LineupGrid.tsx
LineupCard.tsx
```

Each card should show:

```text
thumbnail
title
side
grenade type
target
```

Clicking a card opens lineup details.

States:

```text
loading
loaded
empty
error
```

Use skeleton/loading UI instead of rendering an empty layout while data is loading.

---

# Task 11: Lineup Details

Create:

```text
LineupDetails.tsx
```

Display:

```text
title
map
side
grenade type
target
description
video
```

The Telegram message reference must not be exposed as an internal technical identifier in the user interface.

---

# Task 12: Telegram WebApp Integration

Create:

```text
src/telegram/sdk.ts
src/telegram/types.ts
```

Implement:

* WebApp initialization
* `ready()`
* `expand()`
* theme detection
* Telegram theme variables
* viewport handling
* BackButton where appropriate

The app must work both:

1. inside Telegram
2. in a normal browser during development

Development mode must not crash when `window.Telegram` is unavailable.

---

# Task 13: Telegram `initData`

If the backend needs to identify the Telegram user:

* receive Telegram `initData` from the frontend
* send it to backend
* validate it server-side using the Telegram bot token
* never trust `initDataUnsafe` for authentication

Do not implement user authentication if it is not required by the initial product.

---

# Task 14: Video Playback

The video source is Telegram.

The implementation must first determine whether the video can be played directly inside the Mini App using the Telegram-hosted media.

Preferred behavior:

```text
Lineup
  ↓
VideoPlayer
  ↓
play video inside Mini App
```

Fallback:

```text
Lineup
  ↓
Open Telegram channel message
```

The implementation must not invent or persist fake `video_url` values.

The database should store:

```text
telegram_message_id
```

and optionally:

```text
thumbnail_url
```

---

# Task 15: Telegram Channel Integration

Define backend configuration:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHANNEL_ID=
TELEGRAM_CHANNEL_USERNAME=
```

The bot token must exist only on the backend.

Create a small service abstraction:

```text
server/telegram/
  client.ts
  video.ts
  types.ts
```

Responsibilities:

* resolve Telegram channel messages
* resolve video metadata where supported
* build/open channel message references
* isolate Telegram-specific logic from the rest of the application

Do not place Telegram Bot API calls directly inside Express route handlers.

---

# Task 16: Responsive Design

Primary target:

```text
Telegram mobile
```

Also support:

```text
tablet
desktop
```

Required:

* touch-friendly controls
* no horizontal overflow
* responsive grid
* readable card layout
* Telegram safe-area handling
* dark/light theme
* correct viewport height handling

---

# Task 17: Error Handling

Frontend states:

```text
Loading
Empty
Error
Retry
Video unavailable
Telegram unavailable
```

Backend:

```text
400
404
500
```

All errors must be represented consistently.

No raw stack traces should be displayed to users.

---

# Task 18: Performance

Requirements:

* lazy-load lineup thumbnails
* avoid loading all lineup videos at once
* do not preload every video in the catalog
* use thumbnails/posters
* minimize API requests
* debounce filter/search requests if search is added
* avoid unnecessary React re-renders

Only the selected lineup should initialize video playback.

---

# Task 19: Tests

## Backend

Test:

```text
GET /api/maps
GET /api/maps/:id
GET /api/maps/:id/lineups
GET /api/lineups/:id
filters
pagination
validation
404
500
```

## Frontend

Test:

```text
map loading
map selection
side selection
grenade selection
lineup rendering
empty state
error state
lineup details
video fallback
Telegram unavailable in browser
```

Do not write tests whose only purpose is checking that a function/component exists.

---

# Task 20: Deployment

Create Docker configuration for:

```text
frontend
backend
postgresql
```

Use a reverse proxy so the public application is served through HTTPS.

Example:

```text
https://nades.example.com
        │
        ├── /          → frontend
        └── /api/*     → backend
```

The Telegram Mini App must use HTTPS in production.

---

# Task 21: Telegram Bot / Mini App Configuration

Configure:

```text
Telegram Bot
    ↓
Menu Button / Mini App
    ↓
https://nades.example.com
```

The Mini App must be launchable directly from Telegram.

Verify:

* mobile Telegram
* Telegram Desktop
* browser development mode

---

# Task 22: Final Acceptance Test

The following complete flow must work:

```text
Open Telegram Bot
        ↓
Open Mini App
        ↓
Select MIRAGE
        ↓
Select T
        ↓
Select SMOKE
        ↓
See lineup cards
        ↓
Open "Window Smoke"
        ↓
See lineup details
        ↓
Play associated Telegram video
```

The same flow must work on a second map without code changes.

---

# Out of Scope for Version 1

Do NOT implement initially:

* user accounts
* favorites
* ratings
* comments
* public lineup creation
* public lineup editing
* admin panel
* MinIO
* S3
* CDN for video storage
* social features
* notifications
* analytics dashboard

These can be added later if required.

---

# Definition of Done

Version 1 is complete when:

* [ ] React/Vite frontend builds successfully.
* [ ] Express backend builds successfully.
* [ ] PostgreSQL migrations work from a clean database.
* [ ] Maps are loaded from PostgreSQL.
* [ ] Lineups are loaded from PostgreSQL.
* [ ] Map filtering works.
* [ ] Side filtering works.
* [ ] Grenade type filtering works.
* [ ] Loading/error/empty states work.
* [ ] Telegram WebApp SDK integration works.
* [ ] Telegram theme is respected.
* [ ] Telegram channel references are stored in PostgreSQL.
* [ ] Video playback works inside Mini App, OR reliable Telegram-message fallback is implemented.
* [ ] No MinIO/S3 dependency exists.
* [ ] API input validation is implemented.
* [ ] API tests pass.
* [ ] Frontend tests pass.
* [ ] Production Docker build works.
* [ ] Application works over HTTPS.
* [ ] Complete Mirage → T → Smoke → Lineup → Video flow works on mobile Telegram.
