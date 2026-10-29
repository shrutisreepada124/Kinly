export type FamilyMemberId = 'mom' | 'son' | 'grandma' | 'all';

export interface AllergyCondition {
  id: string;
  name: string;
  severity: 'severe_anaphylactic' | 'moderate' | 'mild_intolerance';
  keywords: string[];
  notes?: string;
}

export interface DietaryGoal {
  id: string;
  name: string;
  type: 'keto' | 'low_sodium' | 'diabetic' | 'custom';
  restrictedKeywords: string[];
  cautionKeywords: string[];
  maxSodiumPerServingMg?: number;
  maxCarbsPerServingG?: number;
  maxSugarPerServingG?: number;
  notes: string;
}

export interface FamilyProfile {
  id: 'mom' | 'son' | 'grandma';
  name: string;
  relation: string;
  roleTitle: string;
  age: number;
  avatarColor: string;
  avatarBg: string;
  avatarImage: string;
  primaryDietBadge: string;
  allergies: AllergyCondition[];
  dietaryGoals: DietaryGoal[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  specialInstructions: string;
  todayStats: {
    hydrationMl: number;
    targetHydrationMl: number;
    primaryMetricLabel: string;
    primaryMetricValue: string;
    primaryMetricStatus: 'optimal' | 'warning' | 'normal';
  };
}

export interface IngredientMatch {
  ingredient: string;
  matchedRule: string;
  status: 'critical_allergen' | 'caution_diet' | 'safe';
  reason: string;
  affectsMemberIds: ('mom' | 'son' | 'grandma')[];
  suggestedSwap?: string;
}

export interface ScanSafetyResult {
  overallStatus: 'safe_for_all' | 'caution' | 'critical_alert';
  headline: string;
  summary: string;
  memberAssessments: {
    memberId: 'mom' | 'son' | 'grandma';
    memberName: string;
    status: 'safe' | 'caution' | 'critical';
    message: string;
    flaggedIngredients: IngredientMatch[];
  }[];
  extractedIngredients: string[];
  nutritionalFlags: {
    sodiumMg?: number;
    netCarbsG?: number;
    sugarsG?: number;
    hasCrossContaminationWarning: boolean;
  };
  productName?: string;
  timestamp: string;
}

export interface CareTask {
  id: string;
  memberId: 'mom' | 'son' | 'grandma';
  title: string;
  type: 'medication' | 'vital_check' | 'allergy_kit' | 'hydration_nutrition';
  dosageOrDetail?: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  timeLabel: string;
  completed: boolean;
  completedAt?: string;
  criticalSafety?: boolean;
}

export interface PlatingInstruction {
  memberId: 'mom' | 'son' | 'grandma';
  memberName: string;
  dietTag: string;
  swapNotes: string;
  platingTip: string;
  carbCountG: number;
  sodiumMg: number;
  allergenSafeConfirmed: boolean;
}

export interface RecipeMeal {
  id: string;
  title: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  cookTimeMins: number;
  prepTimeMins: number;
  servings: number;
  imageUrl: string;
  description: string;
  sharedBase: string[];
  sharedInstructions: string[];
  customPlatings: PlatingInstruction[];
  totalSafetyScore: number; // 0-100
  tags: string[];
}
