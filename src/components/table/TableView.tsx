import React, { useState, useEffect } from 'react';
import { UseCase, ScoreLevel, StatusType } from '@/types/types';
import { 
  Table, 
  TableBody
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UseCaseForm } from '../UseCaseForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { SearchBar } from './SearchBar';
import { TableActions } from './TableActions';
import { TableHeader } from './TableHeader';
import { TableRowItem } from './TableRowItem';
import { SortConfig, SortableColumnKey, getSortedFilteredData } from './tableUtils';
import { Alert } from '@/components/ui/alert';
import { Edit } from 'lucide-react';

interface TableViewProps {
  useCases: UseCase[];
  onEdit: (id: string, data: Partial<UseCase>) => void;
  onDelete: (id: string) => void;
}

export const TableView = ({ useCases, onEdit, onDelete }: TableViewProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewUseCaseDialog, setShowNewUseCaseDialog] = useState(false);
  const [showAllParameters, setShowAllParameters] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'score', direction: 'desc' });

  // Handle fullscreen toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast({
          title: "Error",
          description: `Could not enter fullscreen mode: ${err.message}`,
          variant: "destructive",
        });
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle sorting
  const requestSort = (key: SortableColumnKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get the sorted and filtered data
  const sortedFilteredData = getSortedFilteredData(useCases, searchQuery, sortConfig);

  // Handle inline editing of score values
  const handleScoreChange = (
    id: string, 
    scoreKey: string, 
    value: ScoreLevel
  ) => {
    const useCase = useCases.find(uc => uc.id === id);
    if (!useCase) return;
    
    const updatedScores = {
      ...useCase.scores,
      [scoreKey]: value
    };
    
    onEdit(id, { scores: updatedScores });
  };

  // Handle inline editing of status
  const handleStatusChange = (id: string, status: StatusType) => {
    onEdit(id, { status });
  };

  // Toggle edit mode for a row
  const toggleEditMode = (id: string) => {
    if (editingId === id) {
      setEditingId(null);
      toast({
        title: "Changes saved",
        description: "Your changes have been applied successfully.",
      });
    } else {
      setEditingId(id);
    }
  };

  // Toggle showing all parameters
  const toggleShowAllParameters = () => {
    setShowAllParameters(!showAllParameters);
  };

  return (
    <div className={`space-y-4 transition-all ${isFullScreen ? 'bg-black p-6 min-h-screen' : ''}`}>
      {editingId && (
        <Alert className="bg-primary/5 border-primary/20 text-foreground">
          <Edit className="h-4 w-4 text-primary mr-2" />
          <span className="text-sm">
            Edit mode enabled. Click the checkmark to save changes or X to cancel.
          </span>
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <TableActions 
          onAddNewClick={() => setShowNewUseCaseDialog(true)}
          showAllParameters={showAllParameters}
          toggleShowAllParameters={toggleShowAllParameters}
          isFullScreen={isFullScreen}
          toggleFullScreen={toggleFullScreen}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader 
            showAllParameters={showAllParameters}
            sortConfig={sortConfig}
            requestSort={requestSort}
          />
          <TableBody>
            {sortedFilteredData.length > 0 ? (
              sortedFilteredData.map((useCase) => (
                <TableRowItem
                  key={useCase.id}
                  useCase={useCase}
                  editingId={editingId}
                  showAllParameters={showAllParameters}
                  toggleEditMode={toggleEditMode}
                  handleScoreChange={handleScoreChange}
                  handleStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <tr>
                <td colSpan={showAllParameters ? 12 : 6} className="h-32 text-center">
                  No use cases found.
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      {/* New Use Case Dialog */}
      <Dialog open={showNewUseCaseDialog} onOpenChange={setShowNewUseCaseDialog}>
        <DialogContent className="sm:max-w-[700px] p-0 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Create New Use Case</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            <UseCaseForm 
              onComplete={() => setShowNewUseCaseDialog(false)} 
              isEditing={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
