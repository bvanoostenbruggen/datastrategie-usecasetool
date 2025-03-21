
import { StatusType } from './types';

export type ChallengeCategory = 
  | 'Operational Efficiency'
  | 'Customer Insights'
  | 'Risk & Compliance'
  | 'Automation & AI'
  | 'Other';

export type ImpactLevel = 'low' | 'medium' | 'high';

// New scoring type for 1-5 scale
export type ScoreLevel = 1 | 2 | 3 | 4 | 5;

// New interface for challenge scores
export interface ChallengeScores {
  impact: ScoreLevel;
  feasibility: ScoreLevel;
  priority: ScoreLevel;
}

export interface Challenge {
  id: string;
  title: string;
  category?: ChallengeCategory;
  impact?: ImpactLevel;
  createdAt: Date;
  updatedAt: Date;
  status: StatusType;
  // New field for detailed scoring
  scores?: ChallengeScores;
  // Flag to track if the challenge is selected
  selected?: boolean;
  // Add team information
  teamId?: string;
  teamName?: string;
  // For future implementation:
  linkedUseCases?: string[];
}

export interface ChallengeFormData {
  title: string;
  category?: ChallengeCategory;
  impact?: ImpactLevel;
  status: StatusType;
  // Add scoring to form data
  scores?: ChallengeScores;
  // Add selected state to form data
  selected?: boolean;
  // Add team information
  teamId?: string;
  teamName?: string;
}

export const CHALLENGE_CATEGORIES: ChallengeCategory[] = [
  'Operational Efficiency',
  'Customer Insights',
  'Risk & Compliance',
  'Automation & AI',
  'Other'
];

export const IMPACT_LEVELS: ImpactLevel[] = ['low', 'medium', 'high'];

// Sample placeholder challenges for the input field
export const CHALLENGE_PLACEHOLDERS = [
  "We struggle to predict customer churn.",
  "Manual reporting takes too much time.",
  "Data is inconsistent across systems.",
  "Compliance reporting requires manual effort.",
  "Customer feedback isn't systematically analyzed."
];
