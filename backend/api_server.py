"""
=============================================================================
DHARMA REALTY PLATFORM - UNIFIED API SERVER
Flask Application with all Sprint Module Routes
=============================================================================
"""

from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

# Import route registrars
from ancient_wisdom.routes import register_routes as register_ancient_wisdom
from climate_iot.routes import register_routes as register_climate_iot
from blockchain.routes import register_routes as register_blockchain
from ai_ml.routes import register_routes as register_ai_ml
from agent_crm.routes import register_routes as register_agent_crm


def create_app():
    """Create and configure Flask application"""
    
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app, origins=["http://localhost:3000", "https://dharmarealty.com"])
    
    # Configuration
    app.config['JSON_SORT_KEYS'] = False
    app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
    
    # Register all module routes
    register_ancient_wisdom(app)
    register_climate_iot(app)
    register_blockchain(app)
    register_ai_ml(app)
    register_agent_crm(app)
    
    # =========================================================================
    # CORE ENDPOINTS
    # =========================================================================
    
    @app.route('/')
    def index():
        """API root endpoint"""
        return jsonify({
            "name": "Dharma Realty Platform API",
            "version": "1.0.0",
            "status": "running",
            "timestamp": datetime.now().isoformat(),
            "modules": [
                {"name": "Ancient Wisdom", "prefix": "/api/ancient-wisdom"},
                {"name": "Climate & IoT", "prefix": "/api/climate-iot"},
                {"name": "Blockchain", "prefix": "/api/blockchain"},
                {"name": "AI/ML", "prefix": "/api/ai-ml"},
                {"name": "Agent CRM", "prefix": "/api/crm"}
            ]
        })
    
    @app.route('/health')
    def health():
        """Health check endpoint"""
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.now().isoformat()
        })
    
    @app.route('/api/docs')
    def api_docs():
        """API documentation"""
        return jsonify({
            "documentation_url": "https://docs.dharmarealty.com/api",
            "endpoints": {
                "ancient_wisdom": {
                    "POST /api/ancient-wisdom/feng-shui/analyze": "Analyze property Feng Shui",
                    "GET /api/ancient-wisdom/feng-shui/directions": "Get Feng Shui directions",
                    "GET /api/ancient-wisdom/astrology/panchang": "Get today's Panchang",
                    "GET /api/ancient-wisdom/astrology/griha-pravesh": "Get Griha Pravesh dates",
                    "POST /api/ancient-wisdom/numerology/profile": "Calculate numerology profile",
                    "POST /api/ancient-wisdom/numerology/property": "Analyze property numerology",
                    "POST /api/ancient-wisdom/land-energy/assess": "Assess land energy",
                    "POST /api/ancient-wisdom/complete-analysis": "Complete ancient wisdom analysis"
                },
                "climate_iot": {
                    "POST /api/climate-iot/climate-risk/assess": "Assess climate risk",
                    "GET /api/climate-iot/climate-risk/scenarios": "Get IPCC scenarios",
                    "POST /api/climate-iot/iot/sensors": "Register IoT sensor",
                    "GET /api/climate-iot/iot/sensors/<property_id>": "Get sensors",
                    "POST /api/climate-iot/iot/readings": "Ingest sensor reading",
                    "GET /api/climate-iot/iot/alerts/<property_id>": "Get alerts",
                    "GET /api/climate-iot/iot/comfort/<property_id>": "Get comfort score"
                },
                "blockchain": {
                    "POST /api/blockchain/contracts": "Deploy smart contract",
                    "POST /api/blockchain/nft/mint": "Mint property NFT",
                    "POST /api/blockchain/nft/transfer": "Transfer NFT",
                    "POST /api/blockchain/fractional/create": "Create fractional property",
                    "POST /api/blockchain/fractional/purchase": "Purchase shares",
                    "POST /api/blockchain/dao/proposals": "Create DAO proposal",
                    "POST /api/blockchain/dao/vote": "Vote on proposal",
                    "GET /api/blockchain/transactions": "Get transaction history"
                },
                "ai_ml": {
                    "POST /api/ai-ml/price-prediction": "Predict property prices",
                    "POST /api/ai-ml/inspect": "Inspect property images",
                    "POST /api/ai-ml/negotiation/analyze": "Get negotiation recommendations",
                    "GET /api/ai-ml/sentiment/<location>": "Get market sentiment",
                    "POST /api/ai-ml/complete-analysis": "Complete AI analysis"
                },
                "agent_crm": {
                    "POST /api/crm/leads": "Create new lead",
                    "GET /api/crm/leads/<agent_id>": "Get leads",
                    "PUT /api/crm/leads/<agent_id>/<lead_id>": "Update lead status",
                    "GET /api/crm/pipeline/<agent_id>": "Get pipeline summary",
                    "GET /api/crm/metrics/<agent_id>": "Get agent metrics",
                    "POST /api/crm/conversations": "Create conversation",
                    "POST /api/crm/messages": "Send message",
                    "POST /api/crm/video/schedule": "Schedule video call",
                    "POST /api/crm/commission/calculate": "Calculate commission"
                }
            }
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Endpoint not found"}), 404
    
    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500
    
    return app


# =============================================================================
# MAIN ENTRY POINT
# =============================================================================

if __name__ == '__main__':
    app = create_app()
    
    print("""
╔═══════════════════════════════════════════════════════════════╗
║         DHARMA REALTY PLATFORM API SERVER                     ║
║                                                               ║
║  Modules:                                                     ║
║    • Ancient Wisdom (Feng Shui, Astrology, Numerology)       ║
║    • Climate & IoT (Risk Modeling, Sensors)                  ║
║    • Blockchain (NFTs, Fractional, DAO)                      ║
║    • AI/ML (Price Prediction, CV, Negotiation)               ║
║    • Agent CRM (Leads, Messaging, Video)                     ║
║                                                               ║
║  Server: http://localhost:5000                                ║
║  Docs:   http://localhost:5000/api/docs                       ║
╚═══════════════════════════════════════════════════════════════╝
    """)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
