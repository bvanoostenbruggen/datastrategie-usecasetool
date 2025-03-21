
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Users } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Role, RoleAllocation } from '@/types/types';

interface RoleAllocationsProps {
  roleAllocations: RoleAllocation[];
  updateRoleAllocations?: (roleAllocations: RoleAllocation[]) => void;
}

const defaultRoles: Role[] = [
  'Data Scientist',
  'Data Engineer',
  'Data Strategist',
  'Analytics Engineer'
];

export const RoleAllocations = ({ 
  roleAllocations, 
  updateRoleAllocations 
}: RoleAllocationsProps) => {
  
  const handleAddRole = () => {
    if (!updateRoleAllocations) return;
    
    // Find a role that hasn't been allocated yet
    const unusedRoles = defaultRoles.filter(
      role => !roleAllocations.some(allocation => allocation.role === role)
    );

    if (unusedRoles.length > 0) {
      const newAllocations = [
        ...roleAllocations,
        { role: unusedRoles[0], fte: 0.5 }
      ];
      updateRoleAllocations(newAllocations);
    }
  };

  const handleRemoveRole = (index: number) => {
    if (!updateRoleAllocations) return;
    
    const newAllocations = roleAllocations.filter((_, i) => i !== index);
    updateRoleAllocations(newAllocations);
  };

  const handleRoleChange = (index: number, role: Role) => {
    if (!updateRoleAllocations) return;
    
    const newAllocations = [...roleAllocations];
    newAllocations[index].role = role;
    updateRoleAllocations(newAllocations);
  };

  const handleFteChange = (index: number, fte: number) => {
    if (!updateRoleAllocations) return;
    
    const newAllocations = [...roleAllocations];
    newAllocations[index].fte = fte;
    updateRoleAllocations(newAllocations);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">
          Role Allocations
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddRole}
          className="h-7 px-2"
          disabled={roleAllocations.length >= defaultRoles.length}
        >
          <Plus size={14} className="mr-1" /> Add Role
        </Button>
      </div>

      {roleAllocations.length > 0 ? (
        <div className="space-y-2 border p-3 rounded-md bg-black/10">
          {roleAllocations.map((allocation, i) => (
            <div key={i} className="flex items-center gap-2">
              <Select
                value={allocation.role}
                onValueChange={(value) => handleRoleChange(i, value)}
              >
                <SelectTrigger className="flex-1">
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
              
              <div className="flex items-center gap-1">
                <span className="text-sm whitespace-nowrap">FTE:</span>
                <Input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={allocation.fte}
                  onChange={(e) => handleFteChange(i, parseFloat(e.target.value))}
                  className="w-20"
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveRole(i)}
                className="h-8 px-2"
              >
                <Minus size={14} />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground border border-dashed p-3 rounded-md text-center">
          <Users size={18} className="mx-auto mb-1 opacity-50" />
          No roles assigned yet. Add roles to track FTE requirements.
        </div>
      )}
    </div>
  );
};
