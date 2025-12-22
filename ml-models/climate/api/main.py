# ml-models/climate/api/main.py
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

from climate_risk_analyzer import ClimateRiskAnalyzer

app = FastAPI(
    title="Climate Risk Analysis API",
    description="AI-powered Climate Risk Assessment for real estate properties",
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
climate_analyzer = ClimateRiskAnalyzer()

# Request/Response models
class ClimateAnalysisRequest(BaseModel):
    property_id: str
    latitude: float
    longitude: float
    elevation: float
    property_data: Optional[Dict] = {}

class ClimateAnalysisResponse(BaseModel):
    analysis_id: str
    property_id: str
    overall_risk_score: int
    grade: str
    timeline: Dict
    specific_risks: Dict
    insurance_projections: Dict
    mitigation_strategies: List[Dict]
    safer_alternatives: List[Dict]
    confidence_score: float
    analyzed_at: str

@app.get("/")
async def root():
    return {
        "service": "Climate Risk Analysis API",
        "status": "operational",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "POST /api/v1/climate/analyze",
            "health": "GET /health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        models_loaded = (
            climate_analyzer.flood_model is not None and
            climate_analyzer.wildfire_model is not None
        )
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "models_loaded": models_loaded
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "error": str(e)}
        )

@app.post("/api/v1/climate/analyze", response_model=ClimateAnalysisResponse)
async def analyze_climate_risk(request: ClimateAnalysisRequest):
    """
    Analyze climate risk for a property
    """
    analysis_id = str(uuid.uuid4())
    
    try:
        print(f"Starting Climate Risk analysis {analysis_id} for property {request.property_id}...")
        
        result = climate_analyzer.analyze_100_year_risk(
            latitude=request.latitude,
            longitude=request.longitude,
            elevation=request.elevation,
            property_data=request.property_data
        )
        
        response = {
            "analysis_id": analysis_id,
            "property_id": request.property_id,
            "overall_risk_score": result['overall_risk_score'],
            "grade": result['grade'],
            "timeline": result['timeline'],
            "specific_risks": result['specific_risks'],
            "insurance_projections": result['insurance_projections'],
            "mitigation_strategies": result['mitigation_strategies'],
            "safer_alternatives": result['safer_alternatives'],
            "confidence_score": result['confidence_score'],
            "analyzed_at": result['last_updated']
        }
        
        print(f"Climate Risk analysis {analysis_id} completed. Score: {result['overall_risk_score']}")
        
        return response
        
    except Exception as e:
        print(f"Analysis failed for {analysis_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
