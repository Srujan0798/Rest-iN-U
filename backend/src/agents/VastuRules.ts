// VastuRules.ts - Comprehensive Vastu Shastra Rule Engine
// Based on ancient Vastu Vidya principles for property analysis

export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'CENTER';
export type Severity = 'critical' | 'major' | 'minor';
export type Element = 'fire' | 'water' | 'earth' | 'air' | 'space';
export type RoomType = 'kitchen' | 'masterbedroom' | 'bedroom' | 'bathroom' | 'toilet' | 'poojaroom' | 'livingroom' | 'diningroom' | 'study' | 'guestroom' | 'storeroom' | 'garage' | 'balcony' | 'staircase' | 'entrance';

export interface VastuRule {
  id: string;
  category: string;
  subcategory?: string;
  name: string;
  description: string;
  principle: string;
  direction?: Direction | Direction[];
  roomType?: RoomType;
  element?: Element;
  idealCondition: string;
  defectCondition: string;
  severity: Severity;
  scoreImpact: number; // Negative impact when violated
  deity?: string;
  remedy?: VastuRemedy[];
}

export interface VastuRemedy {
  id: string;
  type: 'structural' | 'placement' | 'symbolic' | 'color' | 'element' | 'yantra' | 'mantra';
  description: string;
  costEstimate: { min: number; max: number; currency: string };
  effectiveness: number; // 0-100
  difficulty: 'low' | 'medium' | 'high';
  timeToImplement: string;
  materials?: string[];
}

// Direction Properties
export const DIRECTION_PROPERTIES: Record<Direction, {
  deity: string;
  element: Element;
  planetaryRuler: string;
  color: string[];
  idealFor: string[];
  avoidFor: string[];
  energyType: string;
}> = {
  N: {
    deity: 'Kubera (Lord of Wealth)',
    element: 'water',
    planetaryRuler: 'Mercury',
    color: ['green', 'blue'],
    idealFor: ['living room', 'safe', 'cash locker', 'open space'],
    avoidFor: ['toilet', 'septic tank', 'kitchen'],
    energyType: 'prosperity'
  },
  NE: {
    deity: 'Ishaan (Lord Shiva)',
    element: 'water',
    planetaryRuler: 'Jupiter',
    color: ['white', 'light blue', 'cream'],
    idealFor: ['pooja room', 'meditation', 'well', 'water tank', 'open space'],
    avoidFor: ['toilet', 'kitchen', 'bedroom', 'heavy storage', 'septic tank'],
    energyType: 'spiritual_prosperity'
  },
  E: {
    deity: 'Indra (King of Gods)',
    element: 'air',
    planetaryRuler: 'Sun',
    color: ['white', 'light green', 'cream'],
    idealFor: ['entrance', 'living room', 'bathroom', 'study', 'children room'],
    avoidFor: ['toilet', 'septic tank', 'staircase'],
    energyType: 'health_success'
  },
  SE: {
    deity: 'Agni (Fire God)',
    element: 'fire',
    planetaryRuler: 'Venus',
    color: ['orange', 'red', 'pink'],
    idealFor: ['kitchen', 'electrical room', 'generator', 'furnace'],
    avoidFor: ['bedroom', 'water tank', 'well', 'bore well'],
    energyType: 'energy_vitality'
  },
  S: {
    deity: 'Yama (Lord of Death)',
    element: 'fire',
    planetaryRuler: 'Mars',
    color: ['red', 'coral', 'maroon'],
    idealFor: ['storeroom', 'garage', 'heavy storage'],
    avoidFor: ['entrance', 'well', 'water tank', 'pooja room'],
    energyType: 'stability'
  },
  SW: {
    deity: 'Nairutya (Demon Lord)',
    element: 'earth',
    planetaryRuler: 'Rahu',
    color: ['brown', 'yellow', 'peach'],
    idealFor: ['master bedroom', 'heavy storage', 'overhead tank'],
    avoidFor: ['entrance', 'toilet', 'well', 'kitchen', 'children room'],
    energyType: 'stability_strength'
  },
  W: {
    deity: 'Varuna (Water God)',
    element: 'water',
    planetaryRuler: 'Saturn',
    color: ['blue', 'white', 'grey'],
    idealFor: ['dining room', 'children room', 'study', 'bathroom'],
    avoidFor: ['entrance', 'kitchen'],
    energyType: 'creativity'
  },
  NW: {
    deity: 'Vayu (Wind God)',
    element: 'air',
    planetaryRuler: 'Moon',
    color: ['white', 'grey', 'cream'],
    idealFor: ['guest room', 'bathroom', 'garage', 'servant quarter'],
    avoidFor: ['master bedroom', 'pooja room', 'cash locker'],
    energyType: 'movement_change'
  },
  CENTER: {
    deity: 'Brahma (Creator)',
    element: 'space',
    planetaryRuler: 'All planets',
    color: ['white', 'light yellow'],
    idealFor: ['courtyard', 'open space', 'living area'],
    avoidFor: ['toilet', 'kitchen', 'bedroom', 'staircase', 'pillar'],
    energyType: 'cosmic_balance'
  }
};

