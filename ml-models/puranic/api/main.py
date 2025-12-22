from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional, List
import sys
import os

# Add parent directory to path to import analyzer
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from puranic_land_analyzer import PuranicLandAnalyzer

app = FastAPI(title="Puranic Land Analysis API", version="1.0.0")

analyzer = PuranicLandAnalyzer()

class LandAnalysisRequest(BaseModel):
    latitude: float
    longitude: float
    elevation: float
    soil_data: Optional[Dict] = None

class LandAnalysisResponse(BaseModel):
    classification: str
    bhumi_tattva: Dict
    elemental_balance: Dict
    sacred_geography: Dict
    karmic_history: Dict
    dharmic_suitability: Dict
    overall_assessment: str
    scriptural_references: List[str]

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "puranic-land-analyzer"}

@app.post("/analyze", response_model=LandAnalysisResponse)
async def analyze_land(request: LandAnalysisRequest):
    try:
        result = analyzer.analyze_land_suitability(
            latitude=request.latitude,
            longitude=request.longitude,
            elevation=request.elevation,
            soil_data=request.soil_data
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
