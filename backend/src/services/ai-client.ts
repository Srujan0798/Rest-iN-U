import axios from 'axios';
import { logger } from '../utils/logger';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export interface RecommendationResult {
  property_id: string;
  score: number;
  explanation: string;
  source: string;
}

export const aiClient = {
  /**
   * Get property recommendations for a user
   */
  async getRecommendations(userId: string, limit: number = 20): Promise<RecommendationResult[]> {
    try {
      logger.info(`Fetching recommendations for user ${userId} from ${AI_SERVICE_URL}`);
      const response = await axios.post(`${AI_SERVICE_URL}/recommend`, {
        user_id: userId,
        limit,
      });

      if (response.data && response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      logger.error('Error fetching recommendations from AI service:', error);
      // Return empty array on error so the main app doesn't crash
      return [];
    }
  },

  /**
   * Predict price for a property
   */
  async predictPrice(features: any): Promise<number | null> {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/predict-price`, features);
      if (response.data && response.data.success) {
        return response.data.predicted_price;
      }
      return null;
    } catch (error) {
      logger.error('Error predicting price from AI service:', error);
      return null;
    }
  }
};
