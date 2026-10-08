# Error Response Tests

## Current Implementations

### Invalid map ID
Expected response format: 
```json
{
  "error": {
    "code": "INVALID_MAP_ID",
    "message": "Invalid map ID provided"
  }
}
```

### Invalid lineup ID 
Expected response format:
```json
{
  "error": {
    "code": "INVALID_LINEUP_ID",
    "message": "Invalid lineup ID provided"
  }
}
```

### Invalid query
Expected response format:
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid query parameters provided"
  }
}
```

### Not found
Expected response format:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Map not found"
  }
}
```

### Database error
Expected response format:
```json
{
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Database error occurred"
  }
}
```

### Unexpected exception
Expected response format:
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error"
  }
}
```