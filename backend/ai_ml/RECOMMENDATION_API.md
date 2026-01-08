# Recommendation Engine API Documentation

# Overview

The Recommendation Engine provides personalized property recommendations using a hybrid machine learning approach combining collaborative filtering and content-based filtering.

# Architecture

- **Collaborative Filtering**: User-based similarity matching
- **Content-Based Filtering**: Property feature matching
- **Hybrid Model**: Weighted combination (50/50 default)
- **Caching**: Redis with 1-hour TTL
- **Cold Start**: Trending properties for new users

# API Endpoints

## 1. Get Recommendations

**POST** `/api/ai-ml/recommendations/`

Get personalized property recommendations for a user.

**Request Body:**

```json
{
  "user_id": "user-123",
  "limit": 20,
  "filters": {
    "price_min": 1000000,
    "price_max": 5000000,
    "city": "Mumbai",
    "bedrooms": [2, 3]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "property_id": "PROP-001",
        "score": 0.95,
        "explanation": "Matches your preferences; Users with similar tastes liked this property",
        "source": "hybrid"
      }
    ],
    "metadata": {
      "user_id": "user-123",
      "count": 20,
      "generated_at": "2026-01-06T16:20:00Z",
      "cache_hit": false
    }
  }
}
```

**Parameters:**

- `user_id` (required): User identifier
- `limit` (optional): Number of recommendations (1-100, default: 20)
- `filters` (optional): Filter criteria

**Response Fields:**

- `property_id`: Property identifier
- `score`: Recommendation score (0-1)
- `explanation`: Human-readable reason
- `source`: 'hybrid', 'collaborative', 'content-based', or 'trending'

---

## 2. Invalidate Cache

**POST** `/api/ai-ml/recommendations/invalidate`

Invalidate cached recommendations for a user (e.g., after new interaction).

**Request Body:**

```json
{
  "user_id": "user-123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Cache invalidated for user user-123"
}
```

---

## 3. Get Similar Properties

**GET** `/api/ai-ml/recommendations/similar/{property_id}`

Get properties similar to a given property.

**Query Parameters:**

- `limit` (optional): Number of similar properties (default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "property_id": "PROP-001",
    "similar_properties": [
      {
        "property_id": "PROP-002",
        "similarity_score": 0.92,
        "reason": "Similar location and features"
      }
    ]
  }
}
```

---

## 4. Get Trending Properties

**GET** `/api/ai-ml/recommendations/trending`

Get trending properties (most viewed in last 7 days).

**Query Parameters:**

- `limit` (optional): Number of properties (default: 20)
- `city` (optional): Filter by city

**Response:**

```json
{
  "success": true,
  "data": {
    "trending_properties": [
      {
        "property_id": "PROP-001",
        "score": 0.95,
        "explanation": "Trending property in your area"
      }
    ],
    "metadata": {
      "period": "7_days",
      "count": 20
    }
  }
}
```

---

# Performance

## Targets

- Response time: <200ms (p95)
- Cache hit rate: >70%
- Recommendation accuracy: >70% precision

## Optimization

- Redis caching (1-hour TTL)
- Pre-computed similarity matrices
- Batch processing for model updates

---

# Error Handling

## Error Responses

```json
{
  "success": false,
  "error": "Error message"
}
```

## HTTP Status Codes

- `200`: Success
- `400`: Bad request (invalid parameters)
- `500`: Internal server error

## Fallback Behavior

- **Cache unavailable**: Compute recommendations on-the-fly
- **Database error**: Return trending properties
- **New user (cold start)**: Return trending properties
- **No similar users**: Use content-based filtering only

---

# Usage Examples

## Python

```python
import requests

# Get recommendations
response = requests.post(
    'http://localhost:5000/api/ai-ml/recommendations/',
    json={
        'user_id': 'user-123',
        'limit': 10,
        'filters': {
            'city': 'Mumbai',
            'price_max': 5000000
        }
    }
)

recommendations = response.json()['data']['recommendations']
for rec in recommendations:
    print(f"{rec['property_id']}: {rec['score']} - {rec['explanation']}")
```

## JavaScript

```javascript
// Get recommendations
const response = await fetch('/api/ai-ml/recommendations/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'user-123',
    limit: 10,
    filters: {
      city: 'Mumbai',
      price_max: 5000000
    }
  })
});

const data = await response.json();
const recommendations = data.data.recommendations;
```

---

# Configuration

## Environment Variables

```bash
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://...
```

## Engine Parameters

```python
engine = RecommendationEngine(
    redis_client=redis_client,
    db_client=prisma_client
)

# Adjust weights
engine.cf_weight = 0.6  # Collaborative filtering
engine.cb_weight = 0.4  # Content-based

# Adjust cache TTL
engine.cache_ttl = 7200  # 2 hours

# Adjust minimum interactions for personalization
engine.min_interactions = 10
```

---

# Monitoring

## Key Metrics

- Recommendation requests per minute
- Cache hit rate
- Average response time
- Error rate
- User engagement (click-through rate)

## Logging

All operations are logged with INFO level:

```
INFO: Getting recommendations for user user-123, limit=20
INFO: Cache hit for user user-123
INFO: Cached 20 recommendations for user user-123
```

---

# Future Enhancements

- Deep learning models (neural collaborative filtering)
- Real-time model updates
- A/B testing framework
- Explainable AI (detailed explanations)
- Multi-armed bandit for exploration/exploitation
