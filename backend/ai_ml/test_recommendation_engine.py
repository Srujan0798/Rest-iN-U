"""
=============================================================================
RECOMMENDATION ENGINE - UNIT TESTS
REST-iN-U Platform - Test Suite for Recommendation System
=============================================================================

Tests:
- Data layer functions
- Feature extraction
- Collaborative filtering
- Content-based filtering
- Hybrid model
- Caching layer
- API endpoints
- Cold start handling
- Error scenarios

Target: 80%+ code coverage
"""

import unittest
from unittest.mock import Mock, patch, MagicMock, AsyncMock
import numpy as np
import json
from datetime import datetime
import asyncio

# Import recommendation engine
import sys
sys.path.append('..')
from ai_ml.recommendation_engine import (
    RecommendationEngine,
    RecommendationResult,
    UserProfile
)

# Helper to run async tests
def async_test(f):
    def wrapper(*args, **kwargs):
        return asyncio.run(f(*args, **kwargs))
    return wrapper

class TestRecommendationEngine(unittest.TestCase):
    """Test suite for RecommendationEngine"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.mock_redis = Mock()
        self.mock_db = AsyncMock() # Use AsyncMock for DB client
        self.engine = RecommendationEngine(
            redis_client=self.mock_redis,
            db_client=self.mock_db
        )
    
    def tearDown(self):
        """Clean up after tests"""
        pass
    
    # =========================================================================
    # CACHE LAYER TESTS
    # =========================================================================
    
    def test_cache_recommendations_success(self):
        """Test caching recommendations successfully"""
        user_id = "user-123"
        recommendations = [
            RecommendationResult(
                property_id="PROP-001",
                score=0.95,
                explanation="Test",
                source="hybrid"
            )
        ]
        
        self.engine._cache_recommendations(user_id, recommendations)
        
        # Verify Redis was called
        self.mock_redis.setex.assert_called_once()
        call_args = self.mock_redis.setex.call_args
        self.assertEqual(call_args[0][0], f"recommendations:user:{user_id}")
        self.assertEqual(call_args[0][1], 3600)  # TTL
    
    def test_get_cached_recommendations_hit(self):
        """Test getting cached recommendations (cache hit)"""
        user_id = "user-123"
        cached_data = json.dumps([{
            'property_id': 'PROP-001',
            'score': 0.95,
            'explanation': 'Test',
            'source': 'hybrid'
        }])
        
        self.mock_redis.get.return_value = cached_data
        
        result = self.engine._get_cached_recommendations(user_id)
        
        self.assertIsNotNone(result)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].property_id, 'PROP-001')
    
    def test_get_cached_recommendations_miss(self):
        """Test getting cached recommendations (cache miss)"""
        user_id = "user-123"
        self.mock_redis.get.return_value = None
        
        result = self.engine._get_cached_recommendations(user_id)
        
        self.assertIsNone(result)
    
    def test_invalidate_cache(self):
        """Test cache invalidation"""
        user_id = "user-123"
        
        self.engine.invalidate_cache(user_id)
        
        self.mock_redis.delete.assert_called_once_with(
            f"recommendations:user:{user_id}"
        )
    
    # =========================================================================
    # FEATURE EXTRACTION TESTS
    # =========================================================================
    
    def test_extract_user_profile_with_data(self):
        """Test extracting user profile from interactions"""
        views = [
            {'property_id': 'PROP-001', 'property': {'price': 5000000, 'bedrooms': 3, 'bathrooms': 2.0, 'city': 'Mumbai', 'propertyType': 'APARTMENT'}},
            {'property_id': 'PROP-002', 'property': {'price': 6000000, 'bedrooms': 3, 'bathrooms': 2.5, 'city': 'Mumbai', 'propertyType': 'APARTMENT'}}
        ]
        favorites = [
            {'property_id': 'PROP-003', 'property': {'price': 7000000, 'bedrooms': 4, 'bathrooms': 3.0, 'city': 'Pune', 'propertyType': 'VILLA'}}
        ]
        
        profile = self.engine._extract_user_profile(views, favorites)
        
        self.assertIsInstance(profile, UserProfile)
        self.assertEqual(profile.interaction_count, 3)
        self.assertIn('Mumbai', profile.preferred_cities)
        self.assertIn(3, profile.preferred_bedrooms)
    
    def test_extract_user_profile_empty(self):
        """Test extracting user profile with no interactions"""
        views = []
        favorites = []
        
        profile = self.engine._extract_user_profile(views, favorites)
        
        self.assertEqual(profile.interaction_count, 0)
        self.assertEqual(profile.preferred_price_min, 0)
    
    def test_extract_property_features(self):
        """Test extracting property feature vector"""
        property_data = {
            'price': 5000000,
            'bedrooms': 3,
            'bathrooms': 2.0,
            'squareFeet': 1500
        }
        
        features = self.engine._extract_property_features(property_data)
        
        self.assertIsInstance(features, np.ndarray)
        self.assertEqual(len(features), 4)
    
    # =========================================================================
    # CONTENT-BASED FILTERING TESTS
    # =========================================================================
    
    def test_calculate_cb_scores_perfect_match(self):
        """Test content-based scoring with perfect match"""
        user_profile = UserProfile(
            user_id="user-123",
            preferred_price_min=4000000,
            preferred_price_max=6000000,
            preferred_bedrooms=[3],
            preferred_bathrooms=[2.0],
            preferred_cities=['Mumbai'],
            preferred_property_types=['APARTMENT'],
            interaction_count=5
        )
        
        properties = [{
            'id': 'PROP-001',
            'price': 5000000,
            'bedrooms': 3,
            'bathrooms': 2.0,
            'city': 'Mumbai',
            'propertyType': 'APARTMENT'
        }]
        
        scores = self.engine._calculate_cb_scores(user_profile, properties)
        
        self.assertIn('PROP-001', scores)
        self.assertGreater(scores['PROP-001'], 0.8)  # High score for perfect match
    
    def test_calculate_cb_scores_no_match(self):
        """Test content-based scoring with no match"""
        user_profile = UserProfile(
            user_id="user-123",
            preferred_price_min=4000000,
            preferred_price_max=6000000,
            preferred_bedrooms=[3],
            preferred_bathrooms=[2.0],
            preferred_cities=['Mumbai'],
            preferred_property_types=['APARTMENT'],
            interaction_count=5
        )
        
        properties = [{
            'id': 'PROP-001',
            'price': 10000000,  # Out of range
            'bedrooms': 5,      # Different
            'bathrooms': 4.0,   # Different
            'city': 'Delhi',    # Different
            'propertyType': 'VILLA'  # Different
        }]
        
        scores = self.engine._calculate_cb_scores(user_profile, properties)
        
        self.assertIn('PROP-001', scores)
        self.assertEqual(scores['PROP-001'], 0.0)  # No match
    
    # =========================================================================
    # BUSINESS RULES TESTS
    # =========================================================================
    
    def test_apply_business_rules_new_listing_boost(self):
        """Test business rule: boost new listings"""
        scores = {'PROP-001': 0.5}
        properties = [{
            'id': 'PROP-001',
            'daysOnMarket': 3,  # New listing
            'vastuScore': 70
        }]
        
        adjusted = self.engine._apply_business_rules(scores, properties)
        
        self.assertGreater(adjusted['PROP-001'], scores['PROP-001'])
    
    def test_apply_business_rules_vastu_boost(self):
        """Test business rule: boost high vastu score"""
        scores = {'PROP-001': 0.5}
        properties = [{
            'id': 'PROP-001',
            'daysOnMarket': 30,
            'vastuScore': 90  # High vastu
        }]
        
        adjusted = self.engine._apply_business_rules(scores, properties)
        
        self.assertGreater(adjusted['PROP-001'], scores['PROP-001'])
    
    # =========================================================================
    # COLD START TESTS
    # =========================================================================
    
    @async_test
    async def test_get_trending_properties(self):
        """Test getting trending properties for cold start"""
        limit = 10
        # Mock DB response for trending
        self.mock_db.property.find_many.return_value = [
            Mock(id=f"PROP-{i}") for i in range(limit)
        ]
        
        trending = await self.engine._get_trending_properties(limit)
        
        self.assertEqual(len(trending), limit)
        self.assertIsInstance(trending[0], RecommendationResult)
        self.assertEqual(trending[0].source, 'trending')
    
    # =========================================================================
    # INTEGRATION TESTS
    # =========================================================================
    
    @async_test
    async def test_get_recommendations_cold_start(self):
        """Test get_recommendations for new user (cold start)"""
        # Patch internal methods
        with patch.object(RecommendationEngine, '_get_user_views', new_callable=AsyncMock) as mock_views, \
             patch.object(RecommendationEngine, '_get_user_favorites', new_callable=AsyncMock) as mock_favorites, \
             patch.object(RecommendationEngine, '_get_trending_properties', new_callable=AsyncMock) as mock_trending:

            mock_views.return_value = []
            mock_favorites.return_value = []
            mock_trending.return_value = [
                RecommendationResult(property_id=f"PROP-{i}", score=1.0, explanation="", source="trending")
                for i in range(10)
            ]

            recommendations = await self.engine.get_recommendations('user-123', limit=10)

            self.assertEqual(len(recommendations), 10)
            self.assertEqual(recommendations[0].source, 'trending')
    
    @async_test
    async def test_get_recommendations_personalized(self):
        """Test get_recommendations for active user (personalized)"""
        # Patch internal methods
        with patch.object(RecommendationEngine, '_get_user_views', new_callable=AsyncMock) as mock_views, \
             patch.object(RecommendationEngine, '_get_user_favorites', new_callable=AsyncMock) as mock_favorites, \
             patch.object(RecommendationEngine, '_get_personalized_recommendations', new_callable=AsyncMock) as mock_personalized:

            # Mock sufficient interactions
            mock_views.return_value = [{'property_id': f'PROP-{i}'} for i in range(10)]
            mock_favorites.return_value = []
            mock_personalized.return_value = [
                RecommendationResult(
                    property_id=f'PROP-REC-{i}',
                    score=0.9 - (i * 0.05),
                    explanation='Personalized',
                    source='hybrid'
                )
                for i in range(10)
            ]

            recommendations = await self.engine.get_recommendations('user-123', limit=10)

            self.assertEqual(len(recommendations), 10)
            mock_personalized.assert_called_once()
    
    # =========================================================================
    # ERROR HANDLING TESTS
    # =========================================================================
    
    @async_test
    async def test_get_recommendations_error_fallback(self):
        """Test error handling with fallback to trending"""
        with patch.object(RecommendationEngine, '_get_user_views', new_callable=AsyncMock) as mock_views, \
             patch.object(RecommendationEngine, '_get_trending_properties', new_callable=AsyncMock) as mock_trending:

            mock_views.side_effect = Exception("Database error")
            mock_trending.return_value = [
                RecommendationResult(property_id=f"PROP-{i}", score=1.0, explanation="", source="trending")
                for i in range(10)
            ]

            recommendations = await self.engine.get_recommendations('user-123', limit=10)

            # Should fallback to trending
            self.assertEqual(len(recommendations), 10)
            self.assertEqual(recommendations[0].source, 'trending')


class TestRecommendationResult(unittest.TestCase):
    """Test RecommendationResult dataclass"""
    
    def test_create_recommendation_result(self):
        """Test creating RecommendationResult"""
        result = RecommendationResult(
            property_id='PROP-001',
            score=0.95,
            explanation='Test explanation',
            source='hybrid'
        )
        
        self.assertEqual(result.property_id, 'PROP-001')
        self.assertEqual(result.score, 0.95)
        self.assertEqual(result.source, 'hybrid')


class TestUserProfile(unittest.TestCase):
    """Test UserProfile dataclass"""
    
    def test_create_user_profile(self):
        """Test creating UserProfile"""
        profile = UserProfile(
            user_id='user-123',
            preferred_price_min=1000000,
            preferred_price_max=5000000,
            preferred_bedrooms=[2, 3],
            preferred_bathrooms=[2.0],
            preferred_cities=['Mumbai'],
            preferred_property_types=['APARTMENT'],
            interaction_count=10
        )
        
        self.assertEqual(profile.user_id, 'user-123')
        self.assertEqual(profile.interaction_count, 10)
        self.assertIn(3, profile.preferred_bedrooms)


# =============================================================================
# TEST RUNNER
# =============================================================================

if __name__ == '__main__':
    # Run tests with verbose output
    unittest.main(verbosity=2)
