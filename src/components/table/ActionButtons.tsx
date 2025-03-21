
import { Button } from '@/components/ui/button';
import { Edit, Save, X, Check } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface ActionButtonsProps {
  isEditing: boolean;
  onToggleEdit: () => void;
}

export const ActionButtons = ({ isEditing, onToggleEdit }: ActionButtonsProps) => {
  if (isEditing) {
    return (
      <div className="flex justify-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleEdit}
                size="icon-sm"
                variant="outline"
                className="h-8 w-8 border-red-400/30 hover:bg-red-500/10 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Cancel Editing</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleEdit}
                size="icon-sm"
                variant="default"
                className="h-8 w-8 bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Save Changes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onToggleEdit}
            size="icon-sm"
            variant="ghost"
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Edit Row</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
