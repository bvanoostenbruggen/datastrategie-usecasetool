
import { UseCase, ScoreLevel, StatusType } from '@/types/types';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useUseCases } from '@/hooks/useUseCases';
import { UseCaseTitleCell } from './UseCaseTitleCell';
import { ScoreParameterCell } from './ScoreParameterCell';
import { StatusCell } from './StatusCell';
import { ActionButtons } from './ActionButtons';

interface TableRowItemProps {
  useCase: UseCase;
  editingId: string | null;
  showAllParameters: boolean;
  toggleEditMode: (id: string) => void;
  handleScoreChange: (id: string, scoreKey: string, value: ScoreLevel) => void;
  handleStatusChange: (id: string, status: StatusType) => void;
}

export const TableRowItem = ({
  useCase,
  editingId,
  showAllParameters,
  toggleEditMode,
  handleScoreChange,
  handleStatusChange
}: TableRowItemProps) => {
  const isEditing = editingId === useCase.id;
  const { parameters, getParameterHighlights } = useUseCases();
  
  // Get highlights for this use case based on parameter preferences
  const highlights = getParameterHighlights(useCase);
  
  return (
    <TableRow className={isEditing ? 'bg-muted/50 shadow-sm border-l-2 border-l-primary' : ''}>
      <TableCell>
        <UseCaseTitleCell 
          title={useCase.title} 
          description={useCase.description} 
        />
      </TableCell>
      
      {/* Show only first 2 parameters by default, or all if expanded */}
      {parameters
        .slice(0, showAllParameters ? parameters.length : 2)
        .map(param => (
          <TableCell key={param.id}>
            <ScoreParameterCell
              isEditing={isEditing}
              paramId={param.id}
              paramName={param.name}
              score={useCase.scores?.[param.id]}
              highlight={highlights[param.id]}
              useCaseId={useCase.id}
              onScoreChange={handleScoreChange}
            />
          </TableCell>
        ))
      }
      
      <TableCell className="hidden md:table-cell">
        <Badge variant="secondary" className="rounded-sm bg-purple text-black">
          {useCase.score.toFixed(1)}
        </Badge>
      </TableCell>
      
      <TableCell className="hidden lg:table-cell">
        <StatusCell 
          isEditing={isEditing}
          status={useCase.status}
          onStatusChange={(value) => handleStatusChange(useCase.id, value)}
        />
      </TableCell>
      
      <TableCell className="text-right">
        <ActionButtons 
          isEditing={isEditing}
          onToggleEdit={() => toggleEditMode(useCase.id)}
        />
      </TableCell>
    </TableRow>
  );
};
