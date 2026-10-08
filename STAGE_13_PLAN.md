# Stage 13 Plan: Добавить нормальную валидацию API

## Current State:
- The project has some basic validation using middleware
- But it's weak validation according to the plan

## What Needs to Be Done:
1. Implement proper API validation using Zod (as recommended)
2. Add validation for all API parameters:
   - map id → positive integer / UUID
   - lineup id → positive integer / UUID
   - side → allowed values  
   - grenade_type → allowed values
   - page → integer >= 1
   - limit → integer in limited range

## Implementation Plan:
1. Install zod if not already installed
2. Create validation schemas for all API parameters
3. Update controllers to use Zod validation
4. Implement proper error handling for validation failures

## Key Areas to Validate:
1. API route parameters (mapId, lineupId)
2. Query parameters (side, grenade_type, target, page, limit)
3. Format errors properly as per plan

## Acceptance Criteria:
- ✅ All API endpoints validate input properly
- ✅ Invalid input returns 400 instead of 500 
- ✅ Proper error messages in JSON format
- ✅ Zod schema validation implemented