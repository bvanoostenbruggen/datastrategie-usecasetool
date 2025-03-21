
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseCase, Role, RoleAllocation } from '@/types/types';
import { GripVertical, Trash2, Users, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoadmapItemProps {
  useCase: UseCase;
  index: number;
  updateEstimatedTime: (id: string, weeks: number) => void;
  updateEstimatedFTE: (id: string, fte: number) => void;
  updateRoleAllocations: (id: string, roleAllocations: RoleAllocation[]) => void;
  removeUseCaseFromRoadmap?: (id: string) => void;
}

const defaultRoles: Role[] = [
  'Data Scientist',
  'Data Engineer',
  'Data Strategist',
  'Analytics Engineer'
];

const RoadmapItem = ({
  useCase,
  index,
  updateEstimatedTime,
  updateEstimatedFTE,
  updateRoleAllocations,
  removeUseCaseFromRoadmap
}: RoadmapItemProps) => {
  const [timeInWeeks, setTimeInWeeks] = useState<number>(useCase.estimatedTimeInWeeks || 4);
  const [fte, setFte] = useState<number>(useCase.estimatedFTE || 1);
  const [showRoles, setShowRoles] = useState<boolean>(false);
  const [roleAllocations, setRoleAllocations] = useState<RoleAllocation[]>(
    useCase.roleAllocations || []
  );

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue > 0) {
      setTimeInWeeks(newValue);
      updateEstimatedTime(useCase.id, newValue);
    }
  };

  const handleFteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue > 0) {
      setFte(newValue);
      updateEstimatedFTE(useCase.id, newValue);
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 4) return "bg-green-500/20";
    if (score >= 3) return "bg-blue-500/20";
    if (score >= 2) return "bg-amber-500/20";
    return "bg-red-500/20";
  };

  const addRoleAllocation = () => {
    // Find a role that hasn't been allocated yet
    const unusedRoles = defaultRoles.filter(
      role => !roleAllocations.some(allocation => allocation.role === role)
    );

    if (unusedRoles.length > 0) {
      const newAllocations = [
        ...roleAllocations,
        { role: unusedRoles[0], fte: 0.5 }
      ];
      setRoleAllocations(newAllocations);
      updateRoleAllocations(useCase.id, newAllocations);
    }
  };

  const removeRoleAllocation = (index: number) => {
    const newAllocations = roleAllocations.filter((_, i) => i !== index);
    setRoleAllocations(newAllocations);
    updateRoleAllocations(useCase.id, newAllocations);
  };

  const updateRole = (index: number, role: Role) => {
    const newAllocations = [...roleAllocations];
    newAllocations[index].role = role;
    setRoleAllocations(newAllocations);
    updateRoleAllocations(useCase.id, newAllocations);
  };

  const updateRoleFte = (index: number, value: number) => {
    const newAllocations = [...roleAllocations];
    newAllocations[index].fte = value;
    setRoleAllocations(newAllocations);
    updateRoleAllocations(useCase.id, newAllocations);
  };

  // Calculate total FTE from role allocations
  const calculateTotalFte = () => {
    if (roleAllocations.length === 0) return fte;
    
    const total = roleAllocations.reduce((sum, allocation) => sum + allocation.fte, 0);
    if (total !== fte) {
      // Update the total FTE if it doesn't match the sum of allocations
      updateEstimatedFTE(useCase.id, total);
      setFte(total);
    }
    return total;
  };

  return (
    <Draggable draggableId={useCase.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-4"
        >
          <Card className="border border-muted p-3 bg-black/20 hover:bg-black/30 transition-colors">
            <div className="flex items-start gap-2">
              <div {...provided.dragHandleProps} className="mt-1">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>

              {removeUseCaseFromRoadmap && (
                <Checkbox 
                  checked={true}
                  onCheckedChange={() => {
                    if (removeUseCaseFromRoadmap) {
                      removeUseCaseFromRoadmap(useCase.id);
                    }
                  }}
                  className="mt-1"
                />
              )}

              <div className="flex-1">
                <div className="font-medium">{useCase.title}</div>
                <div className="text-xs text-muted-foreground mb-2 truncate max-w-full">
                  {useCase.description}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary" className={`${getScoreColorClass(useCase.score)} bg-opacity-50`}>
                    Score: {useCase.score.toFixed(1)}
                  </Badge>
                  
                  <Badge variant="outline">
                    Status: {useCase.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Time (weeks)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={timeInWeeks}
                      onChange={handleTimeChange}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Resources (FTE)
                    </label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={calculateTotalFte()}
                        onChange={handleFteChange}
                        className="h-8 text-sm"
                        disabled={roleAllocations.length > 0}
                      />
                      <Button 
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setShowRoles(!showRoles)}
                      >
                        <Users size={14} />
                      </Button>
                    </div>
                  </div>
                </div>

                {showRoles && (
                  <div className="mt-2 border-t border-border pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-xs font-medium">Role Allocations</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={addRoleAllocation}
                        className="h-6 px-2"
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                    
                    {roleAllocations.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No roles assigned yet</p>
                    ) : (
                      <div className="space-y-2">
                        {roleAllocations.map((allocation, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Select
                              value={allocation.role}
                              onValueChange={(value) => updateRole(i, value)}
                            >
                              <SelectTrigger className="h-7 text-xs flex-1">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                {defaultRoles.map((role) => (
                                  <SelectItem 
                                    key={role} 
                                    value={role}
                                    disabled={roleAllocations.some(
                                      (a, idx) => a.role === role && idx !== i
                                    )}
                                  >
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={allocation.fte}
                              onChange={(e) => updateRoleFte(i, parseFloat(e.target.value))}
                              className="h-7 text-xs w-16"
                            />
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRoleAllocation(i)}
                              className="h-7 px-1"
                            >
                              <Minus size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default RoadmapItem;
