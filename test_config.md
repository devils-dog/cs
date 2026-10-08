# Nginx Proxy Configuration Analysis

## Current Config:
```
location /api/ {
    proxy_pass http://backend:3000/;
}
```

## Express Route Structure:
- `app.use('/api/maps', mapsRoutes)`
- `mapsRoutes` contains routes: '/', '/:id', '/:id/lineups'

## Questions:
1. When a request comes to `/api/maps`, what does it get forwarded to the backend as?
2. When a request comes to `/api/maps/123/lineups`, what does it get forwarded to the backend as?
3. What should the nginx config be to ensure correct forwarding?