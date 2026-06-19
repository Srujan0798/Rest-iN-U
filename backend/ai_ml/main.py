from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import sys
import os
import logging
from datetime import datetime
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add parent directory to path to allow importing ai_ml module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai_ml.ai_ml_system import (
    MLPricePrediction, ComputerVisionInspector,
    AINegotiationAgent, MarketSentimentAnalyzer
)
from ai_ml.recommendation_engine import RecommendationEngine

# Import Prisma and Redis
from prisma import Prisma
import redis

# Initialize FastAPI app
app = FastAPI(title="AI/ML Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients
prisma = Prisma()
redis_client = None

# Initialize engines
price_predictor = MLPricePrediction()
cv_inspector = ComputerVisionInspector()
negotiation_agent = AINegotiationAgent()
sentiment_analyzer = MarketSentimentAnalyzer()
recommendation_engine = RecommendationEngine()

@app.on_event("startup")
async def startup():
    global redis_client
    # Connect to Prisma
    try:
        await prisma.connect()
        logger.info("Prisma connected")
    except Exception as e:
        logger.error(f"Prisma connection failed: {e}")

    # Connect to Redis
    try:
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        redis_client = redis.from_url(redis_url, decode_responses=True)
        logger.info("Redis connected")
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")

    # Configure RecommendationEngine
    recommendation_engine.db_client = prisma
    recommendation_engine.redis_client = redis_client

@app.on_event("shutdown")
async def shutdown():
    if prisma.is_connected():
        await prisma.disconnect()

# Pydantic Models for Requests
class PricePredictionRequest(BaseModel):
    id: Optional[str] = None
    price: float
    location_score: Optional[float] = None
    vastu_score: Optional[float] = None
    upcoming_metro: Optional[bool] = False
    age_years: Optional[float] = None
    market_data: Optional[Dict[str, Any]] = None

    class Config:
        extra = "allow"

class BatchPricePredictionRequest(BaseModel):
    properties: List[Dict[str, Any]]

class InspectionRequest(BaseModel):
    property_id: str
    images: List[Dict[str, Any]]

class NegotiationRequest(BaseModel):
    id: Optional[str] = None
    price: float
    days_on_market: Optional[int] = 30
    buyer_profile: Optional[Dict[str, Any]] = None

    class Config:
        extra = "allow"

class CounterOfferRequest(BaseModel):
    property: Dict[str, Any]
    current_offer: float
    rejection_reason: Optional[str] = None

class SentimentCompareRequest(BaseModel):
    locations: List[str]

class CompleteAnalysisRequest(BaseModel):
    property: Dict[str, Any]
    images: Optional[List[Dict[str, Any]]] = None
    buyer_profile: Optional[Dict[str, Any]] = None

class RecommendationRequest(BaseModel):
    user_id: str
    limit: Optional[int] = 20
    filters: Optional[Dict[str, Any]] = None

class InvalidateCacheRequest(BaseModel):
    user_id: str

# Health Check
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai_ml"}

# =============================================================================
# PRICE PREDICTION ENDPOINTS
# =============================================================================

@app.post("/api/ai-ml/price-prediction")
async def predict_price(request: PricePredictionRequest):
    try:
        data = request.dict(exclude={"market_data"})
        market_data = request.market_data

        prediction = price_predictor.predict_price(data, market_data)

        return {
            "success": True,
            "data": {
                "property_id": prediction.property_id,
                "current_price": prediction.current_price,
                "predictions": prediction.predictions,
                "confidence": prediction.confidence.value,
                "factors": prediction.factors,
                "comparable_sales": prediction.comparable_sales,
                "risk_factors": prediction.risk_factors,
                "opportunity_factors": prediction.opportunity_factors
            }
        }
    except Exception as e:
        logger.error(f"Error in price prediction: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/ai-ml/price-prediction/batch")
async def batch_price_prediction(request: BatchPricePredictionRequest):
    try:
        results = []
        for prop in request.properties:
            prediction = price_predictor.predict_price(prop)
            results.append({
                "property_id": prediction.property_id,
                "current_price": prediction.current_price,
                "predicted_1_year": prediction.predictions.get("1_year"),
                "confidence": prediction.confidence.value
            })
        return {"success": True, "data": results}
    except Exception as e:
        logger.error(f"Error in batch prediction: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# =============================================================================
# COMPUTER VISION ENDPOINTS
# =============================================================================

@app.post("/api/ai-ml/inspect")
async def inspect_property(request: InspectionRequest):
    try:
        report = cv_inspector.analyze_images(request.property_id, request.images)

        return {
            "success": True,
            "data": {
                "property_id": report.property_id,
                "inspection_date": report.inspection_date.isoformat(),
                "overall_condition": report.overall_condition,
                "total_repair_cost": report.total_repair_cost,
                "defects": [{
                    "defect_id": d.defect_id,
                    "category": d.category,
                    "description": d.description,
                    "location": d.location,
                    "severity": d.severity.value,
                    "confidence": d.confidence,
                    "repair_cost_estimate": d.repair_cost_estimate,
                    "urgency": d.urgency
                } for d in report.defects],
                "maintenance_recommendations": report.maintenance_recommendations,
                "safety_issues": report.safety_issues
            }
        }
    except Exception as e:
        logger.error(f"Error in inspection: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# =============================================================================
# NEGOTIATION ENDPOINTS
# =============================================================================

@app.post("/api/ai-ml/negotiation/analyze")
async def analyze_negotiation(request: NegotiationRequest):
    try:
        data = request.dict(exclude={"buyer_profile"})
        buyer_profile = request.buyer_profile

        result = negotiation_agent.analyze_negotiation(data, buyer_profile)

        return {
            "success": True,
            "data": {
                "property_id": result.property_id,
                "asking_price": result.asking_price,
                "recommended_offer": result.recommended_offer,
                "zopa": {
                    "min": result.zopa_min,
                    "max": result.zopa_max
                },
                "strategy": result.strategy.value,
                "counter_offers": result.counter_offers,
                "success_probability": result.success_probability,
                "talking_points": result.talking_points
            }
        }
    except Exception as e:
        logger.error(f"Error in negotiation analysis: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/ai-ml/negotiation/counter-offer")
async def get_counter_offer(request: CounterOfferRequest):
    try:
        result = negotiation_agent.analyze_negotiation(request.property)

        # Find next counter offer
        for counter in result.counter_offers:
            if counter['offer'] > request.current_offer:
                return {
                    "success": True,
                    "data": {
                        "suggested_offer": counter['offer'],
                        "rationale": counter['rationale'],
                        "round": counter['round']
                    }
                }

        return {
            "success": True,
            "data": {
                "message": "No further counter-offers recommended",
                "walk_away": True
            }
        }
    except Exception as e:
        logger.error(f"Error in counter offer: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# =============================================================================
# SENTIMENT ANALYSIS ENDPOINTS
# =============================================================================

@app.get("/api/ai-ml/sentiment/{location}")
async def get_market_sentiment(location: str, property_type: Optional[str] = None):
    try:
        result = sentiment_analyzer.analyze_sentiment(location, property_type)

        return {
            "success": True,
            "data": {
                "location": result.location,
                "analysis_date": result.analysis_date.isoformat(),
                "overall_sentiment": result.overall_sentiment,
                "confidence_index": result.confidence_index,
                "news_sentiment": result.news_sentiment,
                "social_sentiment": result.social_sentiment,
                "market_indicators": result.market_indicators,
                "trending_topics": result.trending_topics,
                "price_outlook": result.price_outlook
            }
        }
    except Exception as e:
        logger.error(f"Error in sentiment analysis: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/ai-ml/sentiment/compare")
async def compare_sentiments(request: SentimentCompareRequest):
    try:
        results = []
        for loc in request.locations:
            result = sentiment_analyzer.analyze_sentiment(loc)
            results.append({
                "location": result.location,
                "overall_sentiment": result.overall_sentiment,
                "confidence_index": result.confidence_index,
                "price_outlook": result.price_outlook
            })
        return {"success": True, "data": results}
    except Exception as e:
        logger.error(f"Error in sentiment compare: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# =============================================================================
# COMBINED AI ANALYSIS ENDPOINT
# =============================================================================

@app.post("/api/ai-ml/complete-analysis")
async def complete_ai_analysis(request: CompleteAnalysisRequest):
    try:
        property_data = request.property
        images = request.images or []
        buyer_profile = request.buyer_profile

        results = {}

        # Price Prediction
        price_pred = price_predictor.predict_price(property_data)
        results['price_prediction'] = {
            "1_year_forecast": price_pred.predictions.get("1_year"),
            "confidence": price_pred.confidence.value,
            "opportunities": price_pred.opportunity_factors[:2]
        }

        # Property Inspection (if images provided)
        if images:
            inspection = cv_inspector.analyze_images(property_data.get('id', 'unknown'), images)
            results['inspection'] = {
                "condition": inspection.overall_condition,
                "repair_cost": inspection.total_repair_cost,
                "defect_count": len(inspection.defects)
            }

        # Negotiation Analysis
        if property_data.get('price'):
            negotiation = negotiation_agent.analyze_negotiation(property_data, buyer_profile)
            results['negotiation'] = {
                "recommended_offer": negotiation.recommended_offer,
                "success_probability": negotiation.success_probability,
                "strategy": negotiation.strategy.value
            }

        # Market Sentiment
        if property_data.get('city'):
            sentiment = sentiment_analyzer.analyze_sentiment(property_data['city'])
            results['sentiment'] = {
                "overall": sentiment.overall_sentiment,
                "outlook": sentiment.price_outlook
            }

        return {
            "success": True,
            "data": {
                "property_id": property_data.get('id', 'unknown'),
                "analysis_date": datetime.now().isoformat(),
                "components": results
            }
        }
    except Exception as e:
        logger.error(f"Error in complete analysis: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# =============================================================================
# RECOMMENDATION ENDPOINTS
# =============================================================================

@app.post("/api/ai-ml/recommendations/")
async def get_recommendations(request: RecommendationRequest):
    try:
        # Validate limit
        if request.limit < 1 or request.limit > 100:
            raise HTTPException(status_code=400, detail="limit must be between 1 and 100")

        # Ensure we await the async method
        recommendations, cache_hit = await recommendation_engine.get_recommendations(
            user_id=request.user_id,
            limit=request.limit,
            filters=request.filters
        )

        return {
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
                    "user_id": request.user_id,
                    "count": len(recommendations),
                    "generated_at": datetime.now().isoformat(),
                    "cache_hit": cache_hit
                }
            }
        }
    except Exception as e:
        logger.error(f"Error in recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai-ml/recommendations/invalidate")
async def invalidate_recommendation_cache(request: InvalidateCacheRequest):
    try:
        recommendation_engine.invalidate_cache(request.user_id)
        return {
            "success": True,
            "message": f"Cache invalidated for user {request.user_id}"
        }
    except Exception as e:
        logger.error(f"Error invalidating cache: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai-ml/recommendations/similar/{property_id}")
async def get_similar_properties(property_id: str, limit: int = 10):
    try:
        similar_properties = await recommendation_engine.get_similar_properties(
            property_id=property_id,
            limit=limit
        )
        return {
            "success": True,
            "data": {
                "property_id": property_id,
                "similar_properties": [
                    {
                        "property_id": r.property_id,
                        "similarity_score": round(r.score, 3),
                        "reason": r.explanation
                    }
                    for r in similar_properties
                ]
            }
        }
    except Exception as e:
        logger.error(f"Error in similar properties: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai-ml/recommendations/trending")
async def get_trending_properties(limit: int = 20, city: Optional[str] = None):
    try:
        filters = {}
        if city:
            filters['city'] = city

        trending = await recommendation_engine.get_trending_properties(limit, filters)

        return {
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
        }
    except Exception as e:
        logger.error(f"Error in trending properties: {e}")
        raise HTTPException(status_code=500, detail=str(e))
