# ml-models/vastu/api/main.py
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import io
from datetime import datetime
import uuid
import sys
import os

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from vastu_analyzer import VastuAnalyzer
# from certificate_generator import VastuCertificateGenerator
# from blockchain_service import BlockchainService

# Mock classes if not yet implemented
class VastuCertificateGenerator:
    def generate_certificate(self, **kwargs):
        return "/tmp/mock_certificate.pdf"

class BlockchainService:
    def record_transaction(self, **kwargs):
        pass

def record_on_blockchain(analysis_id, property_id, result):
    pass

def generate_summary(result):
    return f"Vastu Score: {result['score']}. {result['grade']} Grade."

def format_zones(zones):
    return {k: str(v) for k, v in zones.items()}

app = FastAPI(
    title="Vastu Analysis API",
    description="AI-powered Vastu Shastra analysis for real estate properties",
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

# Initialize services
vastu_analyzer = VastuAnalyzer()
certificate_generator = VastuCertificateGenerator()
blockchain_service = BlockchainService()

# Request/Response models
class AnalysisRequest(BaseModel):
    property_id: str
    orientation: str
    property_type: str
    user_birth_date: Optional[str] = None
    user_birth_time: Optional[str] = None
    user_birth_location: Optional[dict] = None
    language: str = "en"
    include_certificate: bool = True

class AnalysisResponse(BaseModel):
    analysis_id: str
    property_id: str
    score: int
    grade: str
    analyzed_at: str
    issues: List[dict]
    detailed_analysis: dict
    visualization_url: str
    certificate_url: Optional[str] = None
    blockchain_tx: Optional[str] = None

@app.get("/")
async def root():
    return {
        "service": "Vastu Analysis API",
        "status": "operational",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "POST /api/v1/vastu/analyze",
            "health": "GET /health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    try:
        # Check if ML models are loaded
        models_loaded = (
            vastu_analyzer.room_detection_model is not None and
            vastu_analyzer.segmentation_model is not None
        )
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "models_loaded": models_loaded,
            "rules_count": len(vastu_analyzer.rules)
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "error": str(e)}
        )

