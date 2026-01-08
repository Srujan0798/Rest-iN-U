# Backend Audit

## Security Analysis: `backend/src/routes/properties.ts`

## 1. Input Validation
- **Status**: Good. Uses `zod` schemas (`createPropertySchema`, `propertyListQuerySchema`) to validate request body and query parameters.
- **Improvement**: `features`, `amenities` etc. are `z.array(z.string()).default([])`. We might want to limit the string length to prevent DoS via massive strings.
- **Geo Validation**: `latitude` and `longitude` are validated as numbers, but not strictly within valid ranges (-90 to 90, -180 to 180).

## 2. Authentication & Authorization
- **Status**: Good. Uses `authenticate`, `optionalAuthenticate`, `requireAgent`.
- **Ownership Checks**: The endpoints `put /:id`, `delete /:id`, `post /:id/photos` correctly check if `req.user.agentId` matches `property.listingAgentId`.
- **Gap**: `post /:id/schedule-showing` does not check if the user is not the agent themselves (minor logic issue, but safe).

## 3. Rate Limiting
- **Status**: Implemented globally in `server.ts`. Not visible in this file but good practice.

## 4. Database Queries (Performance)
- **Status**: Uses `prisma.property.findMany` with pagination (`skip`/`take`).
- **N+1 Potential**:
  - `listingAgent` includes `user`.
  - `photos` are included with `take: 1`.
  - This is generally handled efficiently by Prisma using JOINs or batched queries.
- **Filtering**: Extensive filtering logic.
  - `contains` filter on `city` uses `mode: 'insensitive'`. This can be slow on large datasets without proper indexes (Postgres `pg_trgm` or similar).
  - Geo search does a bounding box search (`latitude` range, `longitude` range). This is decent but uses full table scan within ranges unless indexed.

## 5. Caching
- **Status**: Uses `cacheGet` and `cacheSet` for property lists and details.
- **Keys**: `PROPERTY_LIST` + query string. This is good but highly granular. High churn if many unique queries.
- **Invalidation**: `create`, `update`, `delete` clear patterns correctly.

## 6. Vulnerabilities
- **DoS via Pagination**: `limit` is capped at 100 in schema, which is safe.
- **DoS via Filter complexity**: `features` filter uses `hasEvery`. On arrays, this can be slow in Postgres without GIN index.

## Recommendations
1. **Indexes**: Ensure database has indexes on `city`, `price`, `propertyType`, `status`, and a GIN index on `features` array.
2. **Geo Index**: Use PostGIS for proper geo queries instead of bounding box if accuracy/performance at scale matters.
3. **Input limits**: Add `.max(100)` or similar to string arrays in Zod schema.
