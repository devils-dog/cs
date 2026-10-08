# Stage 16 Plan: Привести API errors к единому формату

## Current State Analysis:
Looking at existing error handling in the code, I see:

1. Error responses use the pattern:
```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Internal server error"
  }
}
```

2. But we need to standardize all error responses to match the format specified in the plan.

## What Needs to Be Done:
1. Update all error responses throughout API routes to use standardized format
2. Ensure all existing error codes match plan's minimal error codes:
   - MAP_NOT_FOUND
   - LINEUP_NOT_FOUND  
   - INVALID_REQUEST
   - DATABASE_ERROR
   - INTERNAL_ERROR

## Implementation Plan:
1. Create standard error response function with proper structure
2. Update all routes to use this standardized error formatting
3. Ensure consistency across all API endpoints

## Files to Update:
- All API route files (`maps.ts`, `lineups.ts`)
- Possibly enhance error handler middleware

## Acceptance Criteria:
- ✅ All error responses use uniform format
- ✅ All error codes match plan requirements  
- ✅ No mixed error formats in responses
- ✅ Error messages are clear and consistent