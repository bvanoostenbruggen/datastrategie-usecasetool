import { UseCase, ImpactLevel, EaseLevel, ScoreLevel, ScoreParameter } from '@/types/types';

// Helper to map legacy impact/ease to new score levels
export const mapImpactToScore = (impact: ImpactLevel): ScoreLevel => {
  switch (impact) {
    case 'high': return 5;
    case 'medium': return 3;
    case 'low': return 1;
    default: return 3;
  }
};

export const mapEaseToScore = (ease: EaseLevel): ScoreLevel => {
  switch (ease) {
    case 'high': return 5;
    case 'medium': return 3;
    case 'low': return 1;
    default: return 3;
  }
};

// Helper to calculate score based on all parameters, weights, and direction preferences
export const calculateScore = (
  scores: Record<string, ScoreLevel>, 
  parameters: ScoreParameter[]
): number => {
  if (!scores || !parameters.length) return 0;
  
  try {
    let weightedSum = 0;
    let totalWeight = 0;
    
    parameters.forEach(param => {
      if (scores[param.id] !== undefined) {
        // Apply direction preference
        let normalizedScore = scores[param.id];
        
        // If "lower is better", invert the score (5 becomes 1, 4 becomes 2, etc.)
        if (param.preferredDirection === 'low') {
          normalizedScore = (6 - normalizedScore) as ScoreLevel;
        }
        
        // If neutral, we keep the original score but with a lower weight
        const effectiveWeight = param.preferredDirection === 'neutral' 
          ? param.weight * 0.5 // Lower weight for neutral parameters
          : param.weight;
        
        weightedSum += normalizedScore * effectiveWeight;
        totalWeight += effectiveWeight;
      }
    });
    
    // If no weights were applied, return 0
    if (totalWeight === 0) return 0;
    
    // Calculate weighted average and normalize to a score out of 5
    return Math.round((weightedSum / totalWeight) * 5) / 5;
  } catch (error) {
    console.error("Error calculating score:", error);
    return 0;
  }
};

// Helper to create default scores from parameters
export const createDefaultScores = (parameters: ScoreParameter[], impact?: ImpactLevel, ease?: EaseLevel) => {
  const scores: Record<string, ScoreLevel> = {};
  
  parameters.forEach(param => {
    // For backward compatibility with impact and ease
    if (param.id === 'impact' && impact) {
      scores[param.id] = mapImpactToScore(impact);
    } else if (param.id === 'easeOfImplementation' && ease) {
      scores[param.id] = mapEaseToScore(ease);
    } else {
      scores[param.id] = param.defaultValue || 3;
    }
  });
  
  return scores;
};

// Ensure all parameters have corresponding scores
export const ensureCompleteScores = (scores: Record<string, ScoreLevel> | undefined, parameters: ScoreParameter[]) => {
  if (!scores) {
    return createDefaultScores(parameters);
  }
  
  const completeScores = { ...scores };
  
  parameters.forEach(param => {
    if (completeScores[param.id] === undefined) {
      completeScores[param.id] = param.defaultValue || 3;
    }
  });
  
  return completeScores;
};
