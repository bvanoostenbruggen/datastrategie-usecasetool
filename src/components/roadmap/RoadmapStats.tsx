
import { useState } from 'react';
import { Calculator, Users } from 'lucide-react';
import { RoleAllocation } from '@/types/types';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface RoadmapStatsProps {
  totalTime: number;
  totalFTE: number;
  roleAllocations: RoleAllocation[];
}

export const RoadmapStats = ({ totalTime, totalFTE, roleAllocations }: RoadmapStatsProps) => {
  const hasRoleAllocations = roleAllocations.length > 0;
  
  // Calculate totals per role
  const roleTotals = roleAllocations.reduce<Record<string, number>>((acc, { role, fte }) => {
    acc[role] = (acc[role] || 0) + fte;
    return acc;
  }, {});

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-black/30 p-2 px-3 rounded-lg border border-border/50">
        <Calculator className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm">
          <span className="text-muted-foreground">Total Time:</span>
          <span className="ml-1 font-medium">{totalTime} weeks</span>
        </div>
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 bg-black/30 p-2 px-3 rounded-lg border border-border/50 cursor-pointer hover:bg-black/40 transition-colors">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <span className="text-muted-foreground">Total FTE:</span>
              <span className="ml-1 font-medium">{totalFTE.toFixed(1)}</span>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">FTE Breakdown by Role</h4>
            
            {hasRoleAllocations ? (
              <div className="space-y-1">
                {Object.entries(roleTotals).map(([role, fte]) => (
                  <div key={role} className="flex justify-between gap-4 text-sm">
                    <span>{role}:</span>
                    <span className="font-medium">{fte.toFixed(1)} FTE</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No role allocations set. Assign roles to use cases to see a breakdown.
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
