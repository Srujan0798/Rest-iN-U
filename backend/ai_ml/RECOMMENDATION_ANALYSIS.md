# Recommendation Engine - Logic Flow & Data Dependencies

**Task 1.1 - Step 3: ANALYZE**
**Date**: January 6, 2026

---

# DATA FLOW DIAGRAM

```
[User] → [Interactions] → [Feature Extraction] → [ML Models] → [Scoring] → [Ranking] → [Cache] → [API] → [Frontend]
```

## Detailed Flow

1. **User Interactions** (Input)
   - PropertyView (property_id, user_id, timestamp, duration)
   - Favorite (property_id, user_id, timestamp)
   - SavedSearch (search_criteria, user_id, timestamp)

2. **Feature Extraction**
   - User Profile Features:
     - Preferred price range
     - Preferred locations
     - Preferred property types
     - Bedroom/bathroom preferences
     - Interaction patterns (time of day, frequency)

   - Property Features:
     - Price, bedrooms, bathrooms, sqft
     - Location (city, neighborhood, lat/long)
     - Property type, listing type
     - Vastu score, climate risk
     - Amenities, features

3. **ML Models** (Parallel Processing)

   A. **Collaborative Filtering**
      - Find similar users (cosine similarity on interaction matrix)
      - Get properties liked by similar users
      - Score: similarity_weight * property_interaction_score

   B. **Content-Based Filtering**
      - Extract user preference vector from interactions
      - Calculate property feature vectors
      - Score: cosine_similarity(user_vector, property_vector)

4. **Hybrid Scoring**
   - Final Score = (0.5 *CF_score) + (0.5* CB_score)
   - Apply business rules:
     - Boost new listings (recency)
     - Boost properties in saved search areas
     - Penalize already viewed properties
     - Diversity filter (max 3 from same neighborhood)

5. **Ranking & Filtering**
   - Sort by final score (descending)
   - Filter out:
     - Already purchased properties
     - Properties outside budget (if specified)
     - Inactive listings
   - Take top N (default: 20)

6. **Caching** (Redis)
   - Key: `recommendations:user:{user_id}`
   - TTL: 1 hour
   - Invalidate on: new interaction, new property listing

7. **API Response**
   - Return property IDs + scores
   - Include explanation (why recommended)
   - Metadata: generated_at, cache_hit, model_version

---

# DATA DEPENDENCIES

## Database Tables Required

1. **User** (Read)
   - id, userType, preferredLanguage
   - For: user profile, filtering

2. **Property** (Read)
   - All fields
   - For: feature extraction, content-based filtering

3. **PropertyView** (Read)
   - userId, propertyId, timestamp, duration
   - For: collaborative filtering, user preferences

4. **Favorite** (Read)
   - userId, propertyId, timestamp
   - For: collaborative filtering (strong signal)

5. **SavedSearch** (Read)
   - userId, searchCriteria
   - For: understanding user intent

## External Dependencies

1. **Redis**
   - For: caching recommendations
   - Operations: GET, SET, EXPIRE, DEL

2. **Python Libraries**
   - scikit-learn: cosine_similarity, TfidfVectorizer
   - pandas: data manipulation
   - numpy: matrix operations

3. **Prisma Client**
   - For: database queries
   - Operations: findMany, where, include

---

# LOGIC FLOW (Pseudocode)

```python
def get_recommendations(user_id, limit=20):
    # 1. Check cache
    cached = redis.get(f"recommendations:user:{user_id}")
    if cached:
        return cached
    
    # 2. Get user interaction history
    views = get_user_views(user_id)
    favorites = get_user_favorites(user_id)
    searches = get_user_searches(user_id)
    
    # 3. Extract user preferences
    user_profile = extract_user_profile(views, favorites, searches)
    
    # 4. Get candidate properties
    candidates = get_active_properties(exclude_viewed=True)
    
    # 5. Collaborative Filtering
    similar_users = find_similar_users(user_id, views, favorites)
    cf_scores = calculate_cf_scores(similar_users, candidates)
    
    # 6. Content-Based Filtering
    cb_scores = calculate_cb_scores(user_profile, candidates)
    
    # 7. Hybrid Scoring
    final_scores = {}
    for property_id in candidates:
        cf = cf_scores.get(property_id, 0)
        cb = cb_scores.get(property_id, 0)
        final_scores[property_id] = (0.5 * cf) + (0.5 * cb)
    
    # 8. Apply business rules
    final_scores = apply_business_rules(final_scores, user_profile)
    
    # 9. Rank and filter
    ranked = sort_by_score(final_scores, descending=True)
    top_n = ranked[:limit]
    
    # 10. Add explanations
    recommendations = add_explanations(top_n, user_profile)
    
    # 11. Cache results
    redis.setex(f"recommendations:user:{user_id}", 3600, recommendations)
    
    return recommendations
```

---

# PERFORMANCE CONSIDERATIONS

## Bottlenecks

1. **Database Queries**: Multiple table joins
   - Solution: Use indexes, limit fields

2. **Matrix Operations**: User-item similarity calculations
   - Solution: Pre-compute user similarity matrix (batch job)

3. **Feature Extraction**: Processing all properties
   - Solution: Limit to active listings, cache property features

## Optimization Strategies

1. **Pre-computation**:
   - User similarity matrix (updated daily)
   - Property feature vectors (updated on property change)

2. **Caching**:
   - User recommendations (1 hour TTL)
   - Similar users list (24 hour TTL)
   - Property features (until property updated)

3. **Batch Processing**:
   - Model retraining (daily at 2 AM)
   - Similarity matrix update (daily at 3 AM)

---

# ERROR HANDLING

## Scenarios

1. **New User (Cold Start)**:
   - Fallback: Return trending/popular properties
   - Criteria: Most viewed in last 7 days

2. **No Similar Users Found**:
   - Fallback: Use only content-based filtering
   - Weight: 100% content-based

3. **Database Error**:
   - Fallback: Return cached recommendations (if available)
   - Or: Return empty list with error message

4. **Redis Unavailable**:
   - Continue without caching
   - Log warning, compute recommendations on-the-fly

---

# STEP 3 COMPLETE ✅

**Time**: 10 minutes
**Next**: Step 4 - Decompose into atomic sub-steps
