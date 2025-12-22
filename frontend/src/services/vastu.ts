// ============================================================================
// Vastu Shastra Analysis Service
// ============================================================================

import { apiClient } from '@/services/api';

// ============================================================================
// Types
// ============================================================================

export interface VastuDirection {
  name: string;
  degree: number;
  element: string;
  deity: string;
  color: string;
  favorable: boolean;
  recommendations: string[];
}

export interface VastuZone {
  id: string;
  name: string;
  direction: string;
  purpose: string;
  currentUsage?: string;
  score: number;
  issues: VastuIssue[];
  recommendations: VastuRecommendation[];
}

export interface VastuIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  impact: string;
  location: string;
}

export interface VastuRecommendation {
  id: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  title: string;
  description: string;
  implementation: string;
  estimatedCost?: {
    min: number;
    max: number;
    currency: string;
  };
  difficulty: 'easy' | 'moderate' | 'complex';
}

export interface VastuScore {
  overall: number;
  entrance: number;
  kitchen: number;
  bedroom: number;
  bathroom: number;
  livingRoom: number;
  poojaRoom: number;
  study: number;
  garden: number;
  parking: number;
}

export interface VastuAnalysis {
  id: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
  score: VastuScore;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  zones: VastuZone[];
  issues: VastuIssue[];
  recommendations: VastuRecommendation[];
  floorPlan?: {
    imageUrl: string;
    annotations: VastuAnnotation[];
  };
  astrologyCompatibility?: AstrologyCompatibility;
}

export interface VastuAnnotation {
  id: string;
  x: number;
  y: number;
  type: 'positive' | 'negative' | 'neutral';
  label: string;
  description: string;
}

export interface AstrologyCompatibility {
  overallScore: number;
  zodiacSign: string;
  nakshatra?: string;
  matchingFactors: {
    factor: string;
    score: number;
    description: string;
  }[];
  auspiciousDates: {
    date: string;
    muhurta: string;
    significance: string;
  }[];
}

export interface PropertyVastuInput {
  propertyId: string;
  floorPlanImage?: File;
  entranceDirection: string;
  plotShape: 'square' | 'rectangle' | 'irregular' | 'L-shaped' | 'T-shaped';
  facing: string;
  totalFloors: number;
  rooms: {
    type: string;
    direction: string;
    floor: number;
  }[];
  surroundings?: {
    north?: string;
    south?: string;
    east?: string;
    west?: string;
  };
}

export interface BuyerVastuInput {
  dateOfBirth: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  zodiacSign?: string;
}

// ============================================================================
// Constants
// ============================================================================

export const VASTU_DIRECTIONS = [
  { name: 'North', degree: 0, element: 'Water', deity: 'Kubera', color: '#3B82F6', favorable: true },
  { name: 'Northeast', degree: 45, element: 'Water', deity: 'Ishanya', color: '#60A5FA', favorable: true },
  { name: 'East', degree: 90, element: 'Air', deity: 'Indra', color: '#F59E0B', favorable: true },
  { name: 'Southeast', degree: 135, element: 'Fire', deity: 'Agni', color: '#EF4444', favorable: false },
  { name: 'South', degree: 180, element: 'Fire', deity: 'Yama', color: '#DC2626', favorable: false },
  { name: 'Southwest', degree: 225, element: 'Earth', deity: 'Nirruti', color: '#A3A3A3', favorable: true },
  { name: 'West', degree: 270, element: 'Water', deity: 'Varuna', color: '#2563EB', favorable: true },
  { name: 'Northwest', degree: 315, element: 'Air', deity: 'Vayu', color: '#A855F7', favorable: false },
] as const;

