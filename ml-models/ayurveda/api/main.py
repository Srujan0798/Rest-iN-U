from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import sys
import os

# Add parent directory to path to import analyzer
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ayurvedic_property_analyzer import AyurvedicPropertyAnalyzer

app = FastAPI(title="Ayurvedic Property Analyzer API")
analyzer = AyurvedicPropertyAnalyzer()

class PropertyData(BaseModel):
    temperature: Optional[float] = 20.0
    humidity: Optional[float] = 50.0
    wind_speed: Optional[float] = 10.0
    rainfall: Optional[float] = 1000.0
    elevation: Optional[float] = 100.0
    
    open_floor_plan: Optional[bool] = False
    high_ceilings: Optional[bool] = False
    south_facing_windows: Optional[int] = 0
    has_fireplace: Optional[bool] = False
    basement: Optional[bool] = False
    thick_walls: Optional[bool] = False
    
    entrance_direction: Optional[str] = 'east'
    construction_material: Optional[str] = 'brick'
    
    waterfront: Optional[bool] = False
    swimming_pool: Optional[bool] = False

@app.post("/analyze")
async def analyze_property(data: PropertyData):
    try:
        result = analyzer.analyze_property(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
