
import { ScorePanel } from '@/components/ScorePanel';
import { ScoreLevel } from '@/types/types';

interface ScoringTabProps {
  scores: Record<string, ScoreLevel>;
  onChange: (parameter: string, value: ScoreLevel) => void;
}

export const ScoringTab = ({ scores, onChange }: ScoringTabProps) => {
  return <ScorePanel scores={scores} onChange={onChange} />;
};