export const VASTU_ROOM_PLACEMENTS = {
  entrance: ['North', 'East', 'Northeast'],
  kitchen: ['Southeast', 'East', 'Northwest'],
  masterBedroom: ['Southwest', 'South', 'West'],
  guestBedroom: ['Northwest', 'West'],
  bathroom: ['Northwest', 'West'],
  poojaRoom: ['Northeast', 'East'],
  livingRoom: ['North', 'East', 'Northeast'],
  diningRoom: ['West', 'East'],
  study: ['Northeast', 'East', 'North'],
  staircase: ['South', 'Southwest', 'West'],
  garage: ['Northwest', 'Southeast'],
  garden: ['North', 'East', 'Northeast'],
  waterTank: ['Northeast', 'North'],
  septicTank: ['Northwest', 'West'],
} as const;

export const VASTU_COLORS = {
  North: { primary: '#2563EB', secondary: '#60A5FA' },
  Northeast: { primary: '#3B82F6', secondary: '#93C5FD' },
  East: { primary: '#F59E0B', secondary: '#FCD34D' },
  Southeast: { primary: '#EF4444', secondary: '#FCA5A5' },
  South: { primary: '#DC2626', secondary: '#F87171' },
  Southwest: { primary: '#78716C', secondary: '#A8A29E' },
  West: { primary: '#0EA5E9', secondary: '#7DD3FC' },
  Northwest: { primary: '#8B5CF6', secondary: '#C4B5FD' },
} as const;

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Analyze property for Vastu compliance
 */
