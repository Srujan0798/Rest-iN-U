import unittest
from unittest.mock import MagicMock, Mock
import sys
import os

# =============================================================================
# LIGHTWEIGHT TEST SUITE
# Mocks heavy dependencies (numpy, pandas, sklearn, redis) to allow testing logic
# without full ML environment installation.
# =============================================================================

# Custom Mock Array to handle numpy array methods like reshape
class MockArray(list):
    def __new__(cls, *args, **kwargs):
        return super(MockArray, cls).__new__(cls, *args, **kwargs)

    def __init__(self, *args, **kwargs):
        # Handle case where numpy array is initialized with a list
        if args and isinstance(args[0], list):
             super().__init__(args[0])
        else:
             super().__init__(*args, **kwargs)

    def reshape(self, *args):
        return self

    @property
    def shape(self):
        return (len(self),)

# 1. Mock numpy
mock_np = MagicMock()
mock_np.array.side_effect = lambda x: MockArray(x)  # Return MockArray instead of plain list
mock_np.mean.return_value = 0.5
mock_np.zeros.return_value = []
mock_np.argsort.return_value = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
mock_np.fill_diagonal = MagicMock()
sys.modules['numpy'] = mock_np

# 2. Mock pandas
mock_pd = MagicMock()
sys.modules['pandas'] = mock_pd

# 3. Mock sklearn
mock_sklearn = MagicMock()
mock_sklearn_metrics = MagicMock()

# Dynamic side effect for cosine_similarity
def cosine_similarity_side_effect(X, Y=None, dense_output=True):
    # X is target features (shape 1, M)
    # Y is candidate features (shape N, M)
    # Should return (1, N)

    if Y is not None:
        n_candidates = len(Y)
        # Return a list of lists (matrix)
        # 1 row, N columns
        return [[0.9] * n_candidates]

    # If Y is None, it compares X with X
    n_samples = len(X)
    return [[1.0] * n_samples for _ in range(n_samples)]

mock_sklearn_metrics.pairwise.cosine_similarity.side_effect = cosine_similarity_side_effect

mock_sklearn.metrics = mock_sklearn_metrics
mock_sklearn.metrics.pairwise = mock_sklearn_metrics.pairwise

mock_sklearn_feature = MagicMock()
mock_sklearn.feature_extraction = mock_sklearn_feature
mock_sklearn.feature_extraction.text = MagicMock()
sys.modules['sklearn'] = mock_sklearn
sys.modules['sklearn.metrics'] = mock_sklearn_metrics
sys.modules['sklearn.metrics.pairwise'] = mock_sklearn_metrics.pairwise
sys.modules['sklearn.feature_extraction'] = mock_sklearn_feature
sys.modules['sklearn.feature_extraction.text'] = mock_sklearn_feature.text

# 4. Mock redis
mock_redis_module = MagicMock()
sys.modules['redis'] = mock_redis_module

# 5. Mock scipy
mock_scipy = MagicMock()
mock_scipy.sparse = MagicMock()
mock_scipy.sparse.csr_matrix.return_value = MagicMock()
sys.modules['scipy'] = mock_scipy
sys.modules['scipy.sparse'] = mock_scipy.sparse

# =============================================================================
# IMPORT SYSTEM UNDER TEST
# =============================================================================

# Ensure we can import from the current directory structure
# This expects to be run from repo root
if os.path.join(os.getcwd(), 'backend') not in sys.path:
    sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    from ai_ml.recommendation_engine import RecommendationEngine, RecommendationResult, UserProfile
except ImportError:
    # If running from inside backend/
    sys.path.append(os.getcwd())
    from ai_ml.recommendation_engine import RecommendationEngine, RecommendationResult, UserProfile

# =============================================================================
# TEST SUITE
# =============================================================================

