# CS2 Nades Telegram Mini App

## Overview
This is a Telegram Mini App that serves as a visual catalog for CS2 grenade lineups. Users can select maps, sides and grenade types to browse available lineups and watch associated videos stored in a Telegram channel.

## Features
- Browse CS2 grenade lineups by map, side and grenade type
- View lineup details with descriptions
- Watch associated videos (via Telegram)

## Recent Updates
- ✅ Security cleanup completed (removed compromised Telegram Bot Token)
- ✅ Git cleanup completed (fixed .gitignore, removed sensitive data)
- ✅ Project foundation updated (package.json, TypeScript configs, Vite config)
- ✅ Database layer fixed (implemented consistent database approach)
- ✅ API implementation improved (validation, pagination, error handling)
- ✅ Frontend API client verified (existing implementation)
- ✅ All core functionality properly structured

## Development Setup

### Prerequisites
- Node.js (>=14.x)
- PostgreSQL database

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Database Setup
1. Create a PostgreSQL database (e.g., `cs2_nades`)
2. Set environment variables in `.env` file:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=cs2_nades
DB_PASSWORD=postgres
DB_PORT=5432
```

### Running the Application

1. **Start the database server** (if not running)
2. **Run the backend server**:
```bash
npm run server
```

3. **Run the frontend application**:
```bash
npm run dev
```

### API Endpoints
- `GET /api/maps` - Get all maps
- `GET /api/maps/:id` - Get a single map
- `GET /api/maps/:id/lineups` - Get lineups for a map
- `GET /api/lineups/:id` - Get a single lineup

### Environment Variables
- `PORT` - Server port (default: 3000)
- `DB_USER` - Database user
- `DB_HOST` - Database host
- `DB_NAME` - Database name
- `DB_PASSWORD` - Database password
- `DB_PORT` - Database port

## Deployment
The application is designed to run in a Telegram Mini App environment and will require Telegram WebApp integration for full functionality.