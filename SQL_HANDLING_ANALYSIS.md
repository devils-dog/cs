# SQL File Handling Analysis and Solution

## Problem Identified
The application was encountering ENOENT errors when trying to access SQL files during runtime, specifically:
- "ENOENT: no such file or directory, open '/app/dist/db/seed/001_maps.sql'"
- "ENOENT: no such file or directory, open '/app/dist/db/migrations/001_initial.sql'"

These errors occurred because during the build process, SQL files were not being copied to the dist directory where the application expected to find them at runtime.

## Root Cause
The build process in `package.json` uses:
```
"build": "npm run build:client && npm run build:server"
```

The `build:server` command only compiles TypeScript files and doesn't handle copying non-TypeScript files like SQL files. Therefore, SQL files remained in their source locations (`server/db/`) but were not available in the compiled `dist/` directory.

## Solution Implemented
I've added a new script to `package.json` that ensures SQL files are copied to the dist directory:

```json
"copy:sql": "mkdir -p dist/db/migrations dist/db/seed && cp server/db/migrations/*.sql dist/db/migrations/ && cp server/db/seed/*.sql dist/db/seed/",
"build": "npm run build:client && npm run build:server && npm run copy:sql"
```

This ensures that when npm run build is executed:
1. Client-side build occurs
2. Server-side TypeScript compilation occurs  
3. SQL files are properly copied to the dist directory

This solution correctly addresses the runtime ENOENT errors by ensuring all necessary SQL files are present in the expected locations during deployment.