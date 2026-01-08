"""
REST-iN-U Trinity Platform AI Server
FastAPI microservice for Ancient Wisdom + AI/ML + Climate/IoT modules
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import sys
import os

# Add src to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import Trinity modules
from ancient_wisdom.feng_shui import FengShuiCalculator, Direction
from ancient_wisdom.numerology import NumerologyCalculator
from ai_ml.ai_ml_system import MLPricePrediction, AINegotiationAgent, MarketSentimentAnalyzer
from climate_iot.climate_risk import ClimateRiskModeler

app = FastAPI(
    title="REST-iN-U Trinity AI Server",
    description="Ancient Wisdom + AI/ML + Climate Intelligence",
    version="1.0.0"
)

# CORS for Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize calculators
feng_shui_calc = FengShuiCalculator()
numerology_calc = NumerologyCalculator()
price_predictor = MLPricePrediction()
negotiation_agent = AINegotiationAgent()
sentiment_analyzer = MarketSentimentAnalyzer()
climate_analyzer = ClimateRiskModeler()


class PropertyData(BaseModel):
    id: str
    price: float = 0
    location_score: float = 70
    vastu_score: float = 70
    age_years: int = 0
    days_on_market: int = 30
    facing_direction: str = "South"


class NumerologyRequest(BaseModel):
    address: str
    buyer_name: str
    buyer_dob: str


@app.get("/")
async def root():
    return {
        "service": "REST-iN-U Trinity AI Server",
        "modules": ["feng_shui", "numerology", "price_prediction", "negotiation", "sentiment", "climate"],
        "status": "running"
    }


@app.post("/api/feng-shui/analyze")
async def analyze_feng_shui(property_data: PropertyData):
    """Analyze property using Feng Shui principles"""
    try:
        direction_map = {
            "North": Direction.NORTH, "South": Direction.SOUTH,
            "East": Direction.EAST, "West": Direction.WEST,
            "Northeast": Direction.NORTHEAST, "Southeast": Direction.SOUTHEAST,
            "Northwest": Direction.NORTHWEST, "Southwest": Direction.SOUTHWEST
        }
        facing = direction_map.get(property_data.facing_direction, Direction.SOUTH)
        
        report = feng_shui_calc.analyze_property(
            {"id": property_data.id},
            facing
        )
        
        return {
            "property_id": report.property_id,
            "overall_score": report.overall_score,
            "element_balance": {k.value: v for k, v in report.element_balance.items()},
            "wealth_sectors": [d.value for d in report.wealth_sectors],
            "health_concerns": report.health_concerns,
            "remedies": report.remedies[:5],
            "enhancements": report.enhancements[:5]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/price/predict")
async def predict_price(property_data: PropertyData):
    """Predict property prices using ML"""
    try:
        prediction = price_predictor.predict_price({
            "id": property_data.id,
            "price": property_data.price,
            "location_score": property_data.location_score,
            "vastu_score": property_data.vastu_score,
            "age_years": property_data.age_years
        })
        
        return {
            "property_id": prediction.property_id,
            "current_price": prediction.current_price,
            "predictions": prediction.predictions,
            "confidence": prediction.confidence.value,
            "risk_factors": prediction.risk_factors,
            "opportunity_factors": prediction.opportunity_factors
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/negotiation/analyze")
async def analyze_negotiation(property_data: PropertyData):
    """AI negotiation strategy"""
    try:
        result = negotiation_agent.analyze_negotiation({
            "id": property_data.id,
            "price": property_data.price,
            "days_on_market": property_data.days_on_market
        })
        
        return {
            "property_id": result.property_id,
            "asking_price": result.asking_price,
            "recommended_offer": result.recommended_offer,
            "strategy": result.strategy.value,
            "success_probability": result.success_probability,
            "counter_offers": result.counter_offers,
            "talking_points": result.talking_points
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/sentiment/{location}")
async def get_market_sentiment(location: str):
    """Market sentiment analysis"""
    try:
        result = sentiment_analyzer.analyze_sentiment(location)
        
        return {
            "location": result.location,
            "overall_sentiment": result.overall_sentiment,
            "confidence_index": result.confidence_index,
            "market_indicators": result.market_indicators,
            "trending_topics": result.trending_topics,
            "price_outlook": result.price_outlook
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {"status": "healthy", "modules_loaded": 6}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
