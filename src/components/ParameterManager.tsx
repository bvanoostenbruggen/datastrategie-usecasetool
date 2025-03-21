
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ScoreParameter, PreferenceDirection } from '@/types/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  Plus, Trash2, MoveUp, MoveDown, Menu, Edit, Save, X, 
  ArrowUp, ArrowDown, Minus 
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ParameterManagerProps {
  parameters: ScoreParameter[];
  onUpdateParameters: (parameters: ScoreParameter[]) => void;
}

export const ParameterManager = ({ parameters, onUpdateParameters }: ParameterManagerProps) => {
  const [localParameters, setLocalParameters] = useState<ScoreParameter[]>(parameters);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newParameter, setNewParameter] = useState<Omit<ScoreParameter, 'id'>>({
    name: '',
    description: '',
    weight: 0.5,
    defaultValue: 3,
    preferredDirection: 'high'
  });

  // Handle parameter edits
  const handleParameterEdit = (id: string, field: keyof ScoreParameter, value: any) => {
    setLocalParameters(prev => prev.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  // Add a new parameter
  const handleAddParameter = () => {
    if (!newParameter.name.trim()) {
      toast({
        title: "Error",
        description: "Parameter name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const newId = uuidv4();
    const newParams = [...localParameters, { id: newId, ...newParameter }];
    setLocalParameters(newParams);
    onUpdateParameters(newParams);
    
    // Reset new parameter form
    setNewParameter({
      name: '',
      description: '',
      weight: 0.5,
      defaultValue: 3,
      preferredDirection: 'high'
    });

    toast({
      title: "Parameter Added",
      description: `"${newParameter.name}" has been added to your scoring parameters.`
    });
  };

  // Delete a parameter
  const handleDeleteParameter = (id: string) => {
    if (localParameters.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one scoring parameter.",
        variant: "destructive"
      });
      return;
    }

    const newParams = localParameters.filter(param => param.id !== id);
    setLocalParameters(newParams);
    onUpdateParameters(newParams);
    setConfirmDeleteId(null);
    
    toast({
      title: "Parameter Deleted",
      description: "The parameter has been removed from your scoring system."
    });
  };

  // Move parameter up in the order
  const moveParameterUp = (index: number) => {
    if (index === 0) return;
    const newParams = [...localParameters];
    [newParams[index - 1], newParams[index]] = [newParams[index], newParams[index - 1]];
    setLocalParameters(newParams);
    onUpdateParameters(newParams);
  };

  // Move parameter down in the order
  const moveParameterDown = (index: number) => {
    if (index === localParameters.length - 1) return;
    const newParams = [...localParameters];
    [newParams[index], newParams[index + 1]] = [newParams[index + 1], newParams[index]];
    setLocalParameters(newParams);
    onUpdateParameters(newParams);
  };

  // Toggle edit mode for a parameter
  const toggleEditMode = (id: string) => {
    if (editingId === id) {
      setEditingId(null);
      onUpdateParameters(localParameters);
      
      toast({
        title: "Changes Saved",
        description: "Your parameter changes have been saved."
      });
    } else {
      setEditingId(id);
    }
  };

  // Get icon for preferred direction
  const getDirectionIcon = (direction: PreferenceDirection) => {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Scoring Parameters</h3>
        <p className="text-sm text-muted-foreground">Customize the parameters used for scoring use cases</p>
      </div>

      <div className="space-y-4">
        {localParameters.map((param, index) => (
          <Card key={param.id} className={`border-muted ${editingId === param.id ? 'bg-primary/5 border-primary/20' : 'bg-black/30'}`}>
            <CardContent className="p-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-10">
                  {editingId === param.id ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`param-name-${param.id}`}>Parameter Name</Label>
                        <Input 
                          id={`param-name-${param.id}`}
                          value={param.name}
                          onChange={(e) => handleParameterEdit(param.id, 'name', e.target.value)}
                          placeholder="Enter parameter name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`param-desc-${param.id}`}>Description</Label>
                        <Textarea 
                          id={`param-desc-${param.id}`}
                          value={param.description}
                          onChange={(e) => handleParameterEdit(param.id, 'description', e.target.value)}
                          placeholder="Enter description"
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`param-weight-${param.id}`}>Weight: {param.weight.toFixed(1)}</Label>
                        <Slider
                          id={`param-weight-${param.id}`}
                          value={[param.weight * 10]}
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={(values) => handleParameterEdit(param.id, 'weight', values[0] / 10)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`param-direction-${param.id}`}>Preferred Direction</Label>
                        <Select
                          value={param.preferredDirection || 'high'}
                          onValueChange={(value: PreferenceDirection) => handleParameterEdit(param.id, 'preferredDirection', value)}
                        >
                          <SelectTrigger id={`param-direction-${param.id}`} className="mt-1">
                            <SelectValue placeholder="Select direction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">Higher is Better</SelectItem>
                            <SelectItem value="low">Lower is Better</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{param.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{param.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            <span className="text-sm">Weight:</span>
                            <span className="font-bold bg-gradient-to-r from-purple to-pink bg-clip-text text-transparent">
                              {param.weight.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-muted/20 px-2 py-1 rounded-sm">
                            {getDirectionIcon(param.preferredDirection || 'high')}
                            <span className="text-xs">
                              {param.preferredDirection === 'high' ? 'Higher is Better' : 
                               param.preferredDirection === 'low' ? 'Lower is Better' : 'Neutral'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="col-span-12 sm:col-span-2 flex sm:flex-col justify-end items-center sm:items-end gap-2">
                  {editingId === param.id ? (
                    <>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        onClick={() => toggleEditMode(param.id)}
                        className="h-8 w-8 border-red-400/30 hover:bg-red-500/10 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="default"
                        onClick={() => toggleEditMode(param.id)}
                        className="h-8 w-8 bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => toggleEditMode(param.id)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setConfirmDeleteId(param.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex sm:flex-col gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => moveParameterUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8"
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => moveParameterDown(index)}
                          disabled={index === localParameters.length - 1}
                          className="h-8 w-8"
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed border-2 border-muted bg-transparent">
        <CardContent className="p-4">
          <div className="space-y-3">
            <h4 className="font-medium">Add New Parameter</h4>
            <div>
              <Label htmlFor="new-param-name">Parameter Name</Label>
              <Input 
                id="new-param-name"
                value={newParameter.name}
                onChange={(e) => setNewParameter({...newParameter, name: e.target.value})}
                placeholder="Enter parameter name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-param-desc">Description</Label>
              <Textarea 
                id="new-param-desc"
                value={newParameter.description}
                onChange={(e) => setNewParameter({...newParameter, description: e.target.value})}
                placeholder="Enter description"
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="new-param-weight">Weight: {newParameter.weight.toFixed(1)}</Label>
              <Slider
                id="new-param-weight"
                value={[newParameter.weight * 10]}
                min={1}
                max={10}
                step={1}
                onValueChange={(values) => setNewParameter({...newParameter, weight: values[0] / 10})}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="new-param-direction">Preferred Direction</Label>
              <Select
                value={newParameter.preferredDirection || 'high'}
                onValueChange={(value: PreferenceDirection) => 
                  setNewParameter({...newParameter, preferredDirection: value as PreferenceDirection})
                }
              >
                <SelectTrigger id="new-param-direction" className="mt-1">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Higher is Better</SelectItem>
                  <SelectItem value="low">Lower is Better</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAddParameter} 
              className="w-full mt-2"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Parameter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog for Deleting Parameters */}
      <AlertDialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this scoring parameter. 
              This action cannot be undone and may affect existing use case scores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmDeleteId && handleDeleteParameter(confirmDeleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