class TestRecommendationEngineLight(unittest.TestCase):
    """Test suite for RecommendationEngine with Mocked Dependencies"""

    def setUp(self):
        """Set up test fixtures"""
        self.mock_redis = Mock()
        self.mock_db = Mock()
        self.engine = RecommendationEngine(
            redis_client=self.mock_redis,
            db_client=self.mock_db
        )

        # Override internal methods that might rely on complex DB logic
        # or that we want to control for unit testing
        self.engine._get_user_views = Mock(return_value=[])
        self.engine._get_user_favorites = Mock(return_value=[])

    def test_initialization(self):
        """Test that engine initializes without error"""
        self.assertIsNotNone(self.engine)
        self.assertIsNotNone(self.engine.collaborative_filter)

    def test_cold_start_recommendations(self):
        """Test recommendations for a new user (cold start)"""
        # Should return trending properties
        recommendations, cache_hit = self.engine.get_recommendations("new-user", limit=5)

        self.assertEqual(len(recommendations), 5)
        self.assertEqual(recommendations[0].source, 'trending')
        self.assertFalse(cache_hit)

        # Verify redis caching was attempted
        self.mock_redis.setex.assert_called_once()

    def test_personalized_recommendations_flow(self):
        """Test the flow for personalized recommendations"""
        # Mock enough interactions to trigger personalization (limit is 5)
        self.engine._get_user_views.return_value = [
            {'property_id': 'PROP-101', 'timestamp': '2023-01-01'},
            {'property_id': 'PROP-102', 'timestamp': '2023-01-02'},
            {'property_id': 'PROP-103', 'timestamp': '2023-01-03'}
        ]
        self.engine._get_user_favorites.return_value = [
             {'property_id': 'PROP-104', 'timestamp': '2023-01-04'},
             {'property_id': 'PROP-105', 'timestamp': '2023-01-05'}
        ]

        # Mock _get_active_properties to return some candidates
        candidates = []
        for i in range(10):
            candidates.append({
                "id": f"PROP-{i:03d}",
                "price": 5000000,
                "bedrooms": 2,
                "bathrooms": 2,
                "squareFeet": 1000,
                "city": "Mumbai",
                "propertyType": "APARTMENT",
                "vastuScore": 80,
                "daysOnMarket": 10
            })
        self.engine._get_active_properties = Mock(return_value=candidates)

        # Mock property fetch for profile extraction
        self.engine._get_property_by_id = Mock(return_value={
                "id": "PROP-OLD",
                "price": 5000000,
                "bedrooms": 2,
                "bathrooms": 2,
                "squareFeet": 1000,
                "city": "Mumbai",
                "propertyType": "APARTMENT"
        })

        # We need to ensure collaborative_filter doesn't crash
        self.engine.collaborative_filter.calculate_cf_scores = Mock(return_value={})

        recommendations, cache_hit = self.engine.get_recommendations("active-user", limit=5)

        # Should return personalized results (hybrid)
        # Note: Since our mocks return 0 scores mostly, it might fallback or return low scores
        # But source should be 'hybrid'
        self.assertEqual(len(recommendations), 5)
        self.assertEqual(recommendations[0].source, 'hybrid')

    def test_similar_properties_mocked(self):
        """Test get_similar_properties with mocked similarity"""
        # Mock target property
        self.engine._get_property_by_id = Mock(return_value={
             "id": "PROP-TARGET",
             "price": 10000000,
             "propertyType": "APARTMENT"
        })

        # Mock candidates
        self.engine._get_active_properties = Mock(return_value=[
             {"id": "PROP-1", "price": 10000000, "propertyType": "APARTMENT"},
             {"id": "PROP-2", "price": 10000000, "propertyType": "APARTMENT"}
        ])

        # Run
        recs = self.engine.get_similar_properties("PROP-TARGET", limit=2)

        # Verify
        self.assertEqual(len(recs), 2)
        self.assertEqual(recs[0].source, 'content-based')


if __name__ == '__main__':
    unittest.main()
