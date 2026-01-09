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
from unittest.mock import Mock, patch, MagicMock
import numpy as np
import json
from datetime import datetime

# Import recommendation engine
import sys
sys.path.append('..')
from ai_ml.recommendation_engine import (
    RecommendationEngine,
    RecommendationResult,
    UserProfile
)


class TestRecommendationEngine(unittest.TestCase):
    """Test suite for RecommendationEngine"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.mock_redis = Mock()
        self.mock_db = Mock()
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
            {'property_id': 'PROP-001'},
            {'property_id': 'PROP-002'}
        ]
        favorites = [
            {'property_id': 'PROP-003'}
        ]
        
        # Mock property data
        self.engine._get_property_by_id = Mock(side_effect=[
            {
                'price': 5000000,
                'bedrooms': 3,
                'bathrooms': 2.0,
                'city': 'Mumbai',
                'propertyType': 'APARTMENT'
            },
            {
                'price': 6000000,
                'bedrooms': 3,
                'bathrooms': 2.5,
                'city': 'Mumbai',
                'propertyType': 'APARTMENT'
            },
            {
                'price': 7000000,
                'bedrooms': 4,
                'bathrooms': 3.0,
                'city': 'Pune',
                'propertyType': 'VILLA'
            }
        ])
        
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
            'squareFeet': 1500,
            'propertyType': 'APARTMENT'
        }
        
        features = self.engine._extract_property_features(property_data)
        
        self.assertIsInstance(features, np.ndarray)
        # 4 numerical features + 12 property types = 16
        self.assertEqual(len(features), 16)

        # Verify encoding
        # APARTMENT is the 4th element in PROPERTY_TYPES (index 3)
        # So in features, it should be at index 4 + 3 = 7
        self.assertEqual(features[7], 1.0)
        self.assertEqual(features[6], 0.0)

    def test_extract_property_features_unknown_type(self):
        """Test extracting features with unknown property type"""
        property_data = {
            'price': 5000000,
            'bedrooms': 3,
            'bathrooms': 2.0,
            'squareFeet': 1500,
            'propertyType': 'UNKNOWN'
        }

        features = self.engine._extract_property_features(property_data)

        self.assertEqual(len(features), 16)
        # All one-hot features should be 0
        self.assertTrue(all(x == 0 for x in features[4:]))
    
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
    # COLLABORATIVE FILTERING TESTS
    # =========================================================================
    
    @patch.object(RecommendationEngine, '_get_all_user_interactions')
    def test_calculate_cf_scores(self, mock_interactions):
        """Test collaborative filtering scoring"""
        # Mock global interactions
        mock_interactions.return_value = (
            [
                {'userId': 'user-1', 'propertyId': 'PROP-1', 'timestamp': '2023-01-01'},
                {'userId': 'user-2', 'propertyId': 'PROP-1', 'timestamp': '2023-01-01'},
                {'userId': 'user-2', 'propertyId': 'PROP-2', 'timestamp': '2023-01-01'}
            ],
            []
        )

        # We are user-1, we viewed PROP-1.
        # user-2 viewed PROP-1 and PROP-2.
        # So user-1 and user-2 are similar.
        # PROP-2 should be recommended.

        candidate_properties = [{'id': 'PROP-2'}]

        scores = self.engine._calculate_cf_scores('user-1', candidate_properties)

        self.assertIn('PROP-2', scores)
        self.assertGreater(scores['PROP-2'], 0.0)

    @patch.object(RecommendationEngine, '_get_all_user_interactions')
    def test_calculate_cf_scores_no_interactions(self, mock_interactions):
        """Test CF scoring with no global interactions"""
        mock_interactions.return_value = ([], [])

        scores = self.engine._calculate_cf_scores('user-1', [{'id': 'PROP-1'}])

        self.assertEqual(scores, {})

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
    
    def test_get_trending_properties(self):
        """Test getting trending properties for cold start"""
        limit = 10
        
        trending = self.engine._get_trending_properties(limit)
        
        self.assertEqual(len(trending), limit)
        self.assertIsInstance(trending[0], RecommendationResult)
        self.assertEqual(trending[0].source, 'trending')
    
    # =========================================================================
    # INTEGRATION TESTS
    # =========================================================================
    
    @patch.object(RecommendationEngine, '_get_user_views')
    @patch.object(RecommendationEngine, '_get_user_favorites')
    def test_get_recommendations_cold_start(self, mock_favorites, mock_views):
        """Test get_recommendations for new user (cold start)"""
        mock_views.return_value = []
        mock_favorites.return_value = []
        
        recommendations, cache_hit = self.engine.get_recommendations('user-123', limit=10)
        
        self.assertEqual(len(recommendations), 10)
        self.assertEqual(recommendations[0].source, 'trending')
        self.assertFalse(cache_hit)
    
    @patch.object(RecommendationEngine, '_get_user_views')
    @patch.object(RecommendationEngine, '_get_user_favorites')
    @patch.object(RecommendationEngine, '_get_personalized_recommendations')
    def test_get_recommendations_personalized(self, mock_personalized, 
                                             mock_favorites, mock_views):
        """Test get_recommendations for active user (personalized)"""
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
        
        recommendations, cache_hit = self.engine.get_recommendations('user-123', limit=10)
        
        self.assertEqual(len(recommendations), 10)
        self.assertFalse(cache_hit)
        mock_personalized.assert_called_once()

    def test_get_recommendations_cache_hit(self):
        """Test get_recommendations with cache hit"""
        user_id = 'user-123'
        cached_data = json.dumps([{
            'property_id': 'PROP-CACHED-001',
            'score': 0.95,
            'explanation': 'Cached',
            'source': 'hybrid'
        }])

        self.mock_redis.get.return_value = cached_data

        recommendations, cache_hit = self.engine.get_recommendations(user_id, limit=10)

        self.assertEqual(len(recommendations), 1)
        self.assertEqual(recommendations[0].property_id, 'PROP-CACHED-001')
        self.assertTrue(cache_hit)
    
    # =========================================================================
    # ERROR HANDLING TESTS
    # =========================================================================
    
    @patch.object(RecommendationEngine, '_get_user_views')
    def test_get_recommendations_error_fallback(self, mock_views):
        """Test error handling with fallback to trending"""
        mock_views.side_effect = Exception("Database error")
        
        recommendations, cache_hit = self.engine.get_recommendations('user-123', limit=10)
        
        # Should fallback to trending
        self.assertEqual(len(recommendations), 10)
        self.assertEqual(recommendations[0].source, 'trending')
        self.assertFalse(cache_hit)

    # =========================================================================
    # SIMILAR PROPERTIES TESTS
    # =========================================================================
    def test_get_similar_properties(self):
        """Test getting similar properties"""
        # Disable DB client to force use of mock properties
        self.engine.db_client = None

        # Override mock data generation to ensure predictable results
        self.engine._generate_mock_properties = MagicMock(return_value=[
            {
                "id": "PROP-001",
                "price": 5000000,
                "bedrooms": 2,
                "bathrooms": 2,
                "squareFeet": 1000,
                "city": "Mumbai",
                "propertyType": "APARTMENT"
            },
             {
                "id": "PROP-002",
                "price": 5100000, # Very similar to PROP-001
                "bedrooms": 2,
                "bathrooms": 2,
                "squareFeet": 1050,
                "city": "Mumbai",
                "propertyType": "APARTMENT"
            },
             {
                "id": "PROP-003",
                "price": 25000000, # Very different
                "bedrooms": 5,
                "bathrooms": 5,
                "squareFeet": 5000,
                "city": "Delhi",
                "propertyType": "VILLA"
            }
        ])

        # Test finding similar to PROP-001
        similar = self.engine.get_similar_properties("PROP-001", limit=2)

        self.assertTrue(len(similar) > 0)
        # PROP-002 should be first as it is very similar
        self.assertEqual(similar[0].property_id, "PROP-002")
        self.assertEqual(similar[0].source, "content-based")

        # PROP-003 should have lower score or be last (if included at all in limit)
        if len(similar) > 1:
            self.assertTrue(similar[0].score >= similar[1].score)


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
