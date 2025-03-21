
import { useState, useEffect, useMemo } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { useUseCases } from '@/hooks/useUseCases';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { ViewToggle } from '@/components/ViewToggle';
import { RoadmapPhase } from '@/types/types';

// Import refactored components
import { SelectionPanel } from '@/components/roadmap/SelectionPanel';
import { RoadmapContent } from '@/components/roadmap/RoadmapContent';
import { RoadmapStats } from '@/components/roadmap/RoadmapStats';
import { ExportOptions } from '@/components/roadmap/ExportOptions';
import { useRoadmapState } from '@/hooks/useRoadmapState';
import { timelinePhases, quarterlyPhases } from '@/components/roadmap/roadmapConstants';
import { TeamViewToggle } from '@/components/TeamViewToggle';
import { useTeam } from '@/contexts/TeamContext';

const RoadmapPage = () => {
  const navigate = useNavigate();
  const { useCases, updateUseCase } = useUseCases();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState<'timeline' | 'list' | 'quarterly'>('timeline');
  const { isTeamView, toggleTeamView } = useTeam();
  
  const {
    roadmapItems,
    setRoadmapItems,
    selectedUseCases,
    setSelectedUseCases,
    addUseCaseToRoadmap,
    removeUseCaseFromRoadmap,
    updateEstimatedTime,
    updateEstimatedFTE,
    updateRoleAllocations,
    handleDragEnd,
    getAllRoleAllocations,
    totals
  } = useRoadmapState(useCases, view, updateUseCase);
  
  const availableUseCases = useMemo(() => {
    return useCases.filter(useCase => !selectedUseCases.includes(useCase.id));
  }, [useCases, selectedUseCases]);
  
  const phases = view === 'quarterly' ? quarterlyPhases : timelinePhases;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <PageHeader
          title="Implementation Roadmap"
          description="Plan and prioritize your use cases implementation strategy"
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isSidebarCollapsed={sidebarCollapsed}
          actions={
            <div className="flex items-center gap-2">
              <ExportOptions 
                roadmapItems={roadmapItems} 
                view={view} 
                phases={phases} 
              />
              <Button 
                onClick={() => navigate('/')} 
                variant="default"
              >
                Back to Use Cases
              </Button>
            </div>
          }
        />
        
        <div className="mt-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <ViewToggle 
              activeTab={view} 
              setActiveTab={(v) => setView(v as 'timeline' | 'list' | 'quarterly')} 
              isRoadmap={true} 
            />
            <TeamViewToggle isTeamView={isTeamView} onToggle={toggleTeamView} />
          </div>
          
          <RoadmapStats 
            totalTime={totals.time}
            totalFTE={totals.fte}
            roleAllocations={getAllRoleAllocations}
          />
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6">
              <SelectionPanel 
                availableUseCases={availableUseCases}
                selectedUseCases={selectedUseCases}
                addUseCaseToRoadmap={addUseCaseToRoadmap}
                collapsed={sidebarCollapsed}
              />
              
              <RoadmapContent 
                view={view}
                roadmapItems={roadmapItems}
                updateEstimatedTime={updateEstimatedTime}
                updateEstimatedFTE={updateEstimatedFTE}
                updateRoleAllocations={updateRoleAllocations}
                removeUseCaseFromRoadmap={removeUseCaseFromRoadmap}
              />
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
