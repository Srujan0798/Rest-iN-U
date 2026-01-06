"""
=============================================================================
COLLABORATIVE FILTERING IMPLEMENTATION
REST-iN-U Platform - User-Based Collaborative Filtering
=============================================================================

Implements user-based collaborative filtering for property recommendations.

Algorithm:
1. Build user-item interaction matrix (sparse)
2. Calculate user-user cosine similarity
3. Find K most similar users
4. Generate recommendations from similar users' interactions

Author: REST-iN-U Team
Date: January 6, 2026
Version: 1.0.0
"""

import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List, Tuple, Set
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)


@dataclass
class UserInteraction:
    """User interaction with a property"""
    user_id: str
    property_id: str
    interaction_type: str  # 'view' or 'favorite'
    weight: float
    timestamp: str


@dataclass
class SimilarUser:
    """Similar user with similarity score"""
    user_id: str
    similarity_score: float


class CollaborativeFilter:
    """
    User-Based Collaborative Filtering
    
    Features:
    - Sparse matrix representation (memory efficient)
    - Cosine similarity for user-user similarity
    - Configurable K (number of similar users)
    - Weighted interactions (favorites > views)
    - Cold start handling
    """
    
    def __init__(self, k_neighbors: int = 10, min_common_items: int = 3):
        """
        Initialize collaborative filter
        
        Args:
            k_neighbors: Number of similar users to consider
            min_common_items: Minimum common items for similarity calculation
        """
        self.k_neighbors = k_neighbors
        self.min_common_items = min_common_items
        self.interaction_weights = {
            'view': 1.0,
            'favorite': 2.0
        }
        
        # Cache
        self.user_item_matrix = None
        self.user_similarity_matrix = None
        self.user_id_to_index = {}
        self.index_to_user_id = {}
        self.property_id_to_index = {}
        self.index_to_property_id = {}
        
        logger.info(f"CollaborativeFilter initialized (k={k_neighbors})")
    
    # =========================================================================
    # PUBLIC API
    # =========================================================================
    
    def build_interaction_matrix(self, interactions: List[UserInteraction]):
        """
        Build user-item interaction matrix from interactions
        
        Args:
            interactions: List of user interactions
        """
        logger.info(f"Building interaction matrix from {len(interactions)} interactions")
        
        # Create mappings
        unique_users = sorted(set(i.user_id for i in interactions))
        unique_properties = sorted(set(i.property_id for i in interactions))
        
        self.user_id_to_index = {uid: idx for idx, uid in enumerate(unique_users)}
        self.index_to_user_id = {idx: uid for uid, idx in self.user_id_to_index.items()}
        self.property_id_to_index = {pid: idx for idx, pid in enumerate(unique_properties)}
        self.index_to_property_id = {idx: pid for pid, idx in self.property_id_to_index.items()}
        
        # Build matrix
        n_users = len(unique_users)
        n_properties = len(unique_properties)
        
        # Use sparse matrix for efficiency
        rows = []
        cols = []
        data = []
        
        for interaction in interactions:
            user_idx = self.user_id_to_index[interaction.user_id]
            prop_idx = self.property_id_to_index[interaction.property_id]
            weight = interaction.weight
            
            rows.append(user_idx)
            cols.append(prop_idx)
            data.append(weight)
        
        self.user_item_matrix = csr_matrix(
            (data, (rows, cols)),
            shape=(n_users, n_properties)
        )
        
        logger.info(f"Matrix built: {n_users} users × {n_properties} properties")
        logger.info(f"Sparsity: {100 * (1 - self.user_item_matrix.nnz / (n_users * n_properties)):.2f}%")
    
    def calculate_user_similarities(self):
        """
        Calculate user-user similarity matrix using cosine similarity
        """
        if self.user_item_matrix is None:
            raise ValueError("Interaction matrix not built. Call build_interaction_matrix first.")
        
        logger.info("Calculating user-user similarities...")
        
        # Cosine similarity
        self.user_similarity_matrix = cosine_similarity(self.user_item_matrix)
        
        # Set diagonal to 0 (user is not similar to themselves)
        np.fill_diagonal(self.user_similarity_matrix, 0)
        
        logger.info(f"Similarity matrix calculated: {self.user_similarity_matrix.shape}")
    
    def find_similar_users(self, user_id: str, k: int = None) -> List[SimilarUser]:
        """
        Find K most similar users to a given user
        
        Args:
            user_id: Target user ID
            k: Number of similar users (default: self.k_neighbors)
        
        Returns:
            List of SimilarUser objects
        """
        if k is None:
            k = self.k_neighbors
        
        if user_id not in self.user_id_to_index:
            logger.warning(f"User {user_id} not in matrix")
            return []
        
        user_idx = self.user_id_to_index[user_id]
        similarities = self.user_similarity_matrix[user_idx]
        
        # Get top K similar users
        top_k_indices = np.argsort(similarities)[-k:][::-1]
        
        similar_users = []
        for idx in top_k_indices:
            if similarities[idx] > 0:  # Only positive similarities
                similar_users.append(SimilarUser(
                    user_id=self.index_to_user_id[idx],
                    similarity_score=similarities[idx]
                ))
        
        logger.info(f"Found {len(similar_users)} similar users for {user_id}")
        return similar_users
    
    def calculate_cf_scores(self, user_id: str, 
                           candidate_properties: List[str]) -> Dict[str, float]:
        """
        Calculate collaborative filtering scores for candidate properties
        
        Args:
            user_id: Target user ID
            candidate_properties: List of property IDs to score
        
        Returns:
            Dict mapping property_id to CF score
        """
        # Find similar users
        similar_users = self.find_similar_users(user_id)
        
        if not similar_users:
            logger.warning(f"No similar users found for {user_id}")
            return {pid: 0.0 for pid in candidate_properties}
        
        # Calculate scores
        scores = {}
        
        for prop_id in candidate_properties:
            if prop_id not in self.property_id_to_index:
                scores[prop_id] = 0.0
                continue
            
            prop_idx = self.property_id_to_index[prop_id]
            score = 0.0
            total_similarity = 0.0
            
            for similar_user in similar_users:
                if similar_user.user_id not in self.user_id_to_index:
                    continue
                
                similar_user_idx = self.user_id_to_index[similar_user.user_id]
                interaction_score = self.user_item_matrix[similar_user_idx, prop_idx]
                
                if interaction_score > 0:
                    score += similar_user.similarity_score * interaction_score
                    total_similarity += similar_user.similarity_score
            
            # Normalize by total similarity
            if total_similarity > 0:
                scores[prop_id] = score / total_similarity
            else:
                scores[prop_id] = 0.0
        
        return scores
    
    def get_user_interactions(self, user_id: str) -> Set[str]:
        """
        Get set of property IDs user has interacted with
        
        Args:
            user_id: User ID
        
        Returns:
            Set of property IDs
        """
        if user_id not in self.user_id_to_index:
            return set()
        
        user_idx = self.user_id_to_index[user_id]
        interacted_indices = self.user_item_matrix[user_idx].nonzero()[1]
        
        return {self.index_to_property_id[idx] for idx in interacted_indices}
    
    # =========================================================================
    # UTILITY METHODS
    # =========================================================================
    
    def get_matrix_stats(self) -> Dict:
        """Get statistics about the interaction matrix"""
        if self.user_item_matrix is None:
            return {}
        
        n_users, n_properties = self.user_item_matrix.shape
        n_interactions = self.user_item_matrix.nnz
        sparsity = 100 * (1 - n_interactions / (n_users * n_properties))
        
        return {
            'n_users': n_users,
            'n_properties': n_properties,
            'n_interactions': n_interactions,
            'sparsity_percent': round(sparsity, 2),
            'avg_interactions_per_user': round(n_interactions / n_users, 2),
            'avg_interactions_per_property': round(n_interactions / n_properties, 2)
        }


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def create_interactions_from_db(views: List[Dict], 
                               favorites: List[Dict]) -> List[UserInteraction]:
    """
    Create UserInteraction objects from database records
    
    Args:
        views: List of PropertyView records
        favorites: List of Favorite records
    
    Returns:
        List of UserInteraction objects
    """
    interactions = []
    
    # Add views
    for view in views:
        interactions.append(UserInteraction(
            user_id=view['userId'],
            property_id=view['propertyId'],
            interaction_type='view',
            weight=1.0,
            timestamp=view.get('timestamp', '')
        ))
    
    # Add favorites (higher weight)
    for favorite in favorites:
        interactions.append(UserInteraction(
            user_id=favorite['userId'],
            property_id=favorite['propertyId'],
            interaction_type='favorite',
            weight=2.0,
            timestamp=favorite.get('timestamp', '')
        ))
    
    return interactions


# =============================================================================
# MODULE EXPORTS
# =============================================================================

__all__ = [
    'CollaborativeFilter',
    'UserInteraction',
    'SimilarUser',
    'create_interactions_from_db'
]
