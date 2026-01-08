"""
=============================================================================
API ROUTES: RECOMMENDATION ENGINE
REST-iN-U Platform - Recommendation API Endpoints
=============================================================================
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
import sys
sys.path.append('..')

from ai_ml.recommendation_engine import RecommendationEngine
import redis
import os
from sqlalchemy import create_engine

# Initialize Redis client
redis_client = None
try:
    redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
    redis_client = redis.from_url(redis_url, decode_responses=True)
except Exception as e:
    print(f"Redis connection failed: {e}")

# Initialize DB client
db_client = None
try:
    db_url = os.getenv('DATABASE_URL')
    if db_url:
        # SQLAlchemy requires 'postgresql' instead of 'postgres'
        if db_url.startswith('postgres://'):
            db_url = db_url.replace('postgres://', 'postgresql://', 1)

        db_client = create_engine(db_url)
        # Verify connection
        with db_client.connect() as conn:
            pass
        print("Database connection successful")
    else:
        print("DATABASE_URL not set")
except Exception as e:
    print(f"Database connection failed: {e}")
    db_client = None

# Initialize recommendation engine
recommendation_engine = RecommendationEngine(
    redis_client=redis_client,
    db_client=db_client
)

# Create blueprint
recommendations_bp = Blueprint('recommendations', __name__, 
                              url_prefix='/api/ai-ml/recommendations')


@recommendations_bp.route('/', methods=['POST'])
def get_recommendations():
    """
    Get personalized property recommendations
    
    Request Body:
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
    
    Response:
    {
        "success": true,
        "data": {
            "recommendations": [
                {
                    "property_id": "PROP-001",
                    "score": 0.95,
                    "explanation": "Matches your preferences",
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
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'user_id' not in data:
            return jsonify({
                "success": False,
                "error": "user_id is required"
            }), 400
        
        user_id = data['user_id']
        limit = data.get('limit', 20)
        filters = data.get('filters', {})
        
        # Validate limit
        if limit < 1 or limit > 100:
            return jsonify({
                "success": False,
                "error": "limit must be between 1 and 100"
            }), 400
        
        # Get recommendations
        recommendations = recommendation_engine.get_recommendations(
            user_id=user_id,
            limit=limit,
            filters=filters
        )
        
        # Format response
        return jsonify({
            "success": True,
            "data": {
                "recommendations": [
                    {
                        "property_id": r.property_id,
                        "score": round(r.score, 3),
                        "explanation": r.explanation,
                        "source": r.source
                    }
                    for r in recommendations
                ],
                "metadata": {
                    "user_id": user_id,
                    "count": len(recommendations),
                    "generated_at": datetime.now().isoformat(),
                    "cache_hit": False  # TODO: Track cache hits
                }
            }
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@recommendations_bp.route('/invalidate', methods=['POST'])
def invalidate_cache():
    """
    Invalidate cached recommendations for a user
    
    Request Body:
    {
        "user_id": "user-123"
    }
    
    Response:
    {
        "success": true,
        "message": "Cache invalidated for user user-123"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'user_id' not in data:
            return jsonify({
                "success": False,
                "error": "user_id is required"
            }), 400
        
        user_id = data['user_id']
        recommendation_engine.invalidate_cache(user_id)
        
        return jsonify({
            "success": True,
            "message": f"Cache invalidated for user {user_id}"
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@recommendations_bp.route('/similar/<property_id>', methods=['GET'])
def get_similar_properties(property_id: str):
    """
    Get properties similar to a given property
    
    Query Parameters:
    - limit: Number of similar properties (default: 10)
    
    Response:
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
    """
    try:
        limit = request.args.get('limit', 10, type=int)
        
        # TODO: Implement similar property search
        # For now, return empty list
        return jsonify({
            "success": True,
            "data": {
                "property_id": property_id,
                "similar_properties": []
            }
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@recommendations_bp.route('/trending', methods=['GET'])
def get_trending_properties():
    """
    Get trending properties (most viewed in last 7 days)
    
    Query Parameters:
    - limit: Number of properties (default: 20)
    - city: Filter by city (optional)
    
    Response:
    {
        "success": true,
        "data": {
            "trending_properties": [
                {
                    "property_id": "PROP-001",
                    "view_count": 1250,
                    "trend_score": 0.95
                }
            ],
            "metadata": {
                "period": "7_days",
                "count": 20
            }
        }
    }
    """
    try:
        limit = request.args.get('limit', 20, type=int)
        city = request.args.get('city', None)
        
        filters = {}
        if city:
            filters['city'] = city
        
        # Get trending properties
        trending = recommendation_engine._get_trending_properties(limit, filters)
        
        return jsonify({
            "success": True,
            "data": {
                "trending_properties": [
                    {
                        "property_id": t.property_id,
                        "score": round(t.score, 3),
                        "explanation": t.explanation
                    }
                    for t in trending
                ],
                "metadata": {
                    "period": "7_days",
                    "count": len(trending)
                }
            }
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


def register_recommendation_routes(app):
    """Register recommendation routes with Flask app"""
    app.register_blueprint(recommendations_bp)
    return app


# Update main routes.py to include recommendations
def update_main_routes():
    """
    Add this to ai_ml/routes.py:
    
    from ai_ml.recommendation_routes import register_recommendation_routes
    
    # In register_routes function:
    register_recommendation_routes(app)
    """
    pass
