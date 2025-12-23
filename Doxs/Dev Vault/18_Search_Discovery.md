# 🔍 SEARCH & DISCOVERY OPTIMIZATION - COMPLETE GUIDE
## Production-Grade Elasticsearch & Geospatial Querying

> **Based On**: 1M+ property records | Sub-50ms query targets | Real map integration  
> **Purpose**: Instant, relevant search results for property buyers  
> **Coverage**: Elasticsearch, PostGIS, Geohashing, Autocomplete

---

## 📋 TABLE OF CONTENTS

### PART 1: SEARCH ENGINE ARCHITECTURE
1. [Elasticsearch vs Postgres Full-Text](#elastic-vs-postgres)
2. [Index Mapping Strategy](#mapping)
3. [Syncing Data (CDC)](#syncing)

### PART 2: GEOSPATIAL SEARCH
4. [Radius Search (PostGIS)](#radius-search)
5. [Polygon Search (Map Bounds)](#polygon-search)
6. [Geohashing for Clustering](#geohashing)

### PART 3: ADVANCED FEATURES
7. [Autocomplete & Suggesters](#autocomplete)
8. [Fuzzy Matching (Typos)](#fuzzy)
9. [Ranking Algorithms](#ranking)

---

## PART 1: SEARCH ENGINE ARCHITECTURE

<a name="elastic-vs-postgres"></a>
### 1. Elasticsearch vs Postgres Full-Text

**REALITY CHECK**:
- **Postgres**: Great for <100k rows. Simple. ACID compliant.
- **Elasticsearch**: Essential for >1M rows, fuzzy search, complex filtering, and geospatial aggregation.

**REST-iN-U Strategy**: Use **Postgres** for source of truth, sync to **Elasticsearch** for read-heavy search API.

```json
// File: elasticsearch/mappings/property.json
{
  "mappings": {
    "properties": {
      "title": { "type": "text", "analyzer": "english" },
      "description": { "type": "text", "analyzer": "english" },
      "price": { "type": "double" },
      "location": { "type": "geo_point" },
      "amenities": { "type": "keyword" },
      "vastu_score": { "type": "integer" },
      "created_at": { "type": "date" }
    }
  }
}
```

---

## PART 2: GEOSPATIAL SEARCH

<a name="radius-search"></a>
### 4. Radius Search - Real Production Code

**PRODUCTION STORY**: "Find properties near me" is the #1 feature.
Using Postgres `ST_DWithin` is fast if indexed correctly.

```sql
-- File: backend/src/db/queries/geo.sql
-- Find properties within 5km of user
SELECT 
  id, 
  title, 
  price,
  -- Calculate distance for sorting
  ST_Distance(
    location::geography, 
    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
  ) as distance_meters
FROM properties
WHERE 
  ST_DWithin(
    location::geography,
    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
    5000 -- meters
  )
ORDER BY distance_meters ASC
LIMIT 20;
```

<a name="geohashing"></a>
### 6. Geohashing for Map Clustering

**PROBLEM**: Loading 10,000 pins on a map crashes the browser.
**SOLUTION**: Server-side clustering using Geohashes.

```typescript
// File: backend/src/services/search/ClusterService.ts
import ngeohash from 'ngeohash';

function clusterProperties(properties: Property[], precision: number) {
    const clusters = {};
    
    properties.forEach(p => {
        const hash = ngeohash.encode(p.lat, p.lon, precision);
        if (!clusters[hash]) {
            clusters[hash] = { count: 0, lat: 0, lon: 0, ids: [] };
        }
        clusters[hash].count++;
        clusters[hash].lat += p.lat;
        clusters[hash].lon += p.lon;
        clusters[hash].ids.push(p.id);
    });
    
    // Average the coordinates for cluster center
    return Object.values(clusters).map(c => ({
        count: c.count,
        lat: c.lat / c.count,
        lon: c.lon / c.count,
        property_ids: c.ids
    }));
}
```

---

## PART 3: ADVANCED FEATURES

<a name="ranking"></a>
### 9. Ranking Algorithms - The "Secret Sauce"

**REALITY**: Sorting by "Price: Low to High" is boring.
**SMART SORT**:
1.  **Recency**: New listings get a boost.
2.  **Popularity**: Click-through rate (CTR) boost.
3.  **Completeness**: Listings with photos/descriptions rank higher.
4.  **Vastu Score**: REST-iN-U specific boost.

```json
// Elasticsearch Function Score Query
{
  "query": {
    "function_score": {
      "query": { "match_all": {} },
      "functions": [
        {
          "gauss": {
            "created_at": {
              "origin": "now",
              "scale": "7d",
              "decay": 0.5
            }
          }
        },
        {
          "field_value_factor": {
            "field": "vastu_score",
            "factor": 1.2,
            "modifier": "sqrt"
          }
        }
      ]
    }
  }
}
```

---

## REAL PRODUCTION ISSUES

### Issue #1: The "Zero Results" Dead End
**Scenario**: User searches "Bangalor" (typo). 0 results. User leaves.
**Fix**: Implement **Fuzzy Matching** (Levenshtein distance).
`"fuzziness": "AUTO"` in Elasticsearch handles 1-2 character edits automatically.

### Issue #2: Slow Map Pan/Zoom
**Scenario**: Re-fetching points on every pixel of map movement.
**Fix**: **Debounce** the search API call by 300ms. Only fetch when user STOPS moving the map.

---

## QUICK REFERENCE

### Performance Targets
- [ ] Text Search: <50ms
- [ ] Geo Search: <100ms
- [ ] Map Cluster: <200ms
- [ ] Index Sync Lag: <1s

**END OF GUIDE 18**
