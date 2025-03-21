
import { ScoreLevel, ScoreParameter } from '@/types/types';
import { ScoreEditor } from './ScoreEditor';
import { ScoreBadge } from './ScoreBadge';

interface ScoreParameterCellProps {
  isEditing: boolean;
  paramId: string;
  paramName: string;
  score?: ScoreLevel;
  highlight: 'high' | 'low' | null;
  useCaseId: string;
  onScoreChange: (id: string, scoreKey: string, value: ScoreLevel) => void;
}

export const ScoreParameterCell = ({ 
  isEditing,
  paramId,
  paramName,
  score,
  highlight,
  useCaseId,
  onScoreChange
}: ScoreParameterCellProps) => {
  if (isEditing) {
    return (
      <div className="flex flex-col space-y-1">
        <label className="text-xs text-muted-foreground font-medium">
          {paramName.length > 15 ? paramName.slice(0, 15) + '...' : paramName}
        </label>
        <ScoreEditor 
          id={useCaseId} 
          scoreKey={paramId} 
          value={score || 3}
          onChange={onScoreChange}
          label={paramName}
        />
      </div>
    );
  }
  
  return <ScoreBadge paramId={paramId} score={score} highlight={highlight} />;
};
