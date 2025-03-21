
import { useState } from 'react';
import { ScoreParameter, PreferenceDirection } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Minus, Save, Undo } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface WeightsPanelProps {
  parameters: ScoreParameter[];
  onUpdateParameters: (parameters: ScoreParameter[]) => void;
}

export const WeightsPanel = ({ 
  parameters, 
  onUpdateParameters 
}: WeightsPanelProps) => {
  const [localParameters, setLocalParameters] = useState<ScoreParameter[]>(parameters);
  const [hasChanges, setHasChanges] = useState(false);

  const handleWeightChange = (id: string, value: number) => {
    const updated = localParameters.map(param => 
      param.id === id ? { ...param, weight: value / 10 } : param
    );
    setLocalParameters(updated);
    setHasChanges(true);
  };

  const handleDirectionChange = (id: string, direction: PreferenceDirection) => {
    const updated = localParameters.map(param => 
      param.id === id ? { ...param, preferredDirection: direction } : param
    );
    setLocalParameters(updated);
    setHasChanges(true);
  };

  const saveChanges = () => {
    onUpdateParameters(localParameters);
    setHasChanges(false);
  };

  const resetChanges = () => {
    setLocalParameters(parameters);
    setHasChanges(false);
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

  return (
    <Card className="border-muted bg-black/30">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Parameter Weights & Preferences</h3>
            <p className="text-sm text-muted-foreground">Adjust how each parameter impacts the overall score</p>
          </div>

          {localParameters.map(param => (
            <div key={param.id} className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <Label className="text-sm font-medium">{param.name}</Label>
                <div className="text-sm font-medium bg-gradient-to-r from-purple to-pink bg-clip-text text-transparent">
                  {param.weight.toFixed(1)}
                </div>
              </div>
              
              <Slider
                id={`weight-${param.id}`}
                min={1}
                max={10}
                step={1}
                value={[param.weight * 10]}
                onValueChange={(value) => handleWeightChange(param.id, value[0])}
              />
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground max-w-[70%]">{param.description}</p>
                <Select
                  value={param.preferredDirection || 'high'}
                  onValueChange={(value) => handleDirectionChange(param.id, value as PreferenceDirection)}
                >
                  <SelectTrigger className="w-36">
                    <div className="flex items-center gap-1">
                      {getDirectionIcon(param.preferredDirection)}
                      <span className="text-xs">
                        {param.preferredDirection === 'high' ? 'Higher is Better' : 
                         param.preferredDirection === 'low' ? 'Lower is Better' : 'Neutral'}
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
              </div>
            </div>
          ))}
          
          <div className="flex justify-end gap-2 pt-4">
            {hasChanges && (
              <>
                <Button variant="outline" onClick={resetChanges} className="flex items-center gap-2">
                  <Undo className="h-4 w-4" />
                  <span>Reset</span>
                </Button>
                <Button variant="default" onClick={saveChanges} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