export async function analyzeProperty(input: PropertyVastuInput): Promise<VastuAnalysis> {
  const formData = new FormData();
  formData.append('propertyId', input.propertyId);
  formData.append('entranceDirection', input.entranceDirection);
  formData.append('plotShape', input.plotShape);
  formData.append('facing', input.facing);
  formData.append('totalFloors', input.totalFloors.toString());
  formData.append('rooms', JSON.stringify(input.rooms));
  
  if (input.floorPlanImage) {
    formData.append('floorPlan', input.floorPlanImage);
  }
  
  if (input.surroundings) {
    formData.append('surroundings', JSON.stringify(input.surroundings));
  }

  const response = await apiClient.post<VastuAnalysis>('/vastu/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response.data;
}

/**
 * Get Vastu analysis for a property
 */
export async function getPropertyAnalysis(propertyId: string): Promise<VastuAnalysis | null> {
  try {
    const response = await apiClient.get<VastuAnalysis>(`/vastu/property/${propertyId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

/**
 * Calculate buyer-property Vastu compatibility
 */
export async function calculateCompatibility(
  propertyId: string,
  buyerInput: BuyerVastuInput
): Promise<AstrologyCompatibility> {
  const response = await apiClient.post<AstrologyCompatibility>(
    `/vastu/compatibility/${propertyId}`,
    buyerInput
  );
  return response.data;
}

/**
 * Get Vastu recommendations for improvements
 */
export async function getRecommendations(
  analysisId: string,
  options?: { budget?: number; priorityOnly?: boolean }
): Promise<VastuRecommendation[]> {
  const response = await apiClient.get<VastuRecommendation[]>(
    `/vastu/recommendations/${analysisId}`,
    { params: options }
  );
  return response.data;
}

/**
 * Get auspicious dates for property transactions
 */
export async function getAuspiciousDates(
  propertyId: string,
  dateRange: { from: string; to: string },
  purpose: 'purchase' | 'registration' | 'griha_pravesh' | 'renovation'
): Promise<{ date: string; muhurta: string; significance: string }[]> {
  const response = await apiClient.get(`/vastu/auspicious-dates/${propertyId}`, {
    params: { ...dateRange, purpose },
  });
  return response.data;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get Vastu score grade
 */
export function getVastuGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

/**
 * Get Vastu score color
 */
export function getVastuScoreColor(score: number): string {
  if (score >= 80) return '#22C55E'; // Green
  if (score >= 60) return '#F59E0B'; // Yellow/Amber
  if (score >= 40) return '#F97316'; // Orange
  return '#EF4444'; // Red
}

/**
 * Get Vastu score label
 */
export function getVastuScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Satisfactory';
  if (score >= 40) return 'Needs Improvement';
  return 'Poor';
}

/**
 * Check if room placement is Vastu-compliant
 */
export function isVastuCompliant(
  roomType: keyof typeof VASTU_ROOM_PLACEMENTS,
  direction: string
): boolean {
  const idealDirections = VASTU_ROOM_PLACEMENTS[roomType];
  return idealDirections.includes(direction as never);
}

/**
 * Get ideal directions for a room type
 */
export function getIdealDirections(
  roomType: keyof typeof VASTU_ROOM_PLACEMENTS
): readonly string[] {
  return VASTU_ROOM_PLACEMENTS[roomType] || [];
}

/**
 * Calculate direction from degrees
 */
export function getDirectionFromDegree(degree: number): string {
  const normalized = ((degree % 360) + 360) % 360;
  
  if (normalized >= 337.5 || normalized < 22.5) return 'North';
  if (normalized >= 22.5 && normalized < 67.5) return 'Northeast';
  if (normalized >= 67.5 && normalized < 112.5) return 'East';
  if (normalized >= 112.5 && normalized < 157.5) return 'Southeast';
  if (normalized >= 157.5 && normalized < 202.5) return 'South';
  if (normalized >= 202.5 && normalized < 247.5) return 'Southwest';
  if (normalized >= 247.5 && normalized < 292.5) return 'West';
  return 'Northwest';
}

/**
 * Get direction info
 */
export function getDirectionInfo(direction: string): typeof VASTU_DIRECTIONS[number] | undefined {
  return VASTU_DIRECTIONS.find(
    (d) => d.name.toLowerCase() === direction.toLowerCase()
  );
}

/**
 * Format Vastu issue severity
 */
export function formatIssueSeverity(severity: VastuIssue['severity']): {
  label: string;
  color: string;
  bgColor: string;
} {
  const severityMap = {
    low: { label: 'Low', color: '#22C55E', bgColor: '#DCFCE7' },
    medium: { label: 'Medium', color: '#F59E0B', bgColor: '#FEF3C7' },
    high: { label: 'High', color: '#F97316', bgColor: '#FFEDD5' },
    critical: { label: 'Critical', color: '#EF4444', bgColor: '#FEE2E2' },
  };
  return severityMap[severity];
}

/**
 * Format recommendation priority
 */
export function formatRecommendationPriority(priority: VastuRecommendation['priority']): {
  label: string;
  color: string;
} {
  const priorityMap = {
    low: { label: 'Optional', color: '#6B7280' },
    medium: { label: 'Recommended', color: '#3B82F6' },
    high: { label: 'Important', color: '#EF4444' },
  };
  return priorityMap[priority];
}

/**
 * Generate Vastu compass SVG path
 */
export function generateCompassPath(centerX: number, centerY: number, radius: number): string {
  const points: string[] = [];
  
  VASTU_DIRECTIONS.forEach((dir, index) => {
    const angle = (dir.degree - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${index === 0 ? 'M' : 'L'} ${x} ${y}`);
  });
  
  return points.join(' ') + ' Z';
}

/**
 * Calculate overall Vastu score from zones
 */
export function calculateOverallScore(zones: VastuZone[]): number {
  if (zones.length === 0) return 0;
  
  const weights: Record<string, number> = {
    entrance: 15,
    kitchen: 12,
    masterBedroom: 12,
    bathroom: 8,
    livingRoom: 10,
    poojaRoom: 10,
    study: 8,
    garden: 5,
    parking: 5,
    other: 5,
  };
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  zones.forEach((zone) => {
    const weight = weights[zone.name.toLowerCase().replace(/\s/g, '')] || weights.other;
    totalWeight += weight;
    weightedSum += zone.score * weight;
  });
  
  return Math.round(weightedSum / totalWeight);
}

export default {
  analyzeProperty,
  getPropertyAnalysis,
  calculateCompatibility,
  getRecommendations,
  getAuspiciousDates,
  getVastuGrade,
  getVastuScoreColor,
  getVastuScoreLabel,
  isVastuCompliant,
  getIdealDirections,
  getDirectionFromDegree,
  getDirectionInfo,
  formatIssueSeverity,
  formatRecommendationPriority,
  calculateOverallScore,
};
