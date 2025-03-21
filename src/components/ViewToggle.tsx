
import { ListIcon, GridIcon, KanbanIcon, TableIcon, LayoutIcon, Clock, Calendar, LineChart } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ViewToggleProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  isRoadmap?: boolean;
}

export const ViewToggle = ({ activeTab, setActiveTab, isRoadmap = false }: ViewToggleProps) => {
  if (isRoadmap) {
    return (
      <div className="flex justify-center md:justify-start items-center gap-3">
        <ToggleGroup 
          type="single" 
          value={activeTab} 
          onValueChange={(value) => value && setActiveTab(value)}
          className="bg-black/40 border border-white/10 p-1.5 rounded-lg shadow-md w-full max-w-md"
        >
          <ToggleGroupItem 
            value="timeline" 
            aria-label="Timeline View"
            className="flex-1 data-[state=on]:bg-pink/90 data-[state=on]:text-black data-[state=on]:shadow-sm rounded-md text-sm gap-2 px-3 h-10 transition-all duration-200 hover:bg-white/5 font-medium"
          >
            <LineChart className="h-4 w-4 inline-block mr-1" />
            <span>Timeline</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="list" 
            aria-label="List View"
            className="flex-1 data-[state=on]:bg-purple/90 data-[state=on]:text-black data-[state=on]:shadow-sm rounded-md text-sm gap-2 px-3 h-10 transition-all duration-200 hover:bg-white/5 font-medium"
          >
            <ListIcon className="h-4 w-4 inline-block mr-1" />
            <span>List</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="quarterly" 
            aria-label="Quarterly View"
            className="flex-1 data-[state=on]:bg-pink/90 data-[state=on]:text-black data-[state=on]:shadow-sm rounded-md text-sm gap-2 px-3 h-10 transition-all duration-200 hover:bg-white/5 font-medium"
          >
            <Calendar className="h-4 w-4 inline-block mr-1" />
            <span>Quarterly</span>
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Button variant="outline" asChild className="hidden md:flex" size="sm">
          <Link to="/" className="flex items-center gap-1">
            <ListIcon className="h-4 w-4" />
            <span>Use Cases</span>
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center md:justify-start items-center gap-3">
      <ToggleGroup 
        type="single" 
        value={activeTab} 
        onValueChange={(value) => value && setActiveTab(value)}
        className="bg-black/40 border border-white/10 p-1.5 rounded-lg shadow-md w-full max-w-md"
      >
        <ToggleGroupItem 
          value="list" 
          aria-label="List View"
          className="flex-1 data-[state=on]:bg-pink/90 data-[state=on]:text-black data-[state=on]:shadow-sm rounded-md text-sm gap-2 px-3 h-10 transition-all duration-200 hover:bg-white/5 font-medium"
        >
          <ListIcon className="h-4 w-4 inline-block mr-1" />
          <span>List</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="matrix" 
          aria-label="Matrix View"
          className="flex-1 data-[state=on]:bg-purple/90 data-[state=on]:text-black data-[state=on]:shadow-sm rounded-md text-sm gap-2 px-3 h-10 transition-all duration-200 hover:bg-white/5 font-medium"
        >
          <GridIcon className="h-4 w-4 inline-block mr-1" />
          <span>Matrix</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="kanban" 
          aria-label="Kanban View"
          className="flex-1 data-[state=on]:bg-pink/90 data-[state=on]:text-black data-[state=on]:shadow-sm rounded-md text-sm gap-2 px-3 h-10 transition-all duration-200 hover:bg-white/5 font-medium"
        >
          <KanbanIcon className="h-4 w-4 inline-block mr-1" />
          <span>Kanban</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="table" 
          aria-label="Table View"
          className="flex-1 data-[state=on]:bg-purple/90 data-[state=on]:text-black data-[state=on]:shadow-sm rounded-md text-sm gap-2 px-3 h-10 transition-all duration-200 hover:bg-white/5 font-medium"
        >
          <TableIcon className="h-4 w-4 inline-block mr-1" />
          <span>Table</span>
        </ToggleGroupItem>
      </ToggleGroup>
      
      <Button variant="outline" asChild className="hidden md:flex" size="sm">
        <Link to="/roadmap" className="flex items-center gap-1">
          <LayoutIcon className="h-4 w-4" />
          <span>View Roadmap</span>
        </Link>
      </Button>
    </div>
  );
};
