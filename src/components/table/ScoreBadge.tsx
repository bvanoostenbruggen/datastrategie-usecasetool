
import { ScoreLevel } from '@/types/types';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ScoreBadgeProps {
  paramId: string;
  score?: ScoreLevel;
  highlight: 'high' | 'low' | null;
}

export const ScoreBadge = ({ paramId, score, highlight }: ScoreBadgeProps) => {
  const actualScore = score || 3;
  
  // Determine badge style based on highlights and preferences
  let variant = "outline";
  let bgColor = "bg-muted";
  
  if (highlight === 'high') {
    variant = "default";
    bgColor = "bg-green-500";
  } else if (highlight === 'low') {
    variant = "outline";
    bgColor = "bg-red-500/20 border-red-500/50";
  } else {
    if (actualScore >= 4) {
      variant = "default";
      bgColor = "bg-primary";
    } else if (actualScore >= 3) {
      variant = "secondary";
      bgColor = "bg-secondary";
    }
  }
  
  return (
    <div className="flex items-center gap-1">
      <Badge 
        variant={variant as any}
        className={`rounded-sm ${bgColor}`}
      >
        {actualScore}
      </Badge>
      
      {highlight === 'high' && (
        <ArrowUp className="h-4 w-4 text-green-500" />
      )}
      
      {highlight === 'low' && (
        <ArrowDown className="h-4 w-4 text-red-500" />
      )}
    </div>
  );
};
