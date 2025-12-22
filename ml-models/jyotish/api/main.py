# ml-models/jyotish/api/main.py
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import uvicorn
import sys
import os
from datetime import datetime
import uuid

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from jyotish_property_analyzer import JyotishPropertyAnalyzer

app = FastAPI(
    title="Jyotish Analysis API",
    description="AI-powered Vedic Astrology for Real Estate",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize analyzer
jyotish_analyzer = JyotishPropertyAnalyzer()

# Request/Response models
class MuhuratRequest(BaseModel):
    property_id: str
    latitude: float
    longitude: float
    analysis_type: str = 'purchase'
    buyer_birth_data: Optional[Dict] = None

class MuhuratResponse(BaseModel):
    analysis_id: str
    property_id: str
    analysis_type: str
    analysis_period: str
    total_auspicious_windows: int
    best_muhurats: List[Dict]
    avoid_dates: List[Dict]
    general_guidance: List[str]
    analyzed_at: str

@app.get("/")
async def root():
    return {
        "service": "Jyotish Analysis API",
        "status": "operational",
        "version": "1.0.0",
        "endpoints": {
            "analyze_muhurat": "POST /api/v1/jyotish/muhurat",
            "health": "GET /health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/v1/jyotish/muhurat", response_model=MuhuratResponse)
async def analyze_muhurat(request: MuhuratRequest):
    """
    Analyze auspicious timings (Muhurat) for property transaction
    """
    analysis_id = str(uuid.uuid4())
    
    try:
        print(f"Starting Jyotish analysis {analysis_id} for property {request.property_id}...")
        
        result = jyotish_analyzer.analyze_property_muhurat(
            property_location={'lat': request.latitude, 'lng': request.longitude},
            buyer_birth_data=request.buyer_birth_data,
            analysis_type=request.analysis_type
        )
        
        response = {
            "analysis_id": analysis_id,
            "property_id": request.property_id,
            "analysis_type": result['analysis_type'],
            "analysis_period": result['analysis_period'],
            "total_auspicious_windows": result['total_auspicious_windows'],
            "best_muhurats": result['best_muhurats'],
            "avoid_dates": result['avoid_dates'],
            "general_guidance": result['general_guidance'],
            "analyzed_at": datetime.utcnow().isoformat()
        }
        
        print(f"Jyotish analysis {analysis_id} completed.")
        
        return response
        
    except Exception as e:
        print(f"Analysis failed for {analysis_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
