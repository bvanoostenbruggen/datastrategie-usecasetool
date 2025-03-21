
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Maximize, 
  Minimize, 
  Eye, 
  EyeOff, 
  ArrowUpDown,
  Settings
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useState } from 'react';
import { ScorePanel } from '../ScorePanel';
import { useUseCases } from '@/hooks/useUseCases';
import { ScoreLevel } from '@/types/types';

interface TableActionsProps {
  onAddNewClick: () => void;
  showAllParameters: boolean;
  toggleShowAllParameters: () => void;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

export const TableActions = ({ 
  onAddNewClick, 
  showAllParameters, 
  toggleShowAllParameters, 
  isFullScreen, 
  toggleFullScreen 
}: TableActionsProps) => {
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false);
  const { parameters, useCases } = useUseCases();
  
  // Get dummy scores for the preference panel - ensure it's using ScoreLevel type
  const dummyScores = parameters.reduce((acc, param) => {
    acc[param.id] = 3 as ScoreLevel;
    return acc;
  }, {} as Record<string, ScoreLevel>);
  
  return (
    <>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          onClick={onAddNewClick}
          variant="pink"
          size="sm"
          className="flex items-center gap-2 h-10 px-4 w-full sm:w-auto hover:bg-muted/30 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span className="font-medium">Add Use Case</span>
        </Button>
        
        <Button
          onClick={() => setShowPreferencesDialog(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-10 px-4 w-full sm:w-auto hover:bg-muted/20 transition-all duration-200"
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Scoring Preferences</span>
        </Button>
        
        <Button
          onClick={toggleShowAllParameters}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-10 px-4 w-full sm:w-auto hover:bg-muted/20 transition-all duration-200"
        >
          {showAllParameters ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span className="hidden sm:inline font-medium">{showAllParameters ? 'Simplified View' : 'Show All Parameters'}</span>
        </Button>
        
        <Button
          onClick={toggleFullScreen}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-10 px-4 w-full sm:w-auto hover:bg-muted/20 transition-all duration-200"
        >
          {isFullScreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
          <span className="hidden sm:inline font-medium">{isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </Button>
      </div>

      {/* Preferences Dialog */}
      <Dialog open={showPreferencesDialog} onOpenChange={setShowPreferencesDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Scoring Preferences</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Set your preferred direction for each parameter. This will highlight use cases with scores
              that match your preferences.
            </p>
            
            <ScorePanel 
              scores={dummyScores}
              onChange={() => {}}
              showDirectionControls={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
