# Nginx Routing Analysis

## Current Configuration Issue

Looking at the nginx.conf file:
```
location /api/ {
    proxy_pass http://backend:3000/;
}
```

## Problem Analysis

The current nginx configuration has a routing issue:

1. **Request URI**: `/api/maps`
2. **Current Nginx Behavior**: The `/api/` prefix is stripped during proxy_pass
3. **Backend receives**: `/maps` (instead of `/api/maps`)
4. **Expected Backend Route**: `/api/maps` (as defined in server/app.ts)

## Root Cause

The `proxy_pass` directive with a trailing slash (`http://backend:3000/`) causes Nginx to strip the location prefix (`/api/`) from the request URI before forwarding it to the backend.

## Correct Approaches

### Option 1: Remove trailing slash from proxy_pass
```
location /api/ {
    proxy_pass http://backend:3000;
}
```

However, this requires updating the backend route mounting to not include `/api/` prefix.

### Option 2: Use $request_uri in proxy_pass (if using proxy_pass with trailing slash)
```
location /api/ {
    proxy_pass http://backend:3000/$request_uri;
}
```

### Option 3: Use location without trailing slash (better approach)
```
location /api/ {
    proxy_pass http://backend:3000/;
}
```

But this still has the same issue.

## The Real Issue

Looking at the backend app.ts mounting:
```javascript
app.use('/api/maps', mapsRoutes);
app.use('/api/lineups', lineupsRoutes);
```

And the nginx configuration:
```nginx
location /api/ {
    proxy_pass http://backend:3000/;
}
```

The issue is that nginx needs to preserve the `/api/` prefix when forwarding requests.

## Recommendation

The configuration should be changed to:
```nginx
location /api/ {
    proxy_pass http://backend:3000/;
}
```

But this still has the core problem. The correct approach should be:
```nginx
location /api/ {
    proxy_pass http://backend:3000/;
}
```

Actually, let me recheck this more carefully. In this case, we need to look at what happens when:
- URI: `/api/maps` 
- With `location /api/ { proxy_pass http://backend:3000/; }`
- This should forward `/api/maps` to `http://backend:3000//api/maps` (which would be `/api/maps` in the backend) - Wait, no.

Actually, it would be:
- `/api/maps` → `http://backend:3000//api/maps` → the backend would see `/api/maps`
- This is correct!

Let me double-check by running a simpler analysis test:

## VERIFICATION: The nginx.conf is actually correct

Looking again, I realize that the current nginx configuration:
```
location /api/ {
    proxy_pass http://backend:3000/;
}
```

With `proxy_pass` ending in / (trailing slash), this means:
- Location matched: `/api/`
- URI to be passed: `/api/maps` 
- The trailing slash in proxy_pass config means to NOT use the location's prefix in the URI when forwarding
- So backend receives: `/maps` (since `/api/` prefix is stripped from the original request URI before proxy_pass processing)

Therefore, backend routes need to be:
```javascript
app.use('/maps', mapsRoutes);
app.use('/lineups', lineupsRoutes); 
```

## CONCLUSION

The Nginx config is correct in the sense that it preserves the original /api/ prefix when directing to the backend. But looking at the backend mounting, it expects /api prefix, so there's a mismatch.

If we want to keep the existing backend routes (`/api/maps`, `/api/lineups`), then the proxy_pass should be adjusted.

But since backend routes require `/api/` prefix, and nginx is routing these through `/api/` location, we actually don't need to change the Nginx configuration.

Wait, I think I misunderstood how proxy_pass works. Let me be clearer:

For request `/api/maps`:
1. nginx matches `location /api/`
2. `proxy_pass` with trailing slash `http://backend:3000/` strips the matched location (`/api/`) from the URI
3. This would result in `http://backend:3000/maps` - i.e., only `/maps` is forwarded, not `/api/maps`
4. The backend at `/maps` would receive a request to `/maps` instead of `/api/maps`

So there's definitely an issue here.