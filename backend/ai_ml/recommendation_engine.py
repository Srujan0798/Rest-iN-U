"""
=============================================================================
AI PROPERTY RECOMMENDATION ENGINE
REST-iN-U Platform - Hybrid ML Recommendation System
=============================================================================

Implements:
- Collaborative Filtering (user-based)
- Content-Based Filtering (property features)
- Hybrid Model (weighted combination)
- Redis Caching (1-hour TTL)
- Cold Start Handling (trending properties)

Author: REST-iN-U Team
Date: January 6, 2026
Version: 1.0.0
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import redis
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class RecommendationResult:
    """Recommendation result with metadata"""
    property_id: str
    score: float
    explanation: str
    source: str  # 'collaborative', 'content-based', 'hybrid', 'trending'


@dataclass
class UserProfile:
    """User preference profile extracted from interactions"""
    user_id: str
    preferred_price_min: float
    preferred_price_max: float
    preferred_bedrooms: List[int]
    preferred_bathrooms: List[float]
    preferred_cities: List[str]
    preferred_property_types: List[str]
    interaction_count: int


class RecommendationEngine:
    """
    Hybrid Recommendation Engine for Property Recommendations
    
    Features:
    - Collaborative Filtering (user-based similarity)
    - Content-Based Filtering (property feature matching)
    - Hybrid Scoring (weighted combination)
    - Redis Caching (performance optimization)
    - Cold Start Handling (new users)
    """
    
    def __init__(self, redis_client=None, db_client=None):
        """
        Initialize recommendation engine
        
        Args:
            redis_client: Redis client for caching
            db_client: Database client (Prisma)
        """
        self.redis_client = redis_client
        self.db_client = db_client
        self.cf_weight = 0.5  # Collaborative filtering weight
        self.cb_weight = 0.5  # Content-based weight
        self.cache_ttl = 3600  # 1 hour
        self.min_interactions = 5  # Minimum for CF
        
        logger.info("RecommendationEngine initialized")
    
    # =================================================================
    # PUBLIC API
    # =================================================================
    
    def get_recommendations(self, user_id: str, limit: int = 20,
                          filters: Dict = None) -> List[RecommendationResult]:
        """
        Get personalized property recommendations for a user
        
        Args:
            user_id: User identifier
            limit: Number of recommendations to return
            filters: Optional filters (price range, location, etc.)
        
        Returns:
            List of RecommendationResult objects
        
        Raises:
            ValueError: If user_id is invalid
        """
        try:
            logger.info(f"Getting recommendations for user {user_id}, limit={limit}")
            
            # 1. Check cache
            cached = self._get_cached_recommendations(user_id)
            if cached:
                logger.info(f"Cache hit for user {user_id}")
                return cached[:limit]
            
            # 2. Get user interaction history
            views = self._get_user_views(user_id)
            favorites = self._get_user_favorites(user_id)
            
            # 3. Check if enough data for personalization
            total_interactions = len(views) + len(favorites)
            
            if total_interactions < self.min_interactions:
                # Cold start: return trending properties
                logger.info(f"Cold start for user {user_id} ({total_interactions} interactions)")
                recommendations = self._get_trending_properties(limit, filters)
            else:
                # Personalized recommendations
                logger.info(f"Personalized recommendations for user {user_id}")
                recommendations = self._get_personalized_recommendations(
                    user_id, views, favorites, limit, filters
                )
            
            # 4. Cache results
            self._cache_recommendations(user_id, recommendations)
            
            return recommendations
        
        except Exception as e:
            logger.error(f"Error getting recommendations for user {user_id}: {str(e)}")
            # Fallback: return trending properties
            return self._get_trending_properties(limit, filters)
    
    def invalidate_cache(self, user_id: str):
        """
        Invalidate cached recommendations for a user
        
        Args:
            user_id: User identifier
        """
        if self.redis_client:
            cache_key = f"recommendations:user:{user_id}"
            self.redis_client.delete(cache_key)
            logger.info(f"Cache invalidated for user {user_id}")
    
    # =================================================================
    # CACHE LAYER
    # =================================================================
    
    def _get_cached_recommendations(self, user_id: str) -> Optional[List[RecommendationResult]]:
        """Get cached recommendations from Redis"""
        if not self.redis_client:
            return None
        
        try:
            cache_key = f"recommendations:user:{user_id}"
            cached_data = self.redis_client.get(cache_key)
            
            if cached_data:
                data = json.loads(cached_data)
                return [
                    RecommendationResult(**item) for item in data
                ]
            return None
        except Exception as e:
            logger.warning(f"Cache read error: {str(e)}")
            return None
    
    def _cache_recommendations(self, user_id: str, 
                              recommendations: List[RecommendationResult]):
        """Cache recommendations in Redis"""
        if not self.redis_client:
            return
        
        try:
            cache_key = f"recommendations:user:{user_id}"
            data = [
                {
                    'property_id': r.property_id,
                    'score': r.score,
                    'explanation': r.explanation,
                    'source': r.source
                }
                for r in recommendations
            ]
            self.redis_client.setex(
                cache_key,
                self.cache_ttl,
                json.dumps(data)
            )
            logger.info(f"Cached {len(recommendations)} recommendations for user {user_id}")
        except Exception as e:
            logger.warning(f"Cache write error: {str(e)}")
    
    # =================================================================
    # DATA LAYER
    # =================================================================
    
    def _get_user_views(self, user_id: str) -> List[Dict]:
        """
        Get user's property views from database
        
        Returns:
            List of {property_id, timestamp, duration}
        """
        # TODO: Implement with Prisma
        # For now, return mock data
        return []
    
    def _get_user_favorites(self, user_id: str) -> List[Dict]:
        """
        Get user's favorite properties from database
        
        Returns:
            List of {property_id, timestamp}
        """
        # TODO: Implement with Prisma
        return []
    
    def _get_user_searches(self, user_id: str) -> List[Dict]:
        """
        Get user's saved searches from database
        
        Returns:
            List of {search_criteria, timestamp}
        """
        # TODO: Implement with Prisma
        return []
    
    def _get_active_properties(self, filters: Dict = None) -> List[Dict]:
        """
        Get active property listings
        
        Args:
            filters: Optional filters
        
        Returns:
            List of property dictionaries
        """
        # TODO: Implement with Prisma
        return []
    
    def _get_property_by_id(self, property_id: str) -> Optional[Dict]:
        """Get property details by ID"""
        # TODO: Implement with Prisma
        return None
    
    # =================================================================
    # FEATURE EXTRACTION
    # =================================================================
    
    def _extract_user_profile(self, views: List[Dict], 
                             favorites: List[Dict]) -> UserProfile:
        """
        Extract user preference profile from interactions
        
        Args:
            views: User's property views
            favorites: User's favorite properties
        
        Returns:
            UserProfile object
        """
        # Combine all interacted properties
        all_property_ids = (
            [v['property_id'] for v in views] +
            [f['property_id'] for f in favorites]
        )
        
        # Get property details
        properties = [
            self._get_property_by_id(pid) 
            for pid in all_property_ids
        ]
        properties = [p for p in properties if p]  # Remove None
        
        if not properties:
            # Default profile
            return UserProfile(
                user_id="",
                preferred_price_min=0,
                preferred_price_max=float('inf'),
                preferred_bedrooms=[],
                preferred_bathrooms=[],
                preferred_cities=[],
                preferred_property_types=[],
                interaction_count=0
            )
        
        # Extract preferences
        prices = [p.get('price', 0) for p in properties]
        bedrooms = [p.get('bedrooms', 0) for p in properties]
        bathrooms = [p.get('bathrooms', 0) for p in properties]
        cities = [p.get('city', '') for p in properties]
        types = [p.get('propertyType', '') for p in properties]
        
        return UserProfile(
            user_id="",
            preferred_price_min=min(prices) * 0.8 if prices else 0,
            preferred_price_max=max(prices) * 1.2 if prices else float('inf'),
            preferred_bedrooms=list(set(bedrooms)),
            preferred_bathrooms=list(set(bathrooms)),
            preferred_cities=list(set(cities)),
            preferred_property_types=list(set(types)),
            interaction_count=len(properties)
        )
    
    def _extract_property_features(self, property_data: Dict) -> np.ndarray:
        """
        Extract feature vector from property
        
        Args:
            property_data: Property dictionary
        
        Returns:
            Feature vector (numpy array)
        """
        features = []
        
        # Numerical features (normalized)
        price = property_data.get('price', 0) / 10000000  # Normalize to 0-1
        bedrooms = property_data.get('bedrooms', 0) / 10
        bathrooms = property_data.get('bathrooms', 0) / 10
        sqft = property_data.get('squareFeet', 0) / 5000
        
        features.extend([price, bedrooms, bathrooms, sqft])
        
        # Categorical features (one-hot encoded)
        # TODO: Implement proper one-hot encoding
        
        return np.array(features)
    
    # =================================================================
    # COLLABORATIVE FILTERING
    # =================================================================
    
    def _calculate_cf_scores(self, user_id: str, 
                            candidate_properties: List[Dict]) -> Dict[str, float]:
        """
        Calculate collaborative filtering scores
        
        Args:
            user_id: Target user
            candidate_properties: Properties to score
        
        Returns:
            Dict mapping property_id to CF score
        """
        # TODO: Implement user-based collaborative filtering
        # 1. Build user-item interaction matrix
        # 2. Find similar users (cosine similarity)
        # 3. Get properties liked by similar users
        # 4. Calculate scores based on similarity weights
        
        return {}
    
    # =================================================================
    # CONTENT-BASED FILTERING
    # =================================================================
    
    def _calculate_cb_scores(self, user_profile: UserProfile,
                            candidate_properties: List[Dict]) -> Dict[str, float]:
        """
        Calculate content-based filtering scores
        
        Args:
            user_profile: User preference profile
            candidate_properties: Properties to score
        
        Returns:
            Dict mapping property_id to CB score
        """
        scores = {}
        
        for prop in candidate_properties:
            score = 0.0
            
            # Price match
            price = prop.get('price', 0)
            if user_profile.preferred_price_min <= price <= user_profile.preferred_price_max:
                score += 0.3
            
            # Bedroom match
            if prop.get('bedrooms') in user_profile.preferred_bedrooms:
                score += 0.2
            
            # Bathroom match
            if prop.get('bathrooms') in user_profile.preferred_bathrooms:
                score += 0.1
            
            # City match
            if prop.get('city') in user_profile.preferred_cities:
                score += 0.3
            
            # Property type match
            if prop.get('propertyType') in user_profile.preferred_property_types:
                score += 0.1
            
            scores[prop['id']] = score
        
        return scores
    
    # =================================================================
    # HYBRID MODEL
    # =================================================================
    
    def _get_personalized_recommendations(self, user_id: str,
                                         views: List[Dict],
                                         favorites: List[Dict],
                                         limit: int,
                                         filters: Dict = None) -> List[RecommendationResult]:
        """
        Get personalized recommendations using hybrid model
        
        Args:
            user_id: User identifier
            views: User's property views
            favorites: User's favorites
            limit: Number of recommendations
            filters: Optional filters
        
        Returns:
            List of RecommendationResult objects
        """
        # 1. Extract user profile
        user_profile = self._extract_user_profile(views, favorites)
        
        # 2. Get candidate properties
        candidates = self._get_active_properties(filters)
        
        # Filter out already viewed/favorited
        viewed_ids = set(v['property_id'] for v in views)
        favorited_ids = set(f['property_id'] for f in favorites)
        candidates = [
            p for p in candidates 
            if p['id'] not in viewed_ids and p['id'] not in favorited_ids
        ]
        
        # 3. Calculate scores
        cf_scores = self._calculate_cf_scores(user_id, candidates)
        cb_scores = self._calculate_cb_scores(user_profile, candidates)
        
        # 4. Combine scores (hybrid)
        final_scores = {}
        for prop in candidates:
            prop_id = prop['id']
            cf = cf_scores.get(prop_id, 0)
            cb = cb_scores.get(prop_id, 0)
            final_scores[prop_id] = (self.cf_weight * cf) + (self.cb_weight * cb)
        
        # 5. Apply business rules
        final_scores = self._apply_business_rules(final_scores, candidates)
        
        # 6. Sort and take top N
        sorted_props = sorted(
            final_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )[:limit]
        
        # 7. Create results with explanations
        results = []
        for prop_id, score in sorted_props:
            explanation = self._generate_explanation(
                prop_id, user_profile, cf_scores.get(prop_id, 0), cb_scores.get(prop_id, 0)
            )
            results.append(RecommendationResult(
                property_id=prop_id,
                score=score,
                explanation=explanation,
                source='hybrid'
            ))
        
        return results
    
    def _apply_business_rules(self, scores: Dict[str, float],
                             properties: List[Dict]) -> Dict[str, float]:
        """
        Apply business rules to adjust scores
        
        Args:
            scores: Current scores
            properties: Property list
        
        Returns:
            Adjusted scores
        """
        adjusted = scores.copy()
        
        for prop in properties:
            prop_id = prop['id']
            
            # Boost new listings (recency)
            days_on_market = prop.get('daysOnMarket', 0)
            if days_on_market < 7:
                adjusted[prop_id] *= 1.2
            
            # Boost properties with high vastu score
            vastu_score = prop.get('vastuScore', 0)
            if vastu_score > 85:
                adjusted[prop_id] *= 1.1
        
        return adjusted
    
    def _generate_explanation(self, property_id: str, user_profile: UserProfile,
                             cf_score: float, cb_score: float) -> str:
        """Generate human-readable explanation for recommendation"""
        reasons = []
        
        if cf_score > 0.5:
            reasons.append("Users with similar tastes liked this property")
        if cb_score > 0.5:
            reasons.append("Matches your preferences")
        if not reasons:
            reasons.append("Popular in your area")
        
        return "; ".join(reasons)
    
    # =================================================================
    # COLD START HANDLING
    # =================================================================
    
    def _get_trending_properties(self, limit: int,
                                filters: Dict = None) -> List[RecommendationResult]:
        """
        Get trending properties for cold start users
        
        Args:
            limit: Number of properties to return
            filters: Optional filters
        
        Returns:
            List of RecommendationResult objects
        """
        # Get properties sorted by views in last 7 days
        # TODO: Implement with database query
        
        # Mock implementation
        return [
            RecommendationResult(
                property_id=f"PROP-{i}",
                score=1.0 - (i * 0.05),
                explanation="Trending property in your area",
                source='trending'
            )
            for i in range(limit)
        ]


# =============================================================================
# MODULE EXPORTS
# =============================================================================

__all__ = [
    'RecommendationEngine',
    'RecommendationResult',
    'UserProfile'
]
