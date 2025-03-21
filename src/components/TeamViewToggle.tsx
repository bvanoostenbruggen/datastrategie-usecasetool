
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Users, User } from 'lucide-react';

interface TeamViewToggleProps {
  isTeamView: boolean;
  onToggle: (value: boolean) => void;
  className?: string;
}

export const TeamViewToggle = ({ isTeamView, onToggle, className = '' }: TeamViewToggleProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <ToggleGroup type="single" value={isTeamView ? "team" : "overall"} className="bg-black/5 rounded-md">
        <ToggleGroupItem 
          value="overall" 
          aria-label="Overall View"
          onClick={() => onToggle(false)}
          className="px-3 py-1.5"
          variant="subtle"
        >
          <Users className="h-4 w-4 mr-2" />
          <span className="text-xs font-medium">Overall</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="team" 
          aria-label="Team View"
          onClick={() => onToggle(true)}
          className="px-3 py-1.5"
          variant="subtle"
        >
          <User className="h-4 w-4 mr-2" />
          <span className="text-xs font-medium">My Team</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
