
import { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { UseCase } from '@/types/types';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronRight, GripVertical } from 'lucide-react';

interface SelectionPanelProps {
  availableUseCases: UseCase[];
  selectedUseCases: string[];
  addUseCaseToRoadmap: (id: string) => void;
  collapsed: boolean;
}

export const SelectionPanel = ({ 
  availableUseCases, 
  selectedUseCases, 
  addUseCaseToRoadmap, 
  collapsed 
}: SelectionPanelProps) => {
  const getScoreColorClass = (score: number) => {
    if (score >= 4) return "bg-green-500/20";
    if (score >= 3) return "bg-blue-500/20";
    if (score >= 2) return "bg-amber-500/20";
    return "bg-red-500/20";
  };
  
  return (
    <Collapsible open={!collapsed} className="min-w-[280px] max-w-[320px] flex-shrink-0 transition-all duration-500">
      <CollapsibleContent className="data-[state=closed]:hidden">
        <Card className="border border-muted bg-black/30">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              Available Use Cases
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Drag use cases to the roadmap or click the checkbox to add them
            </p>
          </div>
          <Droppable droppableId="available">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-3 max-h-[calc(100vh-300px)] overflow-y-auto"
              >
                {availableUseCases.map((useCase, index) => (
                  <Draggable
                    key={useCase.id}
                    draggableId={useCase.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="mb-3 p-3 border border-border rounded-md bg-black/20 hover:bg-black/40 transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <div {...provided.dragHandleProps} className="mt-1">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Checkbox 
                            id={`select-${useCase.id}`}
                            checked={selectedUseCases.includes(useCase.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                addUseCaseToRoadmap(useCase.id);
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium">
                              {useCase.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {useCase.description}
                            </div>
                            <div className="flex gap-2 mt-2 items-center">
                              <Badge 
                                variant="secondary" 
                                className={`${getScoreColorClass(useCase.score)} bg-opacity-50`}
                              >
                                Score: {useCase.score.toFixed(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {availableUseCases.length === 0 && (
                  <div className="text-sm text-muted-foreground italic text-center mt-4 p-4">
                    All use cases have been added to the roadmap
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};