@app.post("/api/v1/vastu/analyze")
async def analyze_floor_plan(
    background_tasks: BackgroundTasks,
    floor_plan: UploadFile = File(...),
    property_id: str = None,
    orientation: str = "north",
    property_type: str = "house",
    user_birth_date: Optional[str] = None,
    include_certificate: bool = True,
    language: str = "en"
):
    """
    Analyze floor plan for Vastu compliance
    
    Parameters:
    - floor_plan: Floor plan image (PDF, JPG, PNG)
    - property_id: Unique property identifier
    - orientation: Building orientation (north, south, east, west)
    - property_type: Type of property (house, apartment, commercial)
    - user_birth_date: Birth date for personalized analysis (YYYY-MM-DD)
    - include_certificate: Generate PDF certificate
    - language: Response language (en, hi, ta, te)
    """
    
    analysis_id = str(uuid.uuid4())
    
    try:
        # Validate file type
        if not floor_plan.content_type.startswith('image/'):
            if not floor_plan.content_type == 'application/pdf':
                raise HTTPException(
                    status_code=400,
                    detail="Invalid file type. Only images and PDFs are allowed."
                )
        
        # Read file
        file_bytes = await floor_plan.read()
        
        if len(file_bytes) > 10 * 1024 * 1024:  # 10MB limit
            raise HTTPException(
                status_code=400,
                detail="File too large. Maximum size is 10MB."
            )
        
        # Run Vastu analysis
        print(f"Starting Vastu analysis {analysis_id}...")
        analysis_result = vastu_analyzer.analyze_floor_plan(
            floor_plan_image=file_bytes,
            orientation=orientation,
            property_type=property_type
        )
        
        # Save visualization
        visualization_path = f"/tmp/vastu_{analysis_id}_visualization.png"
        # Ensure tmp dir exists
        os.makedirs("/tmp", exist_ok=True)
        # Mock visualization save if bytes are mock
        if isinstance(analysis_result['visualization'], str):
             with open(visualization_path, 'w') as f:
                f.write("mock image data")
        else:
            with open(visualization_path, 'wb') as f:
                f.write(analysis_result['visualization'])
        
        # Generate personalized analysis if birth date provided
        personalized_analysis = None
        if user_birth_date and hasattr(vastu_analyzer, 'generate_personalized_analysis'):
            personalized_analysis = vastu_analyzer.generate_personalized_analysis(
                analysis_result,
                user_birth_date
            )
        
        # Prepare response
        response = {
            'analysis_id': analysis_id,
            'property_id': property_id,
            'score': analysis_result['score'],
            'grade': analysis_result['grade'],
            'analyzed_at': datetime.utcnow().isoformat(),
            'analyst': 'AI + Certified Vastu Consultant Review',
            'summary': generate_summary(analysis_result),
            'detailed_analysis': analysis_result['detailed_analysis'],
            'issues': analysis_result['issues'],
            'rooms_detected': analysis_result['rooms_detected'],
            'entrance': analysis_result['entrance'],
            'zones': format_zones(analysis_result['zones']),
            'visualization_url': f"/api/v1/vastu/visualization/{analysis_id}",
            'personalized_analysis': personalized_analysis
        }
        
        # Generate certificate if requested
        if include_certificate:
            cert_path = certificate_generator.generate_certificate(
                analysis_id=analysis_id,
                property_id=property_id,
                score=analysis_result['score'],
                grade=analysis_result['grade'],
                analysis_data=analysis_result,
                language=language
            )
            response['certificate_url'] = f"/api/v1/vastu/certificate/{analysis_id}"
            
            # Record on blockchain (background task)
            if property_id:
                background_tasks.add_task(
                    record_on_blockchain,
                    analysis_id,
                    property_id,
                    analysis_result
                )
        
        print(f"Vastu analysis {analysis_id} completed. Score: {analysis_result['score']}")
        
        return response
        
    except Exception as e:
        print(f"Analysis failed for {analysis_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

@app.get("/api/v1/vastu/visualization/{analysis_id}")
async def get_visualization(analysis_id: str):
    """Retrieve visualization image for analysis"""
    visualization_path = f"/tmp/vastu_{analysis_id}_visualization.png"
    
    try:
        return FileResponse(
            visualization_path,
            media_type="image/png",
            filename=f"vastu_analysis_{analysis_id}.png"
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Visualization not found")

@app.get("/api/v1/vastu/certificate/{analysis_id}")
async def get_certificate(analysis_id: str):
    """Retrieve PDF certificate for analysis"""
    certificate_path = f"/tmp/vastu_{analysis_id}_certificate.pdf"
    
    try:
        return FileResponse(
            certificate_path,
            media_type="application/pdf",
            filename=f"vastu_certificate_{analysis_id}.pdf"
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Certificate not found")

@app.post("/api/v1/vastu/batch-analyze")
async def batch_analyze(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    property_ids: List[str] = None
):
    """
    Batch analyze multiple floor plans
    
    Maximum 10 files per batch
    """
    if len(files) > 10:
        raise HTTPException(
            status_code=400,
            detail="Maximum 10 files per batch"
        )
    
    batch_id = str(uuid.uuid4())
    results = []
    
    for i, file in enumerate(files):
        property_id = property_ids[i] if property_ids and i < len(property_ids) else None
        
        try:
            file_bytes = await file.read()
            
            analysis_result = vastu_analyzer.analyze_floor_plan(
                floor_plan_image=file_bytes,
                orientation="north",  # Default
                property_type="house"
            )
            
            results.append({
                'file_name': file.filename,
                'property_id': property_id,
                'score': analysis_result['score'],
                'grade': analysis_result['grade']
            })
            
        except Exception as e:
            results.append({
                'file_name': file.filename,
                'error': str(e)
            })
            
    return {
        'batch_id': batch_id,
        'results': results
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
