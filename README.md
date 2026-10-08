# CS2 Nades Telegram Mini App

This is a Telegram Mini App for viewing CS2 grenade lineups, built with React, TypeScript, Express, and PostgreSQL.

## Features

- View CS2 map lineups with different grenade types
- Filter lineups by side, grenade type, and target
- View detailed lineup information including description and video
- Telegram Mini App integration with SDK

## Architecture

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
```

## Security

- All secret tokens are stored in `.env` files, never in Git
- No sensitive data is committed to the repository
- Proper validation and error handling implemented

## Getting Started

1. Clone the repository
2. Create `.env` file with required environment variables
3. Install dependencies: `npm install`
4. Start development servers: `npm run dev`

## API Endpoints

- `GET /api/maps` - Get all maps
- `GET /api/maps/:id` - Get a single map
- `GET /api/maps/:id/lineups` - Get lineups for a map with filters
- `GET /api/lineups/:id` - Get a single lineup

## Technologies Used

- React (with TypeScript)
- Express (with TypeScript)
- PostgreSQL with pg
- Vite
- Telegram Mini App SDK