
import { useState, useEffect } from 'react';
import { ChallengeScores, ScoreLevel } from '@/types/challenge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Check, Flag } from 'lucide-react';

interface ChallengeScoreProps {
  scores?: ChallengeScores;
  onChange: (scores: ChallengeScores) => void;
  readOnly?: boolean;
}

export const ChallengeScoring = ({ scores, onChange, readOnly = false }: ChallengeScoreProps) => {
  // Set default scores if none provided
  const defaultScores: ChallengeScores = {
    impact: 3,
    feasibility: 3,
    priority: 3
  };

  const [localScores, setLocalScores] = useState<ChallengeScores>(scores || defaultScores);

  // Update local state when prop changes
  useEffect(() => {
    if (scores) {
      setLocalScores(scores);
    }
  }, [scores]);

  const handleScoreChange = (field: keyof ChallengeScores, value: number[]) => {
    if (readOnly) return;
    
    const newScore = value[0] as ScoreLevel;
    const updatedScores = { ...localScores, [field]: newScore };
    setLocalScores(updatedScores);
    onChange(updatedScores);
  };

  // Get badge color based on score value
  const getBadgeColor = (score: number) => {
    if (score >= 4) return 'bg-green-500 text-white';
    if (score >= 3) return 'bg-blue-500 text-white';
    if (score >= 2) return 'bg-yellow-500 text-black';
    return 'bg-red-500 text-white';
  };

  // Get text representation of score
  const getScoreText = (score: number) => {
    if (score === 5) return 'Very High';
    if (score === 4) return 'High';
    if (score === 3) return 'Medium';
    if (score === 2) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-yellow-500" />
            Impact
          </Label>
          <Badge className={getBadgeColor(localScores.impact)}>
            {getScoreText(localScores.impact)} ({localScores.impact})
          </Badge>
        </div>
        <Slider
          value={[localScores.impact]}
          min={1}
          max={5}
          step={1}
          onValueChange={(value) => handleScoreChange('impact', value)}
          disabled={readOnly}
          className={readOnly ? 'opacity-70' : ''}
        />
        <p className="text-xs text-muted-foreground">
          How significant is the impact of this challenge on the organization?
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-green-500" />
            Feasibility
          </Label>
          <Badge className={getBadgeColor(localScores.feasibility)}>
            {getScoreText(localScores.feasibility)} ({localScores.feasibility})
          </Badge>
        </div>
        <Slider
          value={[localScores.feasibility]}
          min={1}
          max={5}
          step={1}
          onValueChange={(value) => handleScoreChange('feasibility', value)}
          disabled={readOnly}
          className={readOnly ? 'opacity-70' : ''}
        />
        <p className="text-xs text-muted-foreground">
          How feasible is it to address this challenge with available resources?
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5">
            <Flag className="h-4 w-4 text-red-500" />
            Priority
          </Label>
          <Badge className={getBadgeColor(localScores.priority)}>
            {getScoreText(localScores.priority)} ({localScores.priority})
          </Badge>
        </div>
        <Slider
          value={[localScores.priority]}
          min={1}
          max={5}
          step={1}
          onValueChange={(value) => handleScoreChange('priority', value)}
          disabled={readOnly}
          className={readOnly ? 'opacity-70' : ''}
        />
        <p className="text-xs text-muted-foreground">
          What is the priority level for addressing this challenge?
        </p>
      </div>
    </div>
  );
};
