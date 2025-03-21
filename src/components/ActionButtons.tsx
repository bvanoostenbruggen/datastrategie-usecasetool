
import { Button } from '@/components/ui/button';
import { FileDown, SlidersHorizontal, Plus, Settings } from 'lucide-react';

interface ActionButtonsProps {
  onExport: () => void;
  onParametersClick: () => void;
  onWeightsClick: () => void;
  onNewUseCaseClick: () => void;
}

export const ActionButtons = ({
  onExport,
  onParametersClick,
  onWeightsClick,
  onNewUseCaseClick
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-3 w-full md:w-auto mt-4 md:mt-0">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onExport}
        className="flex items-center gap-2 h-10 px-4 flex-1 sm:flex-auto justify-center hover:bg-muted/30 transition-all duration-200"
      >
        <FileDown className="h-4 w-4" />
        <span className="font-medium">Export</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onParametersClick}
        className="flex items-center gap-2 h-10 px-4 flex-1 sm:flex-auto justify-center hover:bg-muted/30 transition-all duration-200"
      >
        <Settings className="h-4 w-4" />
        <span className="font-medium">Parameters</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onWeightsClick}
        className="flex items-center gap-2 h-10 px-4 flex-1 sm:flex-auto justify-center hover:bg-muted/30 transition-all duration-200"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="font-medium">Weights</span>
      </Button>

      <Button 
        variant="pink" 
        size="sm"
        onClick={onNewUseCaseClick}
        className="flex items-center gap-2 h-10 px-4 flex-1 sm:flex-auto justify-center hover:bg-muted/30 transition-all duration-200"
      >
        <Plus className="h-4 w-4" />
        <span className="font-medium">New Use Case</span>
      </Button>
    </div>
  );
};
