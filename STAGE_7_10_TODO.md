# Stage 7-10: Core Foundation Tasks

## What's Left to Do from the Plan:

### Stage 7: Добавить отсутствующий `index.html`
- Check for existence of `index.html` 
- Create proper Vite entry point if missing
- Ensure it properly connects to `/src/main.tsx`

### Stage 8: Разделить порты frontend и backend  
- Currently Vite is running on port 3000, which conflicts with Express
- Need to configure Vite to run on port 5173 (as per the plan)
- Configure Vite proxy for `/api/*` to forward to `http://localhost:3000`

### Stage 9: Исправить database layer
- Need to check the current `server/database.ts` implementation
- Determine if it exports `query`, `connect`, `close` or imports `pool` directly
- Implement one consistent approach from the plan recommendations

### Stage 10: Проверить PostgreSQL schema
- Verify we have proper `maps` and `lineups` tables
- Check the required columns and their constraints
- Ensure foreign key relationships are correct

## Current Status:
✅ Security cleanup completed
✅ Git cleanup completed  
✅ Package.json & TypeScript configurations updated

## Next Steps Plan:
1. Stage 7: Add missing `index.html`
2. Stage 8: Configure port separation
3. Stage 9: Fix database layer
4. Stage 10: Verify PostgreSQL schema

Let's implement these in order.