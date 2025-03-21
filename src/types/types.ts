export type Team = string;
export type Technology = string;

export type ScoreLevel = 1 | 2 | 3 | 4 | 5;
export type ImpactLevel = 'low' | 'medium' | 'high';
export type EaseLevel = 'low' | 'medium' | 'high';
export type StatusType = 'backlog' | 'in-progress' | 'completed' | 'archived';
export type PreferenceDirection = 'high' | 'low' | 'neutral';
export type RoadmapPhase = 'short-term' | 'mid-term' | 'long-term' | 'quarterly-q1' | 'quarterly-q2' | 'quarterly-q3' | 'quarterly-q4';

// Role type for FTE allocation
export type Role = 'Data Scientist' | 'Data Engineer' | 'Data Strategist' | 'Analytics Engineer' | string;

// Role-based FTE allocation
export interface RoleAllocation {
  role: Role;
  fte: number;
}

// New type for custom parameters
export interface ScoreParameter {
  id: string;
  name: string;
  description: string;
  weight: number;
  defaultValue?: ScoreLevel;
  preferredDirection?: PreferenceDirection;
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  // Legacy fields (to maintain backward compatibility)
  impact: ImpactLevel;
  ease: EaseLevel;
  // Updated to support dynamic parameters
  scores: Record<string, ScoreLevel>;
  // Total weighted score
  score: number; 
  team: string[];
  technologies: string[];
  businessObjective?: string;
  expectedOutcome?: string;
  successCriteria?: string;
  estimatedTime?: string;
  estimatedResources?: string;
  // New fields for roadmap functionality
  estimatedTimeInWeeks?: number;
  estimatedFTE?: number;
  // New field for role-based FTE allocation
  roleAllocations?: RoleAllocation[];
  inRoadmap?: boolean;
  roadmapPhase?: RoadmapPhase;
  roadmapOrder?: number;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
  projectId?: string | null;
  // Add team information
  teamId?: string;
  teamName?: string;
}

export interface UseCaseFormData {
  title: string;
  description: string;
  // Legacy fields
  impact: ImpactLevel;
  ease: EaseLevel;
  // Updated to support dynamic parameters
  scores?: Record<string, ScoreLevel>;
  team: string[];
  technologies: string[];
  businessObjective: string;
  expectedOutcome: string;
  successCriteria: string;
  estimatedTime: string;
  estimatedResources: string;
  status: StatusType;
  // New fields for roadmap functionality
  estimatedTimeInWeeks?: number;
  estimatedFTE?: number;
  // New field for role-based FTE allocation
  roleAllocations?: RoleAllocation[];
  // Adding missing roadmap properties
  inRoadmap?: boolean;
  roadmapPhase?: RoadmapPhase;
  roadmapOrder?: number;
  // Add team information
  teamId?: string;
  teamName?: string;
}

// Updated to use ScoreParameter
export interface ScoreWeights {
  [key: string]: number;
}

// Default parameters for initialization
export const DEFAULT_PARAMETERS: ScoreParameter[] = [
  {
    id: 'impact',
    name: 'Impact',
    description: 'How valuable is this use case for the business?',
    weight: 1.0,
    defaultValue: 3,
    preferredDirection: 'high'
  },
  {
    id: 'easeOfImplementation',
    name: 'Ease of Implementation',
    description: 'How simple is it to develop and deploy?',
    weight: 0.8,
    defaultValue: 3,
    preferredDirection: 'high'
  },
  {
    id: 'dataAvailability',
    name: 'Data Availability',
    description: 'Is the required data accessible, clean, and complete?',
    weight: 0.7,
    defaultValue: 3,
    preferredDirection: 'high'
  },
  {
    id: 'businessValue',
    name: 'Business Value',
    description: 'What is the potential financial or strategic return?',
    weight: 0.9,
    defaultValue: 3,
    preferredDirection: 'high'
  },
  {
    id: 'technicalFeasibility',
    name: 'Technical Feasibility',
    description: 'How challenging is the development from a technical standpoint?',
    weight: 0.8,
    defaultValue: 3,
    preferredDirection: 'high'
  },
  {
    id: 'maintainability',
    name: 'Maintainability',
    description: 'Can this solution be easily maintained and scaled over time?',
    weight: 0.6,
    defaultValue: 3,
    preferredDirection: 'high'
  },
  {
    id: 'ethicalConsiderations',
    name: 'Ethical Considerations',
    description: 'Are there any legal, privacy, or ethical concerns?',
    weight: 0.7,
    defaultValue: 3,
    preferredDirection: 'low'
  }
];
