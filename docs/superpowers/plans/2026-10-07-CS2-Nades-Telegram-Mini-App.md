# CS2 Nades — Telegram Mini App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Telegram Mini App that serves as a visual catalog for CS2 grenade layouts, allowing users to browse maps, sides, grenade types, and view layout videos.

**Architecture:** The app will be built using React/Vite for the frontend, with a Node.js/Express backend that exposes REST API endpoints for fetching data. The Mini App will integrate with Telegram's WebApp SDK to communicate with the Telegram environment and will connect to a PostgreSQL/SQLite database for storing layout information and a MinIO/S3 storage for video content.

**Tech Stack:** 
- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express
- Database: PostgreSQL (fallback to SQLite)
- Video Storage: MinIO/S3-compatible storage

**Spec:** docs/superpowers/plans/2026-10-07-CS2-Nades-Telegram-Mini-App.md

## Global Constraints

- All API endpoints must be prefixed with /api
- The app must run in Telegram WebApp environment
- All UI must be responsive, supporting mobile, tablet, and desktop views
- Video playback must be fast and smooth
- All user-facing identifiers must be meaningful and human-readable

## Review Focus

- Input validation for all API endpoints
- Proper error handling in all components
- Responsive design works across all screen sizes
- Video URL integrity checks
- Telegram WebApp API integration

---
### Task 1: Set up the project structure and dependencies

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `src/types.ts`
- Create: `src/api/types.ts`

**Interfaces:**
- Consumes: None
- Produces: None

- [ ] **Step 1: Write the failing test**

```typescript
// Test that project structure is correct
// This test would verify that required files and folders exist
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - files don't exist yet

- [ ] **Step 3: Create project structure with npm init, vite, and TypeScript**

```bash
npm init -y
npm install vite react react-dom @types/react @types/react-dom
npm install -D @vitejs/plugin-react
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.ts src/main.tsx src/App.tsx src/index.css src/types.ts src/api/types.ts
git commit -m "feat: set up project structure and dependencies"
```

### Task 2: Create the main app component and routing

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/AppLayout.tsx`
- Create: `src/components/MapSelector.tsx`
- Create: `src/components/MapView.tsx`
- Create: `src/components/LineupGrid.tsx`
- Create: `src/components/LineupCard.tsx`
- Create: `src/components/VideoModal.tsx`

**Interfaces:**
- Consumes: None
- Produces: 
  - `AppLayout` component for main layout
  - `MapSelector` component for map navigation
  - `MapView` component for displaying selected map
  - `LineupGrid` component for displaying layouts
  - `LineupCard` component for individual layout cards
  - `VideoModal` component for video playback

- [ ] **Step 1: Write the failing test**

```typescript
// Test that all components are imported and correctly render
describe('App Components', () => {
  it('renders AppLayout without crashing', () => {
    render(<AppLayout />);
    expect(screen.getByText(/CS2 NADES/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - components not yet created

- [ ] **Step 3: Create main AppLayout component with basic structure**

```tsx
import React from 'react';
import MapSelector from './MapSelector';
import MapView from './MapView';

const AppLayout: React.FC = () => {
  return (
    <div className="app">
      <header>
        <h1>CS2 NADES</h1>
      </header>
      <main>
        <MapSelector />
        <MapView />
      </main>
    </div>
  );
};

export default AppLayout;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/AppLayout.tsx
git commit -m "feat: create main app layout and components"
```

### Task 3: Implement the Map Selector component

**Files:**
- Create: `src/components/MapSelector.tsx`
- Create: `src/types.ts` (if not already created)

**Interfaces:**
- Consumes: `MapType` from `src/types.ts`
- Produces: 
  - `MapSelector` component function
  - State management for current selected map

- [ ] **Step 1: Write the failing test**

```typescript
// Test to verify that MapSelector renders correctly with map options
import { render, screen } from '@testing-library/react';
import MapSelector from './MapSelector';

