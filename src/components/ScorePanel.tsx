
import React from 'react';
import { ScoreLevel, ScoreParameter, PreferenceDirection } from '@/types/types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { useUseCases } from '@/hooks/useUseCases';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ScorePanelProps {
  scores: Record<string, ScoreLevel>;
  onChange: (parameter: string, value: ScoreLevel) => void;
  showDirectionControls?: boolean;
}

export const ScorePanel = ({ 
  scores, 
  onChange, 
  showDirectionControls = false 
}: ScorePanelProps) => {
  const { parameters, updateParameters } = useUseCases();
  
  const handleSliderChange = (parameter: string) => (value: number[]) => {
    onChange(parameter, value[0] as ScoreLevel);
  };

  const handleDirectionChange = (paramId: string, direction: PreferenceDirection) => {
    const updatedParameters = parameters.map(param =>
      param.id === paramId 
        ? { ...param, preferredDirection: direction } 
        : param
    );
    updateParameters(updatedParameters);
  };

  // Get icon for direction
  const getDirectionIcon = (direction?: PreferenceDirection) => {
    switch (direction) {
      case 'high':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'low':
        return <ArrowDown className="h-4 w-4 text-amber-500" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  // Get tooltip text based on direction
  const getDirectionText = (direction?: PreferenceDirection) => {
    switch (direction) {
      case 'high':
        return 'Higher is Better';
      case 'low':
        return 'Lower is Better';
      default:
        return 'Neutral';
    }
  };

  return (
    <Card className="border-muted bg-black/30">
      <CardContent className="p-6">
        <div className="space-y-6 mt-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Parameter Scoring</h3>
            <div className="flex text-xs space-x-6 text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          {parameters.map((param) => (
            <div key={param.id} className="space-y-2.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Label htmlFor={param.id} className="text-sm font-medium">
                    {param.name}
                  </Label>
                  {!showDirectionControls && (
                    <Badge 
                      variant="outline" 
                      className="h-6 px-2 flex items-center gap-1 bg-muted/20"
                    >
                      {getDirectionIcon(param.preferredDirection)}
                      <span className="text-xs">
                        {getDirectionText(param.preferredDirection)}
                      </span>
                    </Badge>
                  )}
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-purple to-pink bg-clip-text text-transparent">
                  {scores[param.id] || 3}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{param.description}</p>
              
              <div className="flex gap-2">
                <Slider
                  id={param.id}
                  min={1}
                  max={5}
                  step={1}
                  value={[scores[param.id] || 3]}
                  onValueChange={handleSliderChange(param.id)}
                  className="flex-grow mt-1"
                />
                
                {showDirectionControls && (
                  <Select
                    value={param.preferredDirection || 'high'}
                    onValueChange={(value) => handleDirectionChange(param.id, value as PreferenceDirection)}
                  >
                    <SelectTrigger className="w-36">
                      <div className="flex items-center gap-1">
                        {getDirectionIcon(param.preferredDirection)}
                        <span className="text-xs">
                          {getDirectionText(param.preferredDirection)}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high" className="flex items-center gap-2">
                        <ArrowUp className="h-4 w-4 text-green-500" /> Higher is Better
                      </SelectItem>
                      <SelectItem value="low" className="flex items-center gap-2">
                        <ArrowDown className="h-4 w-4 text-amber-500" /> Lower is Better
                      </SelectItem>
                      <SelectItem value="neutral" className="flex items-center gap-2">
                        <Minus className="h-4 w-4" /> Neutral
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
