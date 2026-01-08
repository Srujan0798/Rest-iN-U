"""
=============================================================================
API ROUTES: AI/ML MODULE
Dharma Realty Platform - Sprint 14-16 API
=============================================================================
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
import sys
sys.path.append('..')

from ai_ml import (
    MLPricePrediction, ComputerVisionInspector,
    AINegotiationAgent, MarketSentimentAnalyzer
)


ai_ml_bp = Blueprint('ai_ml', __name__, url_prefix='/api/ai-ml')


# =============================================================================
# PRICE PREDICTION ENDPOINTS
# =============================================================================

@ai_ml_bp.route('/price-prediction', methods=['POST'])
def predict_price():
    """
    Predict property prices for multiple timeframes
    
    Request Body:
    {
        "id": "PROP-001",
        "price": 10000000,
        "location_score": 85,
        "vastu_score": 88,
        "upcoming_metro": true,
        "age_years": 5
    }
    """
    try:
        data = request.get_json()
        market_data = data.pop('market_data', None)
        
        predictor = MLPricePrediction()
        prediction = predictor.predict_price(data, market_data)
        
        return jsonify({
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
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@ai_ml_bp.route('/price-prediction/batch', methods=['POST'])
def batch_price_prediction():
    """Predict prices for multiple properties"""
    try:
        data = request.get_json()
        properties = data.get('properties', [])
        
        predictor = MLPricePrediction()
        results = []
        
        for prop in properties:
            prediction = predictor.predict_price(prop)
            results.append({
                "property_id": prediction.property_id,
                "current_price": prediction.current_price,
                "predicted_1_year": prediction.predictions.get("1_year"),
                "confidence": prediction.confidence.value
            })
        
        return jsonify({"success": True, "data": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


# =============================================================================
# COMPUTER VISION ENDPOINTS
# =============================================================================

@ai_ml_bp.route('/inspect', methods=['POST'])
def inspect_property():
    """
    Analyze property images for defects
    
    Request Body:
    {
        "property_id": "PROP-001",
        "images": [
            {"url": "...", "room": "living_room"},
            {"url": "...", "room": "bedroom"}
        ]
    }
    """
    try:
        data = request.get_json()
        
        property_id = data.get('property_id')
        images = data.get('images', [])
        
        inspector = ComputerVisionInspector()
        report = inspector.analyze_images(property_id, images)
        
        return jsonify({
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
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


# =============================================================================
# NEGOTIATION ENDPOINTS
# =============================================================================

@ai_ml_bp.route('/negotiation/analyze', methods=['POST'])
def analyze_negotiation():
    """
    Get AI negotiation recommendations
    
    Request Body:
    {
        "id": "PROP-001",
        "price": 10000000,
        "days_on_market": 75,
        "buyer_profile": {
            "budget_constraint": false,
            "urgency": "normal"
        }
    }
    """
    try:
        data = request.get_json()
        buyer_profile = data.pop('buyer_profile', None)
        
        agent = AINegotiationAgent()
        result = agent.analyze_negotiation(data, buyer_profile)
        
        return jsonify({
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
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@ai_ml_bp.route('/negotiation/counter-offer', methods=['POST'])
def get_counter_offer():
    """Get suggested counter-offer based on rejection"""
    try:
        data = request.get_json()
        
        property_data = data.get('property')
        current_offer = data.get('current_offer')
        rejection_reason = data.get('rejection_reason')
        
        agent = AINegotiationAgent()
        result = agent.analyze_negotiation(property_data)
        
        # Find next counter offer
        for counter in result.counter_offers:
            if counter['offer'] > current_offer:
                return jsonify({
                    "success": True,
                    "data": {
                        "suggested_offer": counter['offer'],
                        "rationale": counter['rationale'],
                        "round": counter['round']
                    }
                })
        
        return jsonify({
            "success": True,
            "data": {
                "message": "No further counter-offers recommended",
                "walk_away": True
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


# =============================================================================
# SENTIMENT ANALYSIS ENDPOINTS
# =============================================================================

@ai_ml_bp.route('/sentiment/<location>', methods=['GET'])
def get_market_sentiment(location):
    """Get market sentiment for a location"""
    try:
        property_type = request.args.get('property_type')
        
        analyzer = MarketSentimentAnalyzer()
        result = analyzer.analyze_sentiment(location, property_type)
        
        return jsonify({
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
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@ai_ml_bp.route('/sentiment/compare', methods=['POST'])
def compare_sentiments():
    """Compare sentiment across multiple locations"""
    try:
        data = request.get_json()
        locations = data.get('locations', [])
        
        analyzer = MarketSentimentAnalyzer()
        results = []
        
        for loc in locations:
            result = analyzer.analyze_sentiment(loc)
            results.append({
                "location": result.location,
                "overall_sentiment": result.overall_sentiment,
                "confidence_index": result.confidence_index,
                "price_outlook": result.price_outlook
            })
        
        return jsonify({"success": True, "data": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


# =============================================================================
# COMBINED AI ANALYSIS ENDPOINT
# =============================================================================

@ai_ml_bp.route('/complete-analysis', methods=['POST'])
def complete_ai_analysis():
    """Run complete AI analysis on a property"""
    try:
        data = request.get_json()
        property_data = data.get('property', {})
        images = data.get('images', [])
        buyer_profile = data.get('buyer_profile')
        
        results = {}
        
        # Price Prediction
        predictor = MLPricePrediction()
        price_pred = predictor.predict_price(property_data)
        results['price_prediction'] = {
            "1_year_forecast": price_pred.predictions.get("1_year"),
            "confidence": price_pred.confidence.value,
            "opportunities": price_pred.opportunity_factors[:2]
        }
        
        # Property Inspection (if images provided)
        if images:
            inspector = ComputerVisionInspector()
            inspection = inspector.analyze_images(property_data.get('id', 'unknown'), images)
            results['inspection'] = {
                "condition": inspection.overall_condition,
                "repair_cost": inspection.total_repair_cost,
                "defect_count": len(inspection.defects)
            }
        
        # Negotiation Analysis
        if property_data.get('price'):
            agent = AINegotiationAgent()
            negotiation = agent.analyze_negotiation(property_data, buyer_profile)
            results['negotiation'] = {
                "recommended_offer": negotiation.recommended_offer,
                "success_probability": negotiation.success_probability,
                "strategy": negotiation.strategy.value
            }
        
        # Market Sentiment
        if property_data.get('city'):
            analyzer = MarketSentimentAnalyzer()
            sentiment = analyzer.analyze_sentiment(property_data['city'])
            results['sentiment'] = {
                "overall": sentiment.overall_sentiment,
                "outlook": sentiment.price_outlook
            }
        
        return jsonify({
            "success": True,
            "data": {
                "property_id": property_data.get('id', 'unknown'),
                "analysis_date": datetime.now().isoformat(),
                "components": results
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


def register_routes(app):
    """Register all AI/ML routes with Flask app"""
    app.register_blueprint(ai_ml_bp)
    return app
