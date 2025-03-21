
import { UseCase } from '@/types/types';
import { Card } from '@/components/ui/card';
import { UseCaseList } from '@/components/UseCaseList';
import { DraggablePriorityMatrix } from '@/components/DraggablePriorityMatrix';
import { KanbanView } from '@/components/KanbanView';
import { TableView } from '@/components/TableView';

interface ContentViewProps {
  activeTab: string;
  filteredUseCases: UseCase[];
  onUpdateUseCase: (id: string, data: Partial<UseCase>) => void;
  onDeleteUseCase: (id: string) => void;
}

export const ContentView = ({ 
  activeTab, 
  filteredUseCases, 
  onUpdateUseCase, 
  onDeleteUseCase 
}: ContentViewProps) => {
  return (
    <>
      {activeTab === 'list' && (
        <Card className="p-6 animate-fade-in border-muted bg-black/50">
          <UseCaseList 
            useCases={filteredUseCases || []}
            onEdit={onUpdateUseCase}
            onDelete={onDeleteUseCase}
          />
        </Card>
      )}
      {activeTab === 'matrix' && (
        <DraggablePriorityMatrix 
          useCases={filteredUseCases || []} 
          onUpdateUseCase={onUpdateUseCase}
        />
      )}
      {activeTab === 'kanban' && (
        <KanbanView
          useCases={filteredUseCases || []}
          onEdit={onUpdateUseCase}
          onDelete={onDeleteUseCase}
        />
      )}
      {activeTab === 'table' && (
        <Card className="p-6 animate-fade-in border-muted bg-black/50">
          <TableView 
            useCases={filteredUseCases || []}
            onEdit={onUpdateUseCase}
            onDelete={onDeleteUseCase}
          />
        </Card>
      )}
    </>
  );
};
