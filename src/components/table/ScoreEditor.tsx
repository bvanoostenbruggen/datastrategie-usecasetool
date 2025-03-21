
import { Slider } from '@/components/ui/slider';
import { UseCase, ScoreLevel } from '@/types/types';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

interface ScoreEditorProps {
  id: string;
  scoreKey: string; // Changed from keyof UseCase['scores'] to string for dynamic parameters
  value: ScoreLevel;
  onChange: (id: string, scoreKey: string, value: ScoreLevel) => void;
  label?: string; // Optional label for the score
}

export const ScoreEditor = ({ id, scoreKey, value, onChange, label }: ScoreEditorProps) => {
  const [currentValue, setCurrentValue] = useState<ScoreLevel>(value);
  
  // Update local state when prop value changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Determine the color based on score value
  const getBadgeStyle = (score: number) => {
    if (score >= 4) return 'bg-green-500 hover:bg-green-600 text-white';
    if (score >= 3) return 'bg-blue-500 hover:bg-blue-600 text-white';
    return 'bg-gray-500 hover:bg-gray-600 text-white';
  };

  const handleValueChange = (newValue: number[]) => {
    const newScore = newValue[0] as ScoreLevel;
    setCurrentValue(newScore);
    onChange(id, scoreKey, newScore);
  };

  return (
    <div className="w-full flex items-center space-x-2">
      <Slider
        value={[currentValue]}
        min={1}
        max={5}
        step={1}
        className="flex-grow"
        onValueChange={handleValueChange}
      />
      <Badge 
        className={`${getBadgeStyle(currentValue)} min-w-8 flex justify-center items-center h-6`}
      >
        {currentValue}
      </Badge>
    </div>
  );
};