// 50+ Core Vastu Rules
export const VASTU_RULES_ENGINE: VastuRule[] = [
  // ============================================
  // ENTRANCE RULES (1-10)
  // ============================================
  {
    id: 'ENT-001',
    category: 'entrance',
    name: 'North-East Entrance',
    description: 'Main entrance in North-East direction',
    principle: 'NE entrance receives divine energy from Ishaan corner, bringing prosperity and spiritual growth',
    direction: 'NE',
    idealCondition: 'Main door faces North-East with clear approach',
    defectCondition: 'Entrance blocked, obstructed, or poorly maintained',
    severity: 'major',
    scoreImpact: -15,
    deity: 'Ishaan (Shiva)',
    remedy: [
      {
        id: 'ENT-001-R1',
        type: 'structural',
        description: 'Create or relocate main entrance to North-East',
        costEstimate: { min: 50000, max: 200000, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'high',
        timeToImplement: '2-4 weeks'
      },
      {
        id: 'ENT-001-R2',
        type: 'symbolic',
        description: 'Place Swastika or Om symbol on door, install brass threshold',
        costEstimate: { min: 500, max: 2000, currency: 'INR' },
        effectiveness: 40,
        difficulty: 'low',
        timeToImplement: '1 day'
      }
    ]
  },
  {
    id: 'ENT-002',
    category: 'entrance',
    name: 'South-West Entrance Defect',
    description: 'Main entrance should not be in South-West',
    principle: 'SW entrance allows negative energy (Nairutya) to enter, causing financial losses and health issues',
    direction: 'SW',
    idealCondition: 'No main entrance in South-West',
    defectCondition: 'Main entrance located in South-West direction',
    severity: 'critical',
    scoreImpact: -25,
    deity: 'Nairutya',
    remedy: [
      {
        id: 'ENT-002-R1',
        type: 'structural',
        description: 'Create new entrance in North, East, or North-East and seal SW entrance',
        costEstimate: { min: 75000, max: 300000, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'high',
        timeToImplement: '4-6 weeks'
      },
      {
        id: 'ENT-002-R2',
        type: 'placement',
        description: 'Place large Ganesha idol outside facing outward, brass Vastu pyramid inside',
        costEstimate: { min: 2000, max: 10000, currency: 'INR' },
        effectiveness: 55,
        difficulty: 'low',
        timeToImplement: '1 day'
      },
      {
        id: 'ENT-002-R3',
        type: 'color',
        description: 'Paint door in deep green color, place green plants on either side',
        costEstimate: { min: 1000, max: 5000, currency: 'INR' },
        effectiveness: 35,
        difficulty: 'low',
        timeToImplement: '1-2 days'
      }
    ]
  },
  {
    id: 'ENT-003',
    category: 'entrance',
    name: 'East Entrance Blessing',
    description: 'Main entrance facing East',
    principle: 'East entrance receives morning sun energy (Surya), promoting health and success',
    direction: 'E',
    idealCondition: 'Main door faces East with unobstructed sunrise view',
    defectCondition: 'East entrance blocked by building, tree, or wall',
    severity: 'major',
    scoreImpact: -12,
    deity: 'Indra'
  },
  {
    id: 'ENT-004',
    category: 'entrance',
    name: 'North Entrance Wealth',
    description: 'Main entrance facing North',
    principle: 'North entrance invites Kubera energy for wealth and prosperity',
    direction: 'N',
    idealCondition: 'Main door faces North, kept clean and well-lit',
    defectCondition: 'North entrance dark, cluttered, or below road level',
    severity: 'major',
    scoreImpact: -10,
    deity: 'Kubera'
  },
  {
    id: 'ENT-005',
    category: 'entrance',
    name: 'South Entrance Caution',
    description: 'South-facing entrance requires remedies',
    principle: 'South is ruled by Yama; needs proper remedies to balance fire energy',
    direction: 'S',
    idealCondition: 'South entrance with proper Vastu corrections applied',
    defectCondition: 'Uncorrected south entrance',
    severity: 'major',
    scoreImpact: -18,
    deity: 'Yama',
    remedy: [
      {
        id: 'ENT-005-R1',
        type: 'placement',
        description: 'Place Hanuman idol facing South, use red threshold',
        costEstimate: { min: 1500, max: 5000, currency: 'INR' },
        effectiveness: 50,
        difficulty: 'low',
        timeToImplement: '1 day'
      },
      {
        id: 'ENT-005-R2',
        type: 'yantra',
        description: 'Install Vastu Dosh Nivaran Yantra above door frame',
        costEstimate: { min: 500, max: 3000, currency: 'INR' },
        effectiveness: 45,
        difficulty: 'low',
        timeToImplement: '1 day'
      }
    ]
  },
  {
    id: 'ENT-006',
    category: 'entrance',
    name: 'Door Opening Direction',
    description: 'Main door should open inward clockwise',
    principle: 'Clockwise opening invites positive energy flow',
    idealCondition: 'Door opens inward to the right (clockwise when viewed from outside)',
    defectCondition: 'Door opens outward or anticlockwise',
    severity: 'minor',
    scoreImpact: -5
  },
  {
    id: 'ENT-007',
    category: 'entrance',
    name: 'Door Threshold',
    description: 'Main entrance must have threshold',
    principle: 'Threshold prevents negative energy from entering and retains positive energy',
    idealCondition: 'Wooden or marble threshold at main entrance',
    defectCondition: 'No threshold or broken threshold',
    severity: 'minor',
    scoreImpact: -5,
    remedy: [
      {
        id: 'ENT-007-R1',
        type: 'structural',
        description: 'Install brass or wooden threshold at main door',
        costEstimate: { min: 500, max: 3000, currency: 'INR' },
        effectiveness: 90,
        difficulty: 'low',
        timeToImplement: '1 day'
      }
    ]
  },
  {
    id: 'ENT-008',
    category: 'entrance',
    name: 'Entrance Obstacles',
    description: 'No obstacles directly facing main entrance',
    principle: 'Direct obstacles block positive energy from entering',
    idealCondition: 'Clear pathway at least 10 feet in front of entrance',
    defectCondition: 'Pillar, pole, tree, or wall directly facing entrance',
    severity: 'major',
    scoreImpact: -12,
    remedy: [
      {
        id: 'ENT-008-R1',
        type: 'structural',
        description: 'Remove or relocate the obstacle',
        costEstimate: { min: 5000, max: 50000, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'medium',
        timeToImplement: '1-2 weeks'
      },
      {
        id: 'ENT-008-R2',
        type: 'placement',
        description: 'Place convex mirror on door to deflect negative energy',
        costEstimate: { min: 200, max: 1000, currency: 'INR' },
        effectiveness: 40,
        difficulty: 'low',
        timeToImplement: '1 day'
      }
    ]
  },
  {
    id: 'ENT-009',
    category: 'entrance',
    name: 'Multiple Entrances',
    description: 'Avoid multiple main entrances',
    principle: 'Multiple entrances cause energy confusion and family disputes',
    idealCondition: 'Single prominent main entrance',
    defectCondition: 'Two or more equally prominent entrances',
    severity: 'minor',
    scoreImpact: -8
  },
  {
    id: 'ENT-010',
    category: 'entrance',
    name: 'Entrance Level',
    description: 'Entrance should be at road level or slightly elevated',
    principle: 'Lower entrance causes energy drain and water accumulation',
    idealCondition: 'Entrance 1-3 steps above road level',
    defectCondition: 'Entrance below road level',
    severity: 'major',
    scoreImpact: -15,
    remedy: [
      {
        id: 'ENT-010-R1',
        type: 'structural',
        description: 'Raise floor level at entrance or create stepped approach',
        costEstimate: { min: 10000, max: 50000, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'medium',
        timeToImplement: '1-2 weeks'
      }
    ]
  },

  // ============================================
  // KITCHEN RULES (11-18)
  // ============================================
  {
    id: 'KIT-001',
    category: 'kitchen',
    name: 'Kitchen in South-East',
    description: 'Kitchen should be in South-East (Agni) corner',
    principle: 'SE is ruled by Agni (Fire God), making it ideal for cooking and fire elements',
    direction: 'SE',
    roomType: 'kitchen',
    element: 'fire',
    idealCondition: 'Kitchen located in South-East corner of house',
    defectCondition: 'Kitchen not in South-East',
    severity: 'major',
    scoreImpact: -12,
    deity: 'Agni'
  },
  {
    id: 'KIT-002',
    category: 'kitchen',
    name: 'Kitchen in North-East Defect',
    description: 'Kitchen must never be in North-East',
    principle: 'NE is sacred Ishaan corner; fire element here destroys spiritual energy and causes health issues',
    direction: 'NE',
    roomType: 'kitchen',
    element: 'fire',
    idealCondition: 'Kitchen not in North-East',
    defectCondition: 'Kitchen located in North-East corner',
    severity: 'critical',
    scoreImpact: -25,
    remedy: [
      {
        id: 'KIT-002-R1',
        type: 'structural',
        description: 'Relocate kitchen to South-East or North-West',
        costEstimate: { min: 75000, max: 300000, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'high',
        timeToImplement: '4-6 weeks'
      },
      {
        id: 'KIT-002-R2',
        type: 'placement',
        description: 'Place large copper vessel with water in NE corner of kitchen, cook facing East',
        costEstimate: { min: 500, max: 2000, currency: 'INR' },
        effectiveness: 45,
        difficulty: 'low',
        timeToImplement: '1 day'
      },
      {
        id: 'KIT-002-R3',
        type: 'element',
        description: 'Add water element (aquarium/fountain) to balance fire energy',
        costEstimate: { min: 2000, max: 10000, currency: 'INR' },
        effectiveness: 40,
        difficulty: 'low',
        timeToImplement: '1-2 days'
      }
    ]
  },
  {
    id: 'KIT-003',
    category: 'kitchen',
    name: 'Cooking Direction',
    description: 'Person cooking should face East',
    principle: 'Facing East while cooking invokes Surya energy, enhancing food nutrition',
    direction: 'E',
    roomType: 'kitchen',
    idealCondition: 'Stove positioned so cook faces East',
    defectCondition: 'Cook faces West or South while cooking',
    severity: 'minor',
    scoreImpact: -5
  },
  {
    id: 'KIT-004',
    category: 'kitchen',
    name: 'Kitchen Sink Position',
    description: 'Sink should be in North-East of kitchen',
    principle: 'Water element belongs in NE; proper sink placement ensures elemental balance',
    direction: 'NE',
    roomType: 'kitchen',
    element: 'water',
    idealCondition: 'Sink in North or North-East of kitchen',
    defectCondition: 'Sink in South-East near stove',
    severity: 'minor',
    scoreImpact: -5
  },
  {
    id: 'KIT-005',
    category: 'kitchen',
    name: 'Stove Position',
    description: 'Stove should be in South-East of kitchen',
    principle: 'Fire element should be in SE corner even within the kitchen',
    direction: 'SE',
    roomType: 'kitchen',
    element: 'fire',
    idealCondition: 'Stove placed in South-East corner of kitchen',
    defectCondition: 'Stove placed in North-East or directly on North wall',
    severity: 'minor',
    scoreImpact: -5
  },
  {
    id: 'KIT-006',
    category: 'kitchen',
    name: 'Kitchen Below Toilet',
    description: 'Kitchen should not be below or above toilet',
    principle: 'Negative energy from toilet contaminates food preparation area',
    roomType: 'kitchen',
    idealCondition: 'Kitchen not vertically aligned with any toilet',
    defectCondition: 'Toilet directly above or below kitchen',
    severity: 'critical',
    scoreImpact: -20
  },
  {
    id: 'KIT-007',
    category: 'kitchen',
    name: 'Kitchen Colors',
    description: 'Kitchen should have warm colors',
    principle: 'Fire colors (orange, red, pink) enhance Agni energy',
    roomType: 'kitchen',
    idealCondition: 'Kitchen painted in orange, yellow, pink, or red shades',
    defectCondition: 'Kitchen in blue, black, or grey colors',
    severity: 'minor',
    scoreImpact: -3
  },
  {
    id: 'KIT-008',
    category: 'kitchen',
    name: 'Kitchen Storage',
    description: 'Heavy storage in South-West of kitchen',
    principle: 'SW corner should be heavy for stability, ideal for storage',
    direction: 'SW',
    roomType: 'kitchen',
    idealCondition: 'Heavy storage, refrigerator in South or South-West',
    defectCondition: 'Heavy items in North-East of kitchen',
    severity: 'minor',
    scoreImpact: -4
  },

  // ============================================
  // BEDROOM RULES (19-28)
  // ============================================
  {
    id: 'BED-001',
    category: 'bedroom',
    name: 'Master Bedroom in South-West',
    description: 'Master bedroom should be in South-West',
    principle: 'SW provides stability and authority for head of household',
    direction: 'SW',
    roomType: 'masterbedroom',
    element: 'earth',
    idealCondition: 'Master bedroom in South-West corner',
    defectCondition: 'Master bedroom in North-East',
    severity: 'major',
    scoreImpact: -15,
    deity: 'Nairutya'
  },
  {
    id: 'BED-002',
    category: 'bedroom',
    name: 'Bed Head Direction',
    description: 'Sleep with head towards South or East',
    principle: 'South direction aligns with Earth magnetic field; East receives positive solar energy',
    direction: ['S', 'E'],
    roomType: 'bedroom',
    idealCondition: 'Bed positioned with head towards South or East',
    defectCondition: 'Sleeping with head towards North',
    severity: 'major',
    scoreImpact: -10,
    remedy: [
      {
        id: 'BED-002-R1',
        type: 'placement',
        description: 'Reposition bed with head towards South',
        costEstimate: { min: 0, max: 500, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'low',
        timeToImplement: '1 hour'
      }
    ]
  },
  {
    id: 'BED-003',
    category: 'bedroom',
    name: 'Bedroom in North-East Defect',
    description: 'Bedroom should not be in North-East',
    principle: 'NE should be kept light and open; bedroom here blocks spiritual energy',
    direction: 'NE',
    roomType: 'bedroom',
    idealCondition: 'No bedroom in North-East',
    defectCondition: 'Bedroom in North-East corner',
    severity: 'major',
    scoreImpact: -15,
    remedy: [
      {
        id: 'BED-003-R1',
        type: 'structural',
        description: 'Convert NE bedroom to meditation room or study',
        costEstimate: { min: 20000, max: 75000, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'medium',
        timeToImplement: '2-3 weeks'
      },
      {
        id: 'BED-003-R2',
        type: 'placement',
        description: 'Place heavy furniture in SW corner, keep NE corner light and clean',
        costEstimate: { min: 0, max: 2000, currency: 'INR' },
        effectiveness: 40,
        difficulty: 'low',
        timeToImplement: '1 day'
      }
    ]
  },
  {
    id: 'BED-004',
    category: 'bedroom',
    name: 'Mirror Facing Bed',
    description: 'Avoid mirror directly facing bed',
    principle: 'Mirror reflecting sleeping person disturbs energy and causes health issues',
    roomType: 'bedroom',
    idealCondition: 'No mirror directly facing bed',
    defectCondition: 'Mirror or TV directly facing bed',
    severity: 'minor',
    scoreImpact: -5,
    remedy: [
      {
        id: 'BED-004-R1',
        type: 'placement',
        description: 'Cover mirror at night or relocate to side wall',
        costEstimate: { min: 0, max: 500, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'low',
        timeToImplement: '1 day'
      }
    ]
  },
  {
    id: 'BED-005',
    category: 'bedroom',
    name: 'Beam Over Bed',
    description: 'No beam should run across the bed',
    principle: 'Beam creates cutting energy causing health issues and stress',
    roomType: 'bedroom',
    idealCondition: 'Flat ceiling above bed area',
    defectCondition: 'Exposed beam running across bed',
    severity: 'major',
    scoreImpact: -12,
    remedy: [
      {
        id: 'BED-005-R1',
        type: 'structural',
        description: 'Create false ceiling to hide beam',
        costEstimate: { min: 15000, max: 50000, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'medium',
        timeToImplement: '1-2 weeks'
      },
      {
        id: 'BED-005-R2',
        type: 'placement',
        description: 'Reposition bed to avoid beam, hang flutes on beam',
        costEstimate: { min: 500, max: 2000, currency: 'INR' },
        effectiveness: 60,
        difficulty: 'low',
        timeToImplement: '1 day'
      }
    ]
  },
  {
    id: 'BED-006',
    category: 'bedroom',
    name: 'Children Bedroom',
    description: 'Children bedroom in West or North-West',
    principle: 'West enhances creativity; NW provides movement and growth energy',
    direction: ['W', 'NW'],
    roomType: 'bedroom',
    idealCondition: 'Children room in West or North-West',
    defectCondition: 'Children room in South-West',
    severity: 'minor',
    scoreImpact: -8
  },
  {
    id: 'BED-007',
    category: 'bedroom',
    name: 'Guest Bedroom',
    description: 'Guest bedroom should be in North-West',
    principle: 'NW promotes short stays; guests naturally leave sooner',
    direction: 'NW',
    roomType: 'guestroom',
    element: 'air',
    idealCondition: 'Guest room in North-West',
    defectCondition: 'Guest room in South-West (master bedroom position)',
    severity: 'minor',
    scoreImpact: -5,
    deity: 'Vayu'
  },
  {
    id: 'BED-008',
    category: 'bedroom',
    name: 'Bedroom Colors',
    description: 'Bedroom should have calming colors',
    principle: 'Soft colors promote rest and peaceful sleep',
    roomType: 'bedroom',
    idealCondition: 'Bedroom in light pink, cream, light blue, or green',
    defectCondition: 'Bedroom in red, black, or dark colors',
    severity: 'minor',
    scoreImpact: -3
  },
  {
    id: 'BED-009',
    category: 'bedroom',
    name: 'Bedroom Door Position',
    description: 'Bedroom door should not be in corner',
    principle: 'Corner doors create angular energy disturbance',
    roomType: 'bedroom',
    idealCondition: 'Door on wall center or towards one side',
    defectCondition: 'Door exactly in room corner',
    severity: 'minor',
    scoreImpact: -4
  },
  {
    id: 'BED-010',
    category: 'bedroom',
    name: 'Attached Bathroom Position',
    description: 'Attached bathroom should be in North-West of bedroom',
    principle: 'Water element in NW of room maintains proper energy flow',
    direction: 'NW',
    roomType: 'bedroom',
    element: 'water',
    idealCondition: 'Attached bath in North, West, or North-West',
    defectCondition: 'Attached bath in South-West of bedroom',
    severity: 'minor',
    scoreImpact: -6
  },

  // ============================================
  // BATHROOM/TOILET RULES (29-35)
  // ============================================
  {
    id: 'BATH-001',
    category: 'bathroom',
    name: 'Toilet in North-East Defect',
    description: 'Toilet must never be in North-East',
    principle: 'Toilet in sacred NE corner is most severe defect, destroys prosperity',
    direction: 'NE',
    roomType: 'bathroom',
    idealCondition: 'No toilet in North-East',
    defectCondition: 'Toilet located in North-East corner',
    severity: 'critical',
    scoreImpact: -25,
    remedy: [
      {
        id: 'BATH-001-R1',
        type: 'structural',
        description: 'Convert to store room or study, relocate toilet',
        costEstimate: { min: 100000, max: 400000, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'high',
        timeToImplement: '4-6 weeks'
      },
      {
        id: 'BATH-001-R2',
        type: 'placement',
        description: 'Keep door always closed, place sea salt bowl inside, add mirror on North wall',
        costEstimate: { min: 500, max: 2000, currency: 'INR' },
        effectiveness: 40,
        difficulty: 'low',
        timeToImplement: '1 day'
      },
      {
        id: 'BATH-001-R3',
        type: 'yantra',
        description: 'Install Vastu Dosh Nivaran Yantra and burn camphor daily',
        costEstimate: { min: 1000, max: 3000, currency: 'INR' },
        effectiveness: 35,
        difficulty: 'low',
        timeToImplement: '1 day'
      }
    ]
  },
  {
    id: 'BATH-002',
    category: 'bathroom',
    name: 'Ideal Toilet Location',
    description: 'Toilet should be in North-West or West',
    principle: 'NW (Vayu) and West allow negative energy to exit',
    direction: ['NW', 'W'],
    roomType: 'toilet',
    element: 'air',
    idealCondition: 'Toilet in North-West or West zone',
    defectCondition: 'Toilet in center, NE, or SE',
    severity: 'major',
    scoreImpact: -12
  },
  {
    id: 'BATH-003',
    category: 'bathroom',
    name: 'Toilet Seat Direction',
    description: 'Toilet seat should face North or South',
    principle: 'Sitting facing North-South axis aligns with magnetic field',
    direction: ['N', 'S'],
    roomType: 'toilet',
    idealCondition: 'Toilet seat faces North or South',
    defectCondition: 'Toilet seat faces East or West',
    severity: 'minor',
    scoreImpact: -3
  },
  {
    id: 'BATH-004',
    category: 'bathroom',
    name: 'Bathroom in Center Defect',
    description: 'No bathroom/toilet in center of house',
    principle: 'Center (Brahmasthan) should be open; toilet here pollutes entire house energy',
    direction: 'CENTER',
    roomType: 'bathroom',
    idealCondition: 'Center of house kept open or used as living area',
    defectCondition: 'Toilet or bathroom in exact center of house',
    severity: 'critical',
    scoreImpact: -25,
    remedy: [
      {
        id: 'BATH-004-R1',
        type: 'structural',
        description: 'Relocate bathroom to peripheral area',
        costEstimate: { min: 150000, max: 500000, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'high',
        timeToImplement: '6-8 weeks'
      },
      {
        id: 'BATH-004-R2',
        type: 'placement',
        description: 'Keep bathroom brightly lit 24/7, place crystal in center of bathroom',
        costEstimate: { min: 1000, max: 5000, currency: 'INR' },
        effectiveness: 30,
        difficulty: 'low',
        timeToImplement: '1 day'
      }
    ]
  },
  {
    id: 'BATH-005',
    category: 'bathroom',
    name: 'Septic Tank Position',
    description: 'Septic tank should be in North-West',
    principle: 'NW allows waste matter energy to dissipate properly',
    direction: 'NW',
    roomType: 'toilet',
    idealCondition: 'Septic tank in North-West outside main building',
    defectCondition: 'Septic tank in North-East or center',
    severity: 'major',
    scoreImpact: -15
  },
  {
    id: 'BATH-006',
    category: 'bathroom',
    name: 'Bathroom Ventilation',
    description: 'Bathroom must have proper ventilation',
    principle: 'Stagnant air in bathroom spreads negative energy',
    roomType: 'bathroom',
    idealCondition: 'Window or exhaust in bathroom, preferably on North or East wall',
    defectCondition: 'No ventilation in bathroom',
    severity: 'minor',
    scoreImpact: -5
  },
  {
    id: 'BATH-007',
    category: 'bathroom',
    name: 'Bathroom Door',
    description: 'Bathroom door should always remain closed',
    principle: 'Open bathroom door allows negative energy to spread',
    roomType: 'bathroom',
    idealCondition: 'Bathroom door kept closed when not in use',
    defectCondition: 'Bathroom door left open habitually',
    severity: 'minor',
    scoreImpact: -3
  },

  // ============================================
  // POOJA ROOM RULES (36-40)
  // ============================================
  {
    id: 'POOJA-001',
    category: 'pooja',
    name: 'Pooja Room in North-East',
    description: 'Pooja room should be in North-East',
    principle: 'NE is Ishaan corner, abode of Lord Shiva, most sacred direction',
    direction: 'NE',
    roomType: 'poojaroom',
    element: 'space',
    idealCondition: 'Pooja room in North-East corner',
    defectCondition: 'Pooja room in South or South-West',
    severity: 'major',
    scoreImpact: -12,
    deity: 'Ishaan (Shiva)'
  },
  {
    id: 'POOJA-002',
    category: 'pooja',
    name: 'Deity Facing Direction',
    description: 'Deities should face West or South',
    principle: 'Worshipper facing East or North receives divine blessings',
    direction: ['W', 'S'],
    roomType: 'poojaroom',
    idealCondition: 'Idols face West, devotee faces East while praying',
    defectCondition: 'Idols face North or East (devotee faces away from auspicious direction)',
    severity: 'minor',
    scoreImpact: -5
  },
  {
    id: 'POOJA-003',
    category: 'pooja',
    name: 'Pooja Room Below Toilet',
    description: 'No toilet above pooja room',
    principle: 'Toilet above sacred space is severe disrespect to deities',
    roomType: 'poojaroom',
    idealCondition: 'Nothing above pooja room or only storage',
    defectCondition: 'Toilet directly above pooja room',
    severity: 'critical',
    scoreImpact: -25
  },
  {
    id: 'POOJA-004',
    category: 'pooja',
    name: 'Pooja Room Colors',
    description: 'Pooja room should have light, pure colors',
    principle: 'White, cream, light yellow enhance spiritual energy',
    roomType: 'poojaroom',
    idealCondition: 'Pooja room in white, cream, light yellow, or marble finish',
    defectCondition: 'Dark colors in pooja room',
    severity: 'minor',
    scoreImpact: -3
  },
  {
    id: 'POOJA-005',
    category: 'pooja',
    name: 'Lamp Position',
    description: 'Oil lamp should be in South-East of pooja room',
    principle: 'Fire element (lamp) belongs in Agni corner even within pooja room',
    direction: 'SE',
    roomType: 'poojaroom',
    element: 'fire',
    idealCondition: 'Lamp kept in South-East of altar',
    defectCondition: 'Lamp in North-East of altar',
    severity: 'minor',
    scoreImpact: -3
  },

  // ============================================
  // STAIRCASE RULES (41-45)
  // ============================================
  {
    id: 'STAIR-001',
    category: 'staircase',
    name: 'Staircase Direction',
    description: 'Staircase should be in South, West, or South-West',
    principle: 'Heavy structures belong in SW half of house',
    direction: ['S', 'W', 'SW'],
    roomType: 'staircase',
    idealCondition: 'Staircase in South, West, or South-West',
    defectCondition: 'Staircase in North-East',
    severity: 'major',
    scoreImpact: -15,
    remedy: [
      {
        id: 'STAIR-001-R1',
        type: 'structural',
        description: 'Construct new staircase in South or West',
        costEstimate: { min: 200000, max: 500000, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'high',
        timeToImplement: '4-8 weeks'
      },
      {
        id: 'STAIR-001-R2',
        type: 'placement',
        description: 'Place heavy plant pots at base, use yellow lighting under stairs',
        costEstimate: { min: 2000, max: 10000, currency: 'INR' },
        effectiveness: 35,
        difficulty: 'low',
        timeToImplement: '1-2 days'
      }
    ]
  },
  {
    id: 'STAIR-002',
    category: 'staircase',
    name: 'Clockwise Rotation',
    description: 'Staircase should turn clockwise while ascending',
    principle: 'Clockwise movement follows positive energy spiral',
    roomType: 'staircase',
    idealCondition: 'Ascending staircase turns clockwise',
    defectCondition: 'Anticlockwise staircase',
    severity: 'minor',
    scoreImpact: -5
  },
  {
    id: 'STAIR-003',
    category: 'staircase',
    name: 'Odd Number of Steps',
    description: 'Total steps should be odd number',
    principle: 'Odd numbers are considered auspicious (ending on positive note)',
    roomType: 'staircase',
    idealCondition: 'Total steps: 5, 7, 9, 11, 13, 15, 17, 19, 21, 23',
    defectCondition: 'Even number of total steps',
    severity: 'minor',
    scoreImpact: -3
  },
  {
    id: 'STAIR-004',
    category: 'staircase',
    name: 'Staircase in Center',
    description: 'Avoid staircase in center of house',
    principle: 'Staircase in Brahmasthan disturbs cosmic energy',
    direction: 'CENTER',
    roomType: 'staircase',
    idealCondition: 'Staircase along walls, not in center',
    defectCondition: 'Spiral or any staircase in exact center',
    severity: 'critical',
    scoreImpact: -20
  },
  {
    id: 'STAIR-005',
    category: 'staircase',
    name: 'Space Under Stairs',
    description: 'Avoid pooja room or cash locker under stairs',
    principle: 'Feet climbing over sacred items or wealth is inauspicious',
    roomType: 'staircase',
    idealCondition: 'Storage room or empty space under stairs',
    defectCondition: 'Pooja room, safe, or kitchen under stairs',
    severity: 'major',
    scoreImpact: -12
  },

  // ============================================
  // LIVING ROOM & OTHER RULES (46-55)
  // ============================================
  {
    id: 'LIVING-001',
    category: 'livingroom',
    name: 'Living Room Position',
    description: 'Living room should be in North, East, or North-East',
    principle: 'These directions receive positive energy, ideal for gatherings',
    direction: ['N', 'E', 'NE'],
    roomType: 'livingroom',
    element: 'air',
    idealCondition: 'Living room in North or East portion of house',
    defectCondition: 'Living room in South-West',
    severity: 'minor',
    scoreImpact: -8
  },
  {
    id: 'LIVING-002',
    category: 'livingroom',
    name: 'Heavy Furniture Placement',
    description: 'Heavy furniture should be in South-West of living room',
    principle: 'SW should be heavy to ground energy in the room',
    direction: 'SW',
    roomType: 'livingroom',
    idealCondition: 'Sofa set, heavy furniture in South or West',
    defectCondition: 'Heavy furniture in North-East of room',
    severity: 'minor',
    scoreImpact: -4
  },
  {
    id: 'STUDY-001',
    category: 'study',
    name: 'Study Room Position',
    description: 'Study should be in North-East, North, or East',
    principle: 'These directions enhance concentration and wisdom',
    direction: ['NE', 'N', 'E'],
    roomType: 'study',
    element: 'air',
    idealCondition: 'Study room in North-East or East',
    defectCondition: 'Study in South-West',
    severity: 'minor',
    scoreImpact: -6
  },
  {
    id: 'STUDY-002',
    category: 'study',
    name: 'Study Desk Direction',
    description: 'Study desk should face East or North',
    principle: 'Facing East invokes Surya (Sun) for intellect; North invokes Kubera for success',
    direction: ['E', 'N'],
    roomType: 'study',
    idealCondition: 'Person faces East or North while studying',
    defectCondition: 'Facing South or West while studying',
    severity: 'minor',
    scoreImpact: -4
  },
  {
    id: 'BRAHM-001',
    category: 'brahmasthan',
    name: 'Center Should Be Open',
    description: 'Brahmasthan (center) should be free from obstructions',
    principle: 'Center is the cosmic navel; obstructions block divine energy',
    direction: 'CENTER',
    idealCondition: 'Center area open, used as courtyard or living area',
    defectCondition: 'Pillar, beam, toilet, kitchen, or heavy structure in center',
    severity: 'critical',
    scoreImpact: -20,
    remedy: [
      {
        id: 'BRAHM-001-R1',
        type: 'structural',
        description: 'Remove obstructions from center, create open space',
        costEstimate: { min: 50000, max: 200000, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'high',
        timeToImplement: '2-4 weeks'
      },
      {
        id: 'BRAHM-001-R2',
        type: 'placement',
        description: 'Place crystal or copper plate in center, keep area well-lit',
        costEstimate: { min: 1000, max: 5000, currency: 'INR' },
        effectiveness: 45,
        difficulty: 'low',
        timeToImplement: '1 day'
      }
    ]
  },
  {
    id: 'SLOPE-001',
    category: 'slope',
    name: 'Land Slope Direction',
    description: 'Land should slope from South-West to North-East',
    principle: 'Water and energy should flow towards NE (Ishaan)',
    idealCondition: 'South-West highest, North-East lowest',
    defectCondition: 'North-East higher than South-West',
    severity: 'major',
    scoreImpact: -15,
    remedy: [
      {
        id: 'SLOPE-001-R1',
        type: 'structural',
        description: 'Grade land to slope towards North-East',
        costEstimate: { min: 30000, max: 150000, currency: 'INR' },
        effectiveness: 100,
        difficulty: 'high',
        timeToImplement: '2-4 weeks'
      },
      {
        id: 'SLOPE-001-R2',
        type: 'placement',
        description: 'Place heavy boulders or structures in South-West',
        costEstimate: { min: 5000, max: 25000, currency: 'INR' },
        effectiveness: 50,
        difficulty: 'medium',
        timeToImplement: '1 week'
      }
    ]
  },
  {
    id: 'WATER-001',
    category: 'water',
    name: 'Water Tank Position',
    description: 'Underground water tank should be in North-East',
    principle: 'Water element belongs in NE; underground tank here enhances prosperity',
    direction: 'NE',
    element: 'water',
    idealCondition: 'Underground water tank or well in North-East',
    defectCondition: 'Underground water tank in South-West',
    severity: 'major',
    scoreImpact: -12
  },
  {
    id: 'WATER-002',
    category: 'water',
    name: 'Overhead Tank Position',
    description: 'Overhead water tank should be in South-West or West',
    principle: 'Elevated structures belong in SW half of property',
    direction: ['SW', 'W'],
    element: 'water',
    idealCondition: 'Overhead tank in South-West or West',
    defectCondition: 'Overhead tank in North-East',
    severity: 'major',
    scoreImpact: -10
  },
  {
    id: 'COLOR-001',
    category: 'colors',
    name: 'External Wall Colors',
    description: 'External walls should have light, warm colors',
    principle: 'Light colors reflect positive energy, dark colors absorb negativity',
    idealCondition: 'External walls in white, cream, light yellow, or light pink',
    defectCondition: 'External walls in black, dark grey, or very dark colors',
    severity: 'minor',
    scoreImpact: -5
  },
  {
    id: 'ELEM-001',
    category: 'elements',
    name: 'Five Element Balance',
    description: 'All five elements should be balanced in the property',
    principle: 'Pancha Mahabhutas (Earth, Water, Fire, Air, Space) must be in harmony',
    idealCondition: 'Each element represented in appropriate direction',
    defectCondition: 'One or more elements missing or misplaced',
    severity: 'minor',
    scoreImpact: -8
  }
];

// Helper function to get rules by category
export function getRulesByCategory(category: string): VastuRule[] {
  return VASTU_RULES_ENGINE.filter(rule => rule.category === category);
}

// Helper function to get rule by ID
export function getRuleById(id: string): VastuRule | undefined {
  return VASTU_RULES_ENGINE.find(rule => rule.id === id);
}

// Helper function to get rules by severity
export function getRulesBySeverity(severity: Severity): VastuRule[] {
  return VASTU_RULES_ENGINE.filter(rule => rule.severity === severity);
}

// Direction normalization map
const DIRECTION_ALIASES: Record<string, Direction> = {
  'NORTH': 'N', 'N': 'N',
  'NORTH EAST': 'NE', 'NORTHEAST': 'NE', 'NORTH-EAST': 'NE', 'NE': 'NE',
  'EAST': 'E', 'E': 'E',
  'SOUTH EAST': 'SE', 'SOUTHEAST': 'SE', 'SOUTH-EAST': 'SE', 'SE': 'SE',
  'SOUTH': 'S', 'S': 'S',
  'SOUTH WEST': 'SW', 'SOUTHWEST': 'SW', 'SOUTH-WEST': 'SW', 'SW': 'SW',
  'WEST': 'W', 'W': 'W',
  'NORTH WEST': 'NW', 'NORTHWEST': 'NW', 'NORTH-WEST': 'NW', 'NW': 'NW',
  'CENTER': 'CENTER', 'CENTRE': 'CENTER', 'BRAHMASTHAN': 'CENTER'
};

export function normalizeDirection(input: string): Direction | undefined {
  if (!input) return undefined;
  // Handle edge cases like extra spaces or different separators
  const normalized = input.toUpperCase().trim().replace(/_/g, ' ').replace(/-/g, ' ');

  // Direct lookup
  if (DIRECTION_ALIASES[normalized]) return DIRECTION_ALIASES[normalized];

  // Try matching without spaces
  const compact = normalized.replace(/\s/g, '');
  if (DIRECTION_ALIASES[compact]) return DIRECTION_ALIASES[compact];

  return undefined;
}

// Helper function to get direction properties with normalization
export function getDirectionProperties(direction: Direction | string) {
  const norm = normalizeDirection(direction);
  if (!norm) return undefined;
  return DIRECTION_PROPERTIES[norm];
}

// Grade calculation thresholds
export const GRADE_THRESHOLDS = {
  'A+': { min: 95, max: 100 },
  'A': { min: 85, max: 94 },
  'B+': { min: 75, max: 84 },
  'B': { min: 65, max: 74 },
  'C': { min: 50, max: 64 },
  'D': { min: 35, max: 49 },
  'F': { min: 0, max: 34 }
} as const;

export type VastuGrade = keyof typeof GRADE_THRESHOLDS;

// Calculate grade from score
export function calculateGrade(score: number): VastuGrade {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 75) return 'B+';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}

// Scoring weights for different categories
export const SCORING_WEIGHTS = {
  entrance: 0.25,
  kitchen: 0.15,
  bedroom: 0.15,
  bathroom: 0.12,
  pooja: 0.08,
  staircase: 0.08,
  livingroom: 0.05,
  study: 0.04,
  brahmasthan: 0.05,
  slope: 0.03
} as const;
