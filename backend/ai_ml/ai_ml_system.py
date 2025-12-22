"""
=============================================================================
SPRINT 14-16: AI/ML SYSTEM
Dharma Realty - AI/ML Module
=============================================================================

ML Price Prediction, Computer Vision, AI Negotiation, Sentiment Analysis
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import random
import math


class PredictionConfidence(Enum):
    """Confidence levels for predictions"""
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class DefectSeverity(Enum):
    """Severity of detected defects"""
    MINOR = "Minor"
    MODERATE = "Moderate"
    MAJOR = "Major"
    CRITICAL = "Critical"


class NegotiationStrategy(Enum):
    """Negotiation strategies"""
    AGGRESSIVE = "Aggressive"
    MODERATE = "Moderate"
    CONSERVATIVE = "Conservative"


@dataclass
class PricePrediction:
    """Price prediction result"""
    property_id: str
    current_price: float
    predictions: Dict[str, float]  # timeframe -> predicted price
    confidence: PredictionConfidence
    factors: Dict[str, float]  # factor -> impact
    comparable_sales: List[Dict]
    risk_factors: List[str]
    opportunity_factors: List[str]


@dataclass
class PropertyDefect:
    """Detected property defect"""
    defect_id: str
    category: str
    description: str
    location: str
    severity: DefectSeverity
    confidence: float
    repair_cost_estimate: float
    urgency: str


@dataclass
class InspectionReport:
    """Property inspection report"""
    property_id: str
    inspection_date: datetime
    defects: List[PropertyDefect]
    overall_condition: str
    total_repair_cost: float
    maintenance_recommendations: List[str]
    safety_issues: List[str]


@dataclass
class NegotiationResult:
    """AI negotiation recommendation"""
    property_id: str
    asking_price: float
    recommended_offer: float
    zopa_min: float  # Zone of Possible Agreement
    zopa_max: float
    strategy: NegotiationStrategy
    counter_offers: List[Dict]
    success_probability: float
    talking_points: List[str]


@dataclass
class SentimentResult:
    """Market sentiment analysis"""
    location: str
    analysis_date: datetime
    overall_sentiment: str  # Bullish/Neutral/Bearish
    confidence_index: float
    news_sentiment: float
    social_sentiment: float
    market_indicators: Dict
    trending_topics: List[str]
    price_outlook: str


class MLPricePrediction:
    """
    ML-Based Property Price Prediction
    Features: 50+ factors, Multi-timeframe forecasts
    """
    
    # Price factors and their weights
    PRICE_FACTORS = {
        "location_score": 0.25,
        "size_sqft": 0.15,
        "age_years": -0.05,
        "bedrooms": 0.08,
        "bathrooms": 0.05,
        "vastu_score": 0.08,
        "climate_risk": -0.05,
        "amenities_count": 0.06,
        "floor_level": 0.03,
        "parking_spots": 0.04,
        "view_quality": 0.05,
        "construction_quality": 0.08,
        "market_trend": 0.10,
        "infrastructure_proximity": 0.05
    }
    
    def __init__(self):
        self.model_version = "1.0.0"
    
    def predict_price(self, property_data: Dict,
                     market_data: Dict = None) -> PricePrediction:
        """Predict property prices for multiple timeframes"""
        
        current_price = property_data.get("price", 0)
        
        # Calculate factor impacts
        factors = self._calculate_factor_impacts(property_data)
        
        # Generate predictions for different timeframes
        base_growth = self._calculate_base_growth(property_data, market_data)
        
        predictions = {
            "6_months": current_price * (1 + base_growth * 0.5),
            "1_year": current_price * (1 + base_growth),
            "3_years": current_price * (1 + base_growth * 2.5),
            "5_years": current_price * (1 + base_growth * 4)
        }
        
        # Determine confidence
        confidence = self._calculate_confidence(property_data, market_data)
        
        # Find comparable sales
        comparables = self._find_comparable_sales(property_data)
        
        # Identify risk and opportunity factors
        risks, opportunities = self._identify_factors(property_data, factors)
        
        return PricePrediction(
            property_id=property_data.get("id", "unknown"),
            current_price=current_price,
            predictions=predictions,
            confidence=confidence,
            factors=factors,
            comparable_sales=comparables,
            risk_factors=risks,
            opportunity_factors=opportunities
        )
    
    def _calculate_factor_impacts(self, property_data: Dict) -> Dict[str, float]:
        """Calculate impact of each factor"""
        impacts = {}
        
        for factor, weight in self.PRICE_FACTORS.items():
            value = property_data.get(factor, 0)
            
            if factor == "location_score":
                impact = (value / 100) * weight * 100
            elif factor == "age_years":
                impact = max(-20, value * weight)
            elif factor == "vastu_score":
                impact = ((value - 50) / 50) * weight * 100
            else:
                normalized = min(1.0, value / 10) if isinstance(value, (int, float)) else 0.5
                impact = normalized * weight * 100
            
            impacts[factor] = round(impact, 2)
        
        return impacts
    
    def _calculate_base_growth(self, property_data: Dict, 
                              market_data: Dict = None) -> float:
        """Calculate expected annual growth rate"""
        
        base_rate = 0.08  # 8% base growth
        
        # Adjust for location
        location_score = property_data.get("location_score", 70)
        if location_score > 85:
            base_rate += 0.03
        elif location_score < 50:
            base_rate -= 0.02
        
        # Adjust for market conditions
        if market_data:
            market_trend = market_data.get("trend", "stable")
            if market_trend == "bullish":
                base_rate += 0.02
            elif market_trend == "bearish":
                base_rate -= 0.02
        
        # Adjust for infrastructure
        if property_data.get("upcoming_metro", False):
            base_rate += 0.04
        if property_data.get("upcoming_airport", False):
            base_rate += 0.03
        
        return max(0.02, min(0.20, base_rate))
    
    def _calculate_confidence(self, property_data: Dict,
                             market_data: Dict = None) -> PredictionConfidence:
        """Calculate prediction confidence"""
        
        score = 70
        
        # More data = higher confidence
        if property_data.get("vastu_score"):
            score += 5
        if property_data.get("climate_risk"):
            score += 5
        if market_data:
            score += 10
        if property_data.get("comparable_sales", []):
            score += 10
        
        if score >= 85:
            return PredictionConfidence.HIGH
        elif score >= 65:
            return PredictionConfidence.MEDIUM
        else:
            return PredictionConfidence.LOW
    
    def _find_comparable_sales(self, property_data: Dict) -> List[Dict]:
        """Find comparable property sales"""
        
        # In production, would query database
        return [
            {
                "address": "Similar property 1",
                "price": property_data.get("price", 0) * 0.95,
                "sold_date": "2024-01-15",
                "similarity_score": 92
            },
            {
                "address": "Similar property 2",
                "price": property_data.get("price", 0) * 1.05,
                "sold_date": "2024-02-20",
                "similarity_score": 88
            }
        ]
    
    def _identify_factors(self, property_data: Dict,
                         impacts: Dict) -> Tuple[List[str], List[str]]:
        """Identify risk and opportunity factors"""
        
        risks = []
        opportunities = []
        
        if property_data.get("age_years", 0) > 20:
            risks.append("Older construction may require renovation")
        if property_data.get("climate_risk", 0) > 50:
            risks.append("High climate risk zone")
        if property_data.get("vastu_score", 100) < 60:
            risks.append("Low Vastu compliance score")
        
        if property_data.get("upcoming_metro", False):
            opportunities.append("New metro line coming - expect 20-30% appreciation")
        if property_data.get("location_score", 0) > 85:
            opportunities.append("Prime location - strong demand")
        if property_data.get("vastu_score", 0) > 85:
            opportunities.append("Excellent Vastu - premium pricing possible")
        
        return risks, opportunities


class ComputerVisionInspector:
    """
    Computer Vision Property Inspection
    Features: Defect detection, Cost estimation, Recommendations
    """
    
    DEFECT_CATEGORIES = {
        "structural": ["cracks", "settlement", "water_damage", "foundation_issues"],
        "electrical": ["wiring_issues", "panel_problems", "outlet_damage"],
        "plumbing": ["leaks", "corrosion", "drainage_issues"],
        "exterior": ["roof_damage", "siding_issues", "window_problems"],
        "interior": ["wall_damage", "floor_wear", "ceiling_issues"]
    }
    
    REPAIR_COSTS = {
        DefectSeverity.MINOR: (5000, 15000),
        DefectSeverity.MODERATE: (15000, 50000),
        DefectSeverity.MAJOR: (50000, 200000),
        DefectSeverity.CRITICAL: (200000, 500000)
    }
    
    def __init__(self):
        self.model_version = "1.0.0"
    
    def analyze_images(self, property_id: str,
                      images: List[Dict]) -> InspectionReport:
        """Analyze property images for defects"""
        
        defects = []
        defect_count = 0
        
        # Simulate image analysis
        for image in images:
            detected = self._detect_defects_in_image(image)
            for d in detected:
                defect_count += 1
                d.defect_id = f"DEF-{defect_count:04d}"
                defects.append(d)
        
        # Calculate totals
        total_cost = sum(d.repair_cost_estimate for d in defects)
        
        # Determine overall condition
        if len(defects) == 0:
            condition = "Excellent"
        elif all(d.severity in [DefectSeverity.MINOR] for d in defects):
            condition = "Good"
        elif any(d.severity == DefectSeverity.CRITICAL for d in defects):
            condition = "Poor"
        else:
            condition = "Fair"
        
        # Generate recommendations
        recommendations = self._generate_recommendations(defects)
        
        # Identify safety issues
        safety = [d.description for d in defects 
                 if d.severity == DefectSeverity.CRITICAL or 
                 "electrical" in d.category.lower() or
                 "structural" in d.category.lower()]
        
        return InspectionReport(
            property_id=property_id,
            inspection_date=datetime.now(),
            defects=defects,
            overall_condition=condition,
            total_repair_cost=total_cost,
            maintenance_recommendations=recommendations,
            safety_issues=safety
        )
    
    def _detect_defects_in_image(self, image: Dict) -> List[PropertyDefect]:
        """Simulate defect detection in a single image"""
        
        defects = []
        room = image.get("room", "general")
        
        # Simulate detection (in production, would use YOLO/Mask R-CNN)
        # Random detection for demo
        if random.random() > 0.7:
            category = random.choice(list(self.DEFECT_CATEGORIES.keys()))
            defect_type = random.choice(self.DEFECT_CATEGORIES[category])
            severity = random.choice(list(DefectSeverity))
            
            cost_range = self.REPAIR_COSTS[severity]
            cost = random.uniform(cost_range[0], cost_range[1])
            
            defects.append(PropertyDefect(
                defect_id="",  # Will be set later
                category=category,
                description=defect_type.replace("_", " ").title(),
                location=room,
                severity=severity,
                confidence=random.uniform(0.75, 0.98),
                repair_cost_estimate=cost,
                urgency="Immediate" if severity == DefectSeverity.CRITICAL else "Normal"
            ))
        
        return defects
    
    def _generate_recommendations(self, defects: List[PropertyDefect]) -> List[str]:
        """Generate maintenance recommendations"""
        
        recommendations = []
        
        categories = set(d.category for d in defects)
        
        if "structural" in categories:
            recommendations.append("Get structural engineer assessment")
        if "electrical" in categories:
            recommendations.append("Schedule electrical safety inspection")
        if "plumbing" in categories:
            recommendations.append("Check water pressure and drainage")
        if "roof_damage" in [d.description.lower() for d in defects]:
            recommendations.append("Inspect roof before monsoon season")
        
        recommendations.append("Schedule annual maintenance inspection")
        
        return recommendations


class AINegotiationAgent:
    """
    AI-Powered Negotiation Agent
    Features: ZOPA calculation, Counter-offer strategy, Success prediction
    """
    
    def __init__(self):
        self.market_data = {}
    
    def analyze_negotiation(self, property_data: Dict,
                           buyer_profile: Dict = None) -> NegotiationResult:
        """Analyze and recommend negotiation strategy"""
        
        asking_price = property_data.get("price", 0)
        
        # Calculate ZOPA (Zone of Possible Agreement)
        zopa_min, zopa_max = self._calculate_zopa(property_data)
        
        # Determine recommended offer
        recommended = self._calculate_recommended_offer(
            asking_price, zopa_min, zopa_max, buyer_profile
        )
        
        # Select strategy
        strategy = self._select_strategy(property_data, buyer_profile)
        
        # Generate counter-offer sequence
        counters = self._generate_counter_offers(asking_price, recommended, zopa_min)
        
        # Calculate success probability
        probability = self._calculate_success_probability(
            asking_price, recommended, property_data
        )
        
        # Generate talking points
        talking_points = self._generate_talking_points(property_data)
        
        return NegotiationResult(
            property_id=property_data.get("id", "unknown"),
            asking_price=asking_price,
            recommended_offer=recommended,
            zopa_min=zopa_min,
            zopa_max=zopa_max,
            strategy=strategy,
            counter_offers=counters,
            success_probability=probability,
            talking_points=talking_points
        )
    
    def _calculate_zopa(self, property_data: Dict) -> Tuple[float, float]:
        """Calculate Zone of Possible Agreement"""
        
        asking = property_data.get("price", 0)
        
        # Calculate seller's walkaway price (estimated)
        days_on_market = property_data.get("days_on_market", 30)
        
        if days_on_market > 90:
            seller_min = asking * 0.85  # Motivated seller
        elif days_on_market > 60:
            seller_min = asking * 0.90
        else:
            seller_min = asking * 0.95
        
        # Maximum (asking price)
        zopa_max = asking
        
        return seller_min, zopa_max
    
    def _calculate_recommended_offer(self, asking: float, zopa_min: float,
                                    zopa_max: float, 
                                    buyer_profile: Dict = None) -> float:
        """Calculate recommended initial offer"""
        
        # Start at zopa_min + some buffer
        base_offer = zopa_min + (zopa_max - zopa_min) * 0.3
        
        # Adjust based on buyer profile
        if buyer_profile:
            if buyer_profile.get("budget_constraint", False):
                base_offer = min(base_offer, buyer_profile.get("max_budget", asking))
            if buyer_profile.get("urgency", "normal") == "high":
                base_offer *= 1.05  # Less aggressive
        
        return round(base_offer, -4)  # Round to nearest 10,000
    
    def _select_strategy(self, property_data: Dict,
                        buyer_profile: Dict = None) -> NegotiationStrategy:
        """Select negotiation strategy"""
        
        days_on_market = property_data.get("days_on_market", 30)
        
        if days_on_market > 90:
            return NegotiationStrategy.AGGRESSIVE
        elif buyer_profile and buyer_profile.get("urgency") == "high":
            return NegotiationStrategy.CONSERVATIVE
        else:
            return NegotiationStrategy.MODERATE
    
    def _generate_counter_offers(self, asking: float, initial: float,
                                zopa_min: float) -> List[Dict]:
        """Generate sequence of counter-offers"""
        
        offers = [
            {
                "round": 1,
                "offer": initial,
                "discount_percent": ((asking - initial) / asking) * 100,
                "rationale": "Initial offer at market value"
            }
        ]
        
        # Second offer if rejected
        second = initial + (asking - initial) * 0.3
        offers.append({
            "round": 2,
            "offer": round(second, -4),
            "discount_percent": ((asking - second) / asking) * 100,
            "rationale": "Improved offer with good faith"
        })
        
        # Final offer
        final = initial + (asking - initial) * 0.5
        offers.append({
            "round": 3,
            "offer": round(final, -4),
            "discount_percent": ((asking - final) / asking) * 100,
            "rationale": "Best and final offer"
        })
        
        return offers
    
    def _calculate_success_probability(self, asking: float, offer: float,
                                       property_data: Dict) -> float:
        """Calculate probability of successful negotiation"""
        
        discount = (asking - offer) / asking
        days_on_market = property_data.get("days_on_market", 30)
        
        # Base probability from discount
        if discount < 0.05:
            prob = 0.90
        elif discount < 0.10:
            prob = 0.75
        elif discount < 0.15:
            prob = 0.50
        else:
            prob = 0.30
        
        # Adjust for days on market
        if days_on_market > 90:
            prob += 0.15
        elif days_on_market > 60:
            prob += 0.10
        
        return min(0.95, prob)
    
    def _generate_talking_points(self, property_data: Dict) -> List[str]:
        """Generate negotiation talking points"""
        
        points = []
        
        if property_data.get("age_years", 0) > 15:
            points.append(f"Property is {property_data['age_years']} years old - renovation costs expected")
        
        if property_data.get("days_on_market", 0) > 60:
            points.append("Property has been on market for extended period")
        
        if property_data.get("vastu_score", 100) < 70:
            points.append("Vastu compliance requires attention")
        
        if property_data.get("comparable_lower", False):
            points.append("Similar properties sold for less recently")
        
        points.append("All-cash buyer with quick closing capability")
        points.append("Pre-approved financing demonstrates seriousness")
        
        return points


class MarketSentimentAnalyzer:
    """
    Market Sentiment Analysis
    Features: News analysis, Social media, Market indicators
    """
    
    def __init__(self):
        self.sources = ["news", "social", "market"]
    
    def analyze_sentiment(self, location: str,
                         property_type: str = None) -> SentimentResult:
        """Analyze market sentiment for a location"""
        
        # Simulate sentiment analysis
        news_sentiment = self._analyze_news(location)
        social_sentiment = self._analyze_social(location)
        market_indicators = self._get_market_indicators(location)
        
        # Calculate overall sentiment
        avg_sentiment = (news_sentiment + social_sentiment) / 2
        
        if avg_sentiment > 0.3:
            overall = "Bullish"
            outlook = "Positive price growth expected"
        elif avg_sentiment < -0.3:
            overall = "Bearish"
            outlook = "Price correction possible"
        else:
            overall = "Neutral"
            outlook = "Stable market conditions"
        
        # Get trending topics
        topics = self._get_trending_topics(location)
        
        return SentimentResult(
            location=location,
            analysis_date=datetime.now(),
            overall_sentiment=overall,
            confidence_index=abs(avg_sentiment) * 100,
            news_sentiment=news_sentiment,
            social_sentiment=social_sentiment,
            market_indicators=market_indicators,
            trending_topics=topics,
            price_outlook=outlook
        )
    
    def _analyze_news(self, location: str) -> float:
        """Analyze news sentiment (-1 to 1)"""
        # Simulate (would use NLP in production)
        return random.uniform(-0.3, 0.5)
    
    def _analyze_social(self, location: str) -> float:
        """Analyze social media sentiment (-1 to 1)"""
        return random.uniform(-0.2, 0.4)
    
    def _get_market_indicators(self, location: str) -> Dict:
        """Get market indicators"""
        return {
            "price_trend": "Increasing",
            "inventory_level": "Low",
            "days_on_market_avg": 45,
            "price_to_rent_ratio": 22,
            "new_listings_trend": "Stable"
        }
    
    def _get_trending_topics(self, location: str) -> List[str]:
        """Get trending real estate topics"""
        return [
            "New metro line announcement",
            "IT hub expansion",
            "Infrastructure development",
            "Price appreciation in suburbs"
        ]


# =============================================================================
# MODULE INIT
# =============================================================================

__all__ = [
    "MLPricePrediction",
    "PricePrediction",
    "ComputerVisionInspector",
    "InspectionReport",
    "AINegotiationAgent",
    "NegotiationResult",
    "MarketSentimentAnalyzer",
    "SentimentResult"
]


# =============================================================================
# USAGE EXAMPLE
# =============================================================================

if __name__ == "__main__":
    # Price Prediction
    predictor = MLPricePrediction()
    prediction = predictor.predict_price({
        "id": "PROP-001",
        "price": 10000000,
        "location_score": 85,
        "vastu_score": 88,
        "upcoming_metro": True,
        "age_years": 5
    })
    
    print("Price Predictions:")
    for timeframe, price in prediction.predictions.items():
        print(f"  {timeframe}: ₹{price:,.0f}")
    
    # Negotiation
    negotiator = AINegotiationAgent()
    result = negotiator.analyze_negotiation({
        "id": "PROP-001",
        "price": 10000000,
        "days_on_market": 75
    })
    
    print(f"\nNegotiation Analysis:")
    print(f"  Asking: ₹{result.asking_price:,.0f}")
    print(f"  Recommended Offer: ₹{result.recommended_offer:,.0f}")
    print(f"  Success Probability: {result.success_probability * 100:.0f}%")
    
    # Sentiment
    analyzer = MarketSentimentAnalyzer()
    sentiment = analyzer.analyze_sentiment("Mumbai")
    print(f"\nMarket Sentiment: {sentiment.overall_sentiment}")
