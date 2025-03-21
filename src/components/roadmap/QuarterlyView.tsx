
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import RoadmapItem from './RoadmapItem';
import { UseCase, RoadmapPhase, RoleAllocation } from '@/types/types';

interface QuarterlyViewProps {
  roadmapItems: (UseCase & { phase: RoadmapPhase })[];
  updateEstimatedTime: (id: string, weeks: number) => void;
  updateEstimatedFTE: (id: string, fte: number) => void;
  updateRoleAllocations: (id: string, roleAllocations: RoleAllocation[]) => void;
  removeUseCaseFromRoadmap?: (id: string) => void;
}

export const QuarterlyView = ({ 
  roadmapItems, 
  updateEstimatedTime, 
  updateEstimatedFTE,
  updateRoleAllocations,
  removeUseCaseFromRoadmap
}: QuarterlyViewProps) => {
  const quarters = [
    { id: 'quarterly-q1' as RoadmapPhase, label: 'Q1', icon: <span className="text-xs font-bold mr-1">Q1</span> },
    { id: 'quarterly-q2' as RoadmapPhase, label: 'Q2', icon: <span className="text-xs font-bold mr-1">Q2</span> },
    { id: 'quarterly-q3' as RoadmapPhase, label: 'Q3', icon: <span className="text-xs font-bold mr-1">Q3</span> },
    { id: 'quarterly-q4' as RoadmapPhase, label: 'Q4', icon: <span className="text-xs font-bold mr-1">Q4</span> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {quarters.map((quarter) => {
        const quarterItems = roadmapItems.filter(item => item.phase === quarter.id);
        
        return (
          <Card key={quarter.id} className="border border-muted bg-card">
            <div className="p-3 border-b border-border flex items-center">
              <div className="mr-1">{quarter.icon}</div>
              <h3 className="font-medium">{quarter.label}</h3>
              <div className="ml-auto">
                <span className="text-xs text-muted-foreground">
                  {quarterItems.length} item{quarterItems.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <Droppable droppableId={quarter.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`p-3 ${!quarterItems.length ? 'min-h-[200px]' : 'min-h-[50px]'}`}
                >
                  {quarterItems.map((item, index) => (
                    <RoadmapItem
                      key={item.id}
                      useCase={item}
                      index={index}
                      updateEstimatedTime={updateEstimatedTime}
                      updateEstimatedFTE={updateEstimatedFTE}
                      updateRoleAllocations={updateRoleAllocations}
                      removeUseCaseFromRoadmap={removeUseCaseFromRoadmap}
                    />
                  ))}
                  {!quarterItems.length && (
                    <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                      <p className="text-muted-foreground text-sm">
                        Drag and drop use cases here
                      </p>
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Card>
        );
      })}
    </div>
  );
};
