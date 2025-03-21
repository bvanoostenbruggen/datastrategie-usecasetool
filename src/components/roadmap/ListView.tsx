
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import RoadmapItem from './RoadmapItem';
import { UseCase, RoadmapPhase, RoleAllocation } from '@/types/types';

interface ListViewProps {
  roadmapItems: (UseCase & { phase: RoadmapPhase })[];
  updateEstimatedTime: (id: string, weeks: number) => void;
  updateEstimatedFTE: (id: string, fte: number) => void;
  updateRoleAllocations: (id: string, roleAllocations: RoleAllocation[]) => void;
  phases: { id: RoadmapPhase; label: string; icon: React.ReactNode }[];
  removeUseCaseFromRoadmap?: (id: string) => void;
}

export const ListView = ({ 
  roadmapItems, 
  updateEstimatedTime, 
  updateEstimatedFTE,
  updateRoleAllocations,
  phases,
  removeUseCaseFromRoadmap
}: ListViewProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {phases.map((phase) => {
        const phaseItems = roadmapItems.filter(item => item.phase === phase.id);
        
        return (
          <Card key={phase.id} className="border border-muted bg-card">
            <div className="p-4 border-b border-border flex items-center">
              <div className="mr-2">{phase.icon}</div>
              <h3 className="font-medium">{phase.label}</h3>
              <div className="ml-auto">
                <span className="text-xs text-muted-foreground">
                  {phaseItems.length} item{phaseItems.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <Droppable droppableId={phase.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`p-4 ${!phaseItems.length ? 'h-32' : ''}`}
                >
                  {phaseItems.map((item, index) => (
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
                  {!phaseItems.length && (
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
