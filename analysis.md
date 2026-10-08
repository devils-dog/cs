## Analysis of Nginx proxy_pass and Express Routing

### Understanding the current config:
```
location /api/ {
    proxy_pass http://backend:3000/;
}
```

### Key insights from nginx behavior:
1. When a request comes to `/api/maps`, it matches the location `/api/` and gets forwarded to `http://backend:3000/`
2. The trailing slash in `proxy_pass` tells nginx to replace the matched part of the URL (`/api/`) with what comes after the slash in `http://backend:3000/`
3. Therefore, `/api/maps` becomes `/maps` when forwarded to the backend service

The same applies to `/api/maps/123/lineups` -> it becomes `/maps/123/lineups` when forwarded

### The problem:
When Express routes are mounted with `/api/maps`, the routing will look for:
- `/` -> `/api/maps/`
- `/:id` -> `/api/maps/:id` 
- `/:id/lineups` -> `/api/maps/:id/lineups`

But the nginx proxy_pass removes the `/api/` prefix, so Express gets:
- `/` (which matches) 
- `/123` (which should match `/:id`)
- `/123/lineups` (which should match `/:id/lineups`)

### Solution approaches:
1. Remove trailing slash from proxy_pass directive or
2. Match the location pattern better to avoid path replacement issues

### Recommended nginx config:
```
location /api/ {
    proxy_pass http://backend:3000;
}
```

Or if using the trailing slash version that works differently:
```
location /api/ {
    proxy_pass http://backend:3000/;
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

But the first solution should work best, because we want the full path to reach the backend to preserve the route matching.

**The problem**: The current trailing slash in proxy_pass strips the path prefix that's needed for express to correctly handle routing.