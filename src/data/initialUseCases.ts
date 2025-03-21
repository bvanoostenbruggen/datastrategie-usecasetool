
import { UseCase } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';

// Initial sample data
export const initialUseCases: UseCase[] = [
  {
    id: uuidv4(),
    title: 'Customer Churn Prediction',
    description: 'Develop a model to predict customer churn based on historical behavior and demographics.',
    impact: 'high',
    ease: 'medium',
    scores: {
      impact: 5,
      easeOfImplementation: 3,
      dataAvailability: 4,
      businessValue: 5,
      technicalFeasibility: 3,
      maintainability: 4,
      ethicalConsiderations: 3
    },
    score: 19.7,
    team: ['Data Science', 'Marketing'],
    technologies: ['Python', 'Machine Learning', 'SQL'],
    businessObjective: 'Reduce customer churn rate by proactively identifying at-risk customers.',
    expectedOutcome: 'Reduction in churn rate by 15% within 6 months.',
    successCriteria: 'Model with at least 80% accuracy in predicting churn.',
    estimatedTime: '3 months',
    estimatedResources: '2 data scientists, 1 data engineer',
    status: 'in-progress',
    createdAt: new Date(2023, 5, 15),
    updatedAt: new Date(2023, 5, 15),
  },
  {
    id: uuidv4(),
    title: 'Sales Forecasting Dashboard',
    description: 'Create an interactive dashboard to visualize sales forecasts and trends.',
    impact: 'medium',
    ease: 'high',
    scores: {
      impact: 3,
      easeOfImplementation: 5,
      dataAvailability: 4,
      businessValue: 4,
      technicalFeasibility: 4,
      maintainability: 3,
      ethicalConsiderations: 5
    },
    score: 17.8,
    team: ['Business Intelligence', 'Sales'],
    technologies: ['Tableau', 'SQL', 'R'],
    businessObjective: 'Improve sales planning and inventory management.',
    expectedOutcome: 'Better inventory management and reduced stockouts.',
    successCriteria: 'Forecast accuracy within 10% of actual sales.',
    estimatedTime: '2 months',
    estimatedResources: '1 BI developer, 1 analyst',
    status: 'backlog',
    createdAt: new Date(2023, 6, 10),
    updatedAt: new Date(2023, 6, 10),
  },
  {
    id: uuidv4(),
    title: 'Customer Segmentation Analysis',
    description: 'Segment customers based on purchase behavior, demographics, and engagement metrics.',
    impact: 'high',
    ease: 'high',
    scores: {
      impact: 5,
      easeOfImplementation: 5,
      dataAvailability: 3,
      businessValue: 4,
      technicalFeasibility: 5,
      maintainability: 4,
      ethicalConsiderations: 3
    },
    score: 20.6,
    team: ['Marketing', 'Data Science'],
    technologies: ['Python', 'Clustering Algorithms', 'CRM Integration'],
    businessObjective: 'Create targeted marketing campaigns for specific customer segments.',
    expectedOutcome: 'Increased campaign ROI and customer engagement.',
    successCriteria: 'Identify at least 5 actionable customer segments with distinct behaviors.',
    estimatedTime: '1.5 months',
    estimatedResources: '1 data scientist, 1 marketing analyst',
    status: 'completed',
    createdAt: new Date(2023, 4, 5),
    updatedAt: new Date(2023, 7, 15),
  }
];
