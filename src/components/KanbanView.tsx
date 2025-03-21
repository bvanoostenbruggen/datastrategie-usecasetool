
import { useState } from 'react';
import { UseCase, StatusType } from '@/types/types';
import UseCaseCard from './UseCaseCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanColumnProps {
  title: string;
  status: StatusType;
  useCases: UseCase[];
  onEdit: (id: string, data: Partial<UseCase>) => void;
  onDelete: (id: string) => void;
}

const KanbanColumn = ({ title, status, useCases, onEdit, onDelete }: KanbanColumnProps) => {
  return (
    <div className="flex flex-col h-full min-w-[280px] max-w-[300px]">
      <div className="mb-3">
        <h3 className="text-lg font-medium flex items-center">
          <span 
            className={`w-3 h-3 rounded-full mr-2 ${
              status === 'backlog' ? 'bg-gray-400' : 
              status === 'in-progress' ? 'bg-purple' : 
              status === 'completed' ? 'bg-pink' : 'bg-gray-600'
            }`}
          />
          {title} <span className="ml-2 text-sm text-muted-foreground">({useCases.length})</span>
        </h3>
      </div>
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 bg-black/20 rounded-md p-2 overflow-y-auto min-h-[400px]"
          >
            {useCases.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Drop use cases here</p>
              </div>
            )}
            {useCases.map((useCase, index) => (
              <Draggable key={useCase.id} draggableId={useCase.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-3"
                  >
                    <UseCaseCard
                      useCase={useCase}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

interface KanbanViewProps {
  useCases: UseCase[];
  onEdit: (id: string, data: Partial<UseCase>) => void;
  onDelete: (id: string) => void;
}

export const KanbanView = ({ useCases, onEdit, onDelete }: KanbanViewProps) => {
  // Group use cases by status
  const backlogUseCases = useCases.filter(useCase => useCase.status === 'backlog');
  const inProgressUseCases = useCases.filter(useCase => useCase.status === 'in-progress');
  const completedUseCases = useCases.filter(useCase => useCase.status === 'completed');
  const archivedUseCases = useCases.filter(useCase => useCase.status === 'archived');
  
  // For mobile scrolling of columns
  const [scrollPosition, setScrollPosition] = useState(0);
  const columnsCount = 4; // Number of kanban columns
  
  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('kanban-container');
    if (!container) return;
    
    const columnWidth = 300; // Approximate width of a column
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - 1) 
      : Math.min(columnsCount - 1, scrollPosition + 1);
    
    container.scrollTo({
      left: newPosition * columnWidth,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Update the use case status
    const useCaseId = draggableId;
    const newStatus = destination.droppableId as StatusType;
    
    // Call the edit function to update the use case status
    onEdit(useCaseId, { status: newStatus });
  };

  return (
    <Card className="animate-fade-in border-muted bg-black/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Use Case Lifecycle</CardTitle>
          <div className="sm:hidden flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleScroll('left')}
              disabled={scrollPosition === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Badge variant="outline">
              {scrollPosition + 1} / {columnsCount}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleScroll('right')}
              disabled={scrollPosition === columnsCount - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div 
            id="kanban-container"
            className="flex gap-4 overflow-x-auto pb-4 snap-x"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="snap-center">
              <KanbanColumn
                title="Backlog"
                status="backlog"
                useCases={backlogUseCases}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
            <div className="snap-center">
              <KanbanColumn
                title="In Progress"
                status="in-progress"
                useCases={inProgressUseCases}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
            <div className="snap-center">
              <KanbanColumn
                title="Completed"
                status="completed"
                useCases={completedUseCases}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
            <div className="snap-center">
              <KanbanColumn
                title="Archived"
                status="archived"
                useCases={archivedUseCases}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </div>
        </DragDropContext>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Drag and drop use cases to change their status</p>
        </div>
      </CardContent>
    </Card>
  );
};