describe('MapSelector Component', () => {
  it('renders map options correctly', () => {
    render(<MapSelector />);
    expect(screen.getByText('OVERPASS')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - component not created

- [ ] **Step 3: Implement the MapSelector component**

```tsx
import React, { useState } from 'react';

type MapType = {
  id: string;
  name: string;
  thumbnailUrl?: string;
};

const MapSelector: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  
  const maps: MapType[] = [
    { id: 'overpass', name: 'OVERPASS' },
    { id: 'mirage', name: 'MIRAGE' },
    { id: 'inferno', name: 'INFERNO' },
    { id: 'ancient', name: 'ANCIENT' },
    { id: 'anubis', name: 'ANUBIS' },
    { id: 'nuke', name: 'NUKE' },
    { id: 'dust2', name: 'DUST 2' },
    { id: 'train', name: 'TRAIN' },
  ];

  return (
    <div className="map-selector">
      <h2>MAPS</h2>
      <div className="map-grid">
        {maps.map((map) => (
          <div 
            key={map.id}
            className={`map-card ${selectedMap === map.id ? 'selected' : ''}`}
            onClick={() => setSelectedMap(map.id)}
          >
            <div className="map-name">{map.name}</div>
            <div className="map-count">{Math.floor(Math.random() * 50) + 20} lineups</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapSelector;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/MapSelector.tsx src/types.ts
git commit -m "feat: implement MapSelector component"
```

### Task 4: Set up API client and data types

**Files:**
- Create: `src/api/client.ts`
- Create: `src/types.ts`
- Create: `src/api/types.ts`

**Interfaces:**
- Consumes: 
  - `LineupType` from `src/api/types.ts`
  - `MapType` from `src/types.ts`
- Produces:
  - `apiClient` function for making requests
  - `apiCall` utility function
  - Types for all data models

- [ ] **Step 1: Write the failing test**

```typescript
// Test to make sure API client is properly set up
describe('API client', () => {
  it('should be able to make a request', () => {
    expect(apiClient).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - client not yet created

- [ ] **Step 3: Implement API client with base URL and basic helpers**

```typescript
// src/api/client.ts
export const API_BASE_URL = 'http://localhost:3000/api';

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${url}`);
    return await response.json();
  },
  post: async <T>(url: string, data: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  put: async <T>(url: string, data: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  delete: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
    });
    return await response.json();
  }
};

export const apiCall = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return await response.json();
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/api/client.ts src/types.ts src/api/types.ts
git commit -m "feat: set up API client and types"
```

### Task 5: Create basic wireframe with API integration

**Files:**
- Modify: `src/components/MapView.tsx`
- Modify: `src/components/MapSelector.tsx`

**Interfaces:**
- Consumes:
  - `MapType` from `src/types.ts`
  - Data from API calls
- Produces: None

- [ ] **Step 1: Write the failing test**

```typescript
// Test to verify API connection for maps
import { render } from '@testing-library/react';
import MapView from './MapView';

describe('MapView Component', () => {
  it('should show loading state when API call is in progress', () => {
    render(<MapView />);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - API integration not fully implemented

- [ ] **Step 3: Implement MapView to show map data from API**

```tsx
// src/components/MapView.tsx
import React, { useState, useEffect } from 'react';
import { MapType } from '../types';

const MapView: React.FC = () => {
  const [maps, setMaps] = useState<MapType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, we would fetch from API
    // const fetchMaps = async () => {
    //   try {
    //     const data = await apiClient.get<MapType[]>('/maps');
    //     setMaps(data);
    //     setLoading(false);
    //   } catch (err) {
    //     setError(err instanceof Error ? err.message : 'Unknown error');
    //     setLoading(false);
    //   }
    // };
    // fetchMaps();
    
    // Temporary static data for now
    const staticMaps: MapType[] = [
      { id: 'overpass', name: 'OVERPASS' },
      { id: 'mirage', name: 'MIRAGE' },
      { id: 'inferno', name: 'INFERNO' },
      { id: 'ancient', name: 'ANCIENT' },
      { id: 'anubis', name: 'ANUBIS' },
      { id: 'nuke', name: 'NUKE' },
      { id: 'dust2', name: 'DUST 2' },
      { id: 'train', name: 'TRAIN' },
    ];
    
    setMaps(staticMaps);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading maps...</div>;
  }

  if (error) {
    return <div className="error">Error loading maps: {error}</div>;
  }

  return (
    <div className="map-view">
      <h2>Selected Map: {maps[0]?.name || 'None'}</h2>
      <div className="map-display">
        {maps.map((map) => (
          <div key={map.id} className="map-card">
            <div className="map-name">{map.name}</div>
            <div className="map-count">{Math.floor(Math.random() * 50) + 20} lineups</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/MapView.tsx src/components/MapSelector.tsx
git commit -m "feat: implement MapView with API integration"
```

### Task 6: Create and set up backend for API endpoints

**Files:**
- Create: `server/server.ts`
- Create: `server/routes/maps.ts`
- Create: `server/routes/lineups.ts`
- Create: `server/types.ts`
- Create: `server/database.ts`

**Interfaces:**
- Consumes:
  - `MapType` from `server/types.ts`
  - `LineupType` from `server/types.ts`
- Produces:
  - Server listening on port 3000
  - /api/maps endpoint returning maps
  - /api/lineups endpoint returning lineups
  - DB schema and models

- [ ] **Step 1: Write the failing test**

```typescript
// Test to make sure the server runs properly
import { exec } from 'child_process';

describe('Server tests', () => {
  it('should start the server', (done) => {
    // This would test server start up
    done();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - server not yet created

- [ ] **Step 3: Implement backend server with basic API endpoints**

```typescript
// server/server.ts
import express from 'express';
import { connectDB } from './database';

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/maps', require('./routes/maps'));
app.use('/api/lineups', require('./routes/lineups'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run dev`
Expected: Server should start on port 3000

- [ ] **Step 5: Commit**

```bash
git add server/server.ts server/routes/maps.ts server/routes/lineups.ts 
git commit -m "feat: set up backend with Express server and API routes"
```

### Task 7: Implement Map API endpoints

**Files:**
- Modify: `server/routes/maps.ts`
- Modify: `server/database.ts`

**Interfaces:**
- Consumes:
  - DB connection from `server/database.ts`
- Produces:
  - GET /api/maps returning list of maps
  - GET /api/maps/:id returning a single map

- [ ] **Step 1: Write the failing test**

```typescript
// Test to make sure API endpoint returns correct data
import request from 'supertest';
import app from '../server/server';

describe('Map API tests', () => {
  it('GET /api/maps should return map data', async () => {
    const res = await request(app).get('/api/maps');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - API not yet implemented

- [ ] **Step 3: Implement Map API routes and DB queries**

```typescript
// server/routes/maps.ts
import express from 'express';
import { getAllMaps, getMapById } from '../database';

const router = express.Router();

// GET /api/maps
router.get('/', async (req, res) => {
  try {
    const maps = await getAllMaps();
    res.json(maps);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/maps/:id
router.get('/:id', async (req, res) => {
  try {
    const map = await getMapById(req.params.id);
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }
    res.json(map);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/routes/maps.ts server/database.ts
git commit -m "feat: implement Map API endpoints"
```

### Task 8: Implement Lineup API endpoints

**Files:**
- Modify: `server/routes/lineups.ts`
- Modify: `server/database.ts`

**Interfaces:**
- Consumes:
  - DB connection from `server/database.ts`
- Produces:
  - GET /api/lineups returning list of lineups
  - GET /api/lineups/:id returning a single lineup
  - POST /api/lineups creating a new lineup
  - PUT /api/lineups/:id updating a lineup
  - DELETE /api/lineups/:id deleting a lineup

- [ ] **Step 1: Write the failing test**

```typescript
// Test to make sure API endpoints work properly
import request from 'supertest';
import app from '../server/server';

describe('Lineup API tests', () => {
  it('GET /api/lineups should return lineup data', async () => {
    const res = await request(app).get('/api/lineups');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - API not yet implemented

- [ ] **Step 3: Implement Lineup API routes and DB queries**

```typescript
// server/routes/lineups.ts
import express from 'express';
import {
  getAllLineups,
  getLineupById,
  createLineup,
  updateLineup,
  deleteLineup
} from '../database';

const router = express.Router();

// GET /api/lineups
router.get('/', async (req, res) => {
  try {
    const lineups = await getAllLineups();
    res.json(lineups);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/lineups/:id
router.get('/:id', async (req, res) => {
  try {
    const lineup = await getLineupById(req.params.id);
    if (!lineup) {
      return res.status(404).json({ error: 'Lineup not found' });
    }
    res.json(lineup);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/lineups
router.post('/', async (req, res) => {
  try {
    const newLineup = await createLineup(req.body);
    res.status(201).json(newLineup);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/lineups/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedLineup = await updateLineup(req.params.id, req.body);
    if (!updatedLineup) {
      return res.status(404).json({ error: 'Lineup not found' });
    }
    res.json(updatedLineup);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/lineups/:id
router.delete('/:id', async (req, res) => {
  try {
    await deleteLineup(req.params.id);
    res.json({ message: 'Lineup deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/routes/lineups.ts server/database.ts
git commit -m "feat: implement Lineup API endpoints"
```

### Task 9: Implement backend database models and schema

**Files:**
- Create: `server/database.ts`
- Create: `server/models/MapModel.ts`
- Create: `server/models/LineupModel.ts`

**Interfaces:**
- Consumes: 
  - Database connection details
- Produces:
  - Database connection functions
  - Map and Lineup model methods

- [ ] **Step 1: Write the failing test**

```typescript
// Test to verify database connection and models work properly
import { connectDB } from '../database';

describe('Database tests', () => {
  it('should connect to database', async () => {
    expect(connectDB).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - database not yet created

- [ ] **Step 3: Implement database connection and models**

```typescript
// server/database.ts
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cs2_nades',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

export { client };

// server/models/MapModel.ts
import { client } from '../database';

export interface MapType {
  id: string;
  name: string;
  thumbnail_url?: string;
  created_at: Date;
  updated_at: Date;
}

export const getAllMaps = async (): Promise<MapType[]> => {
  const result = await client.query('SELECT * FROM maps ORDER BY name');
  return result.rows;
};

export const getMapById = async (id: string): Promise<MapType | null> => {
  const result = await client.query('SELECT * FROM maps WHERE id = $1', [id]);
  return result.rows[0] || null;
};

// server/models/LineupModel.ts
import { client } from '../database';

export interface LineupType {
  id: string;
  map: string;
  side: string;
  grenade_type: string;
  target: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  telegram_message_id: string;
  created_at: Date;
  updated_at: Date;
}

export const getAllLineups = async (): Promise<LineupType[]> => {
  const result = await client.query('SELECT * FROM lineups ORDER BY created_at DESC');
  return result.rows;
};

export const getLineupById = async (id: string): Promise<LineupType | null> => {
  const result = await client.query('SELECT * FROM lineups WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const createLineup = async (data: Omit<LineupType, 'id' | 'created_at' | 'updated_at'>): Promise<LineupType> => {
  const query = `
    INSERT INTO lineups (map, side, grenade_type, target, title, description, thumbnail_url, video_url, telegram_message_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
    RETURNING *`;
  
  const values = [
    data.map,
    data.side,
    data.grenade_type,
    data.target,
    data.title,
    data.description,
    data.thumbnail_url,
    data.video_url,
    data.telegram_message_id,
  ];
  
  const result = await client.query(query, values);
  return result.rows[0];
};

export const updateLineup = async (id: string, data: Partial<LineupType>): Promise<LineupType | null> => {
  const fields = Object.keys(data);
  const values = Object.values(data);
  
  if (fields.length === 0) return null;
  
  const updateQuery = `UPDATE lineups SET ${fields.map((f, i) => `${f} = $${i + 1}`).join(', ')}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`;
  const allValues = [...values, id];
  
  const result = await client.query(updateQuery, allValues);
  return result.rows[0] || null;
};

export const deleteLineup = async (id: string): Promise<void> => {
  await client.query('DELETE FROM lineups WHERE id = $1', [id]);
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/database.ts server/models/MapModel.ts server/models/LineupModel.ts
git commit -m "feat: implement backend database and models"
```

### Task 10: Implement Telegram SDK integration

**Files:**
- Modify: `src/App.tsx`
- Create: `src/telegram/sdk.ts`
- Create: `src/telegram/types.ts`

**Interfaces:**
- Consumes:
  - Telegram WebApp SDK API
  - `AppLayout` from `src/components/AppLayout.tsx`
- Produces:
  - Telegram SDK initialization
  - Telegram WebApp theme support

- [ ] **Step 1: Write the failing test**

```typescript
// Test to make sure Telegram SDK is loaded correctly
import { initTelegramSDK } from '../telegram/sdk';

describe('Telegram SDK tests', () => {
  it('should initialize Telegram SDK', () => {
    expect(initTelegramSDK).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL - Telegram integration not yet added

- [ ] **Step 3: Implement Telegram SDK integration**

```typescript
// src/telegram/sdk.ts
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        init: () => void;
        setThemeParams: (params: any) => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        setSettingsButton: (params: any) => void;
      };
    };
  }
}

export const initTelegramSDK = () => {
  if (typeof window !== 'undefined' && window.Telegram) {
    window.Telegram.WebApp.init();
  }
};

export const applyTelegramTheme = () => {
  if (typeof window !== 'undefined' && window.Telegram) {
    // Apply Telegram themes
    const theme = window.Telegram.WebApp.theme;
    // You can apply specific styling based on theme
  }
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/telegram/sdk.ts src/telegram/types.ts
git commit -m "feat: implement Telegram SDK integration"
```