
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Challenge, ScoreLevel } from '@/types/challenge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Filter, CheckCircle } from 'lucide-react';

interface AutoSelectThresholds {
  impact: ScoreLevel;
  feasibility: ScoreLevel;
  priority: ScoreLevel;
}

interface ChallengeAutoSelectorProps {
  challenges: Challenge[];
  onAutoSelect: (selectedIds: string[]) => void;
}

export const ChallengeAutoSelector = ({
  challenges,
  onAutoSelect,
}: ChallengeAutoSelectorProps) => {
  // Default thresholds - select challenges with scores of 3 or higher
  const [thresholds, setThresholds] = useState<AutoSelectThresholds>({
    impact: 3,
    feasibility: 3,
    priority: 3,
  });

  const [open, setOpen] = useState(false);

  // Preview how many challenges will be selected with current thresholds
  const getSelectedChallenges = () => {
    return challenges.filter((challenge) => {
      // Skip challenges without scores
      if (!challenge.scores) return false;

      // Check if all scores meet or exceed thresholds
      return (
        challenge.scores.impact >= thresholds.impact &&
        challenge.scores.feasibility >= thresholds.feasibility &&
        challenge.scores.priority >= thresholds.priority
      );
    });
  };

  const selectedPreview = getSelectedChallenges();

  const applyAutoSelection = () => {
    const selectedIds = selectedPreview.map((challenge) => challenge.id);
    onAutoSelect(selectedIds);
    setOpen(false);
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 1:
        return 'Very Low (1)';
      case 2:
        return 'Low (2)';
      case 3:
        return 'Medium (3)';
      case 4:
        return 'High (4)';
      case 5:
        return 'Very High (5)';
      default:
        return `Score: ${score}`;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Auto-Select Challenges
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm mb-1">Auto-Select Criteria</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Set minimum thresholds for each score. Challenges that meet or exceed 
              all thresholds will be selected.
            </p>
          </div>

          {/* Impact threshold */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Minimum Impact</Label>
              <span className="text-xs font-medium">
                {getScoreLabel(thresholds.impact)}
              </span>
            </div>
            <Slider
              value={[thresholds.impact]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) =>
                setThresholds({ ...thresholds, impact: value[0] as ScoreLevel })
              }
            />
          </div>

          {/* Feasibility threshold */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Minimum Feasibility</Label>
              <span className="text-xs font-medium">
                {getScoreLabel(thresholds.feasibility)}
              </span>
            </div>
            <Slider
              value={[thresholds.feasibility]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) =>
                setThresholds({
                  ...thresholds,
                  feasibility: value[0] as ScoreLevel,
                })
              }
            />
          </div>

          {/* Priority threshold */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Minimum Priority</Label>
              <span className="text-xs font-medium">
                {getScoreLabel(thresholds.priority)}
              </span>
            </div>
            <Slider
              value={[thresholds.priority]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) =>
                setThresholds({
                  ...thresholds,
                  priority: value[0] as ScoreLevel,
                })
              }
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Badge
              variant="outline"
              className="font-normal flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              {selectedPreview.length} of {challenges.length} will be selected
            </Badge>
            <Button
              size="sm"
              onClick={applyAutoSelection}
              variant="purple"
              className="text-white"
            >
              Apply Selection
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
