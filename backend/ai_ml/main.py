import os
import logging
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from prisma import Prisma
from ai_ml.recommendation_engine import RecommendationEngine
import redis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_server")

# Database client
db = Prisma()

# Globals
engine: RecommendationEngine = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to DB
    logger.info("Connecting to database...")
    try:
        await db.connect()
        logger.info("Database connected.")
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        # We might want to exit here or continue with mock data if possible, but let's assume DB is critical.

    # Initialize Redis
    redis_host = os.getenv('REDIS_HOST', 'localhost')
    redis_port = int(os.getenv('REDIS_PORT', 6379))
    logger.info(f"Connecting to Redis at {redis_host}:{redis_port}")
    r = redis.Redis(host=redis_host, port=redis_port, db=0, decode_responses=True)

    # Initialize Engine
    global engine
    engine = RecommendationEngine(redis_client=r, db_client=db)

    yield

    # Disconnect
    logger.info("Disconnecting from database...")
    if db.is_connected():
        await db.disconnect()

app = FastAPI(lifespan=lifespan)

class RecommendationRequest(BaseModel):
    user_id: str
    limit: int = 20
    filters: Optional[Dict[str, Any]] = None

class PropertyFeatures(BaseModel):
    bedrooms: int
    bathrooms: float
    squareFeet: int
    city: str
    propertyType: str

@app.post("/recommend")
async def recommend(req: RecommendationRequest):
    if not engine:
        raise HTTPException(status_code=503, detail="Engine not initialized")

    try:
        # get_recommendations is synchronous in the existing engine class,
        # but if we update it to use Prisma (async), we need to await it.
        # I will update RecommendationEngine to be async.
        recommendations, is_cached = await engine.get_recommendations(
            user_id=req.user_id,
            limit=req.limit,
            filters=req.filters
        )

        return {
            "success": True,
            "cached": is_cached,
            "data": [
                {
                    "property_id": r.property_id,
                    "score": r.score,
                    "explanation": r.explanation,
                    "source": r.source
                } for r in recommendations
            ]
        }
    except Exception as e:
        logger.error(f"Error in recommendation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-price")
async def predict_price(features: PropertyFeatures):
    # Simple heuristic price prediction
    base_price = 5000000 # 50 Lakhs base

    price = base_price
    price += features.bedrooms * 1000000 # 10L per bedroom
    price += features.bathrooms * 500000 # 5L per bathroom
    price += features.squareFeet * 5000 # 5k per sqft

    # City multipliers
    city_mult = {
        "Mumbai": 2.0,
        "Delhi": 1.5,
        "Bangalore": 1.4,
        "Pune": 1.2
    }
    multiplier = city_mult.get(features.city, 1.0)

    final_price = price * multiplier

    return {
        "success": True,
        "predicted_price": final_price,
        "currency": "INR"
    }

@app.get("/health")
async def health():
    return {"status": "ok"}
