
import { UseCase, RoadmapPhase, RoleAllocation } from '@/types/types';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TimelineView } from './TimelineView';
import { QuarterlyView } from './QuarterlyView';
import { ListView } from './ListView';
import { Clock, Calendar, LayoutPanelTop } from 'lucide-react';

interface RoadmapContentProps {
  view: 'timeline' | 'list' | 'quarterly';
  roadmapItems: (UseCase & { phase: RoadmapPhase })[];
  updateEstimatedTime: (id: string, weeks: number) => void;
  updateEstimatedFTE: (id: string, fte: number) => void;
  updateRoleAllocations: (id: string, roleAllocations: RoleAllocation[]) => void;
  removeUseCaseFromRoadmap: (id: string) => void;
}

export const RoadmapContent = ({ 
  view, 
  roadmapItems, 
  updateEstimatedTime, 
  updateEstimatedFTE,
  updateRoleAllocations,
  removeUseCaseFromRoadmap
}: RoadmapContentProps) => {
  const timelinePhases = [
    { id: 'short-term' as RoadmapPhase, label: 'Short-Term (1-3 months)', icon: <Clock className="h-4 w-4" /> },
    { id: 'mid-term' as RoadmapPhase, label: 'Mid-Term (3-6 months)', icon: <Calendar className="h-4 w-4" /> },
    { id: 'long-term' as RoadmapPhase, label: 'Long-Term (6+ months)', icon: <LayoutPanelTop className="h-4 w-4" /> },
  ];

  const quarterlyPhases = [
    { id: 'quarterly-q1' as RoadmapPhase, label: 'Q1', icon: <span className="text-xs font-bold mr-1">Q1</span> },
    { id: 'quarterly-q2' as RoadmapPhase, label: 'Q2', icon: <span className="text-xs font-bold mr-1">Q2</span> },
    { id: 'quarterly-q3' as RoadmapPhase, label: 'Q3', icon: <span className="text-xs font-bold mr-1">Q3</span> },
    { id: 'quarterly-q4' as RoadmapPhase, label: 'Q4', icon: <span className="text-xs font-bold mr-1">Q4</span> },
  ];

  const phases = view === 'quarterly' ? quarterlyPhases : timelinePhases;
  
  return (
    <div id="roadmap-content" className="flex-1">
      <Tabs value={view} className="flex-1">
        <TabsContent value="timeline" className="mt-0">
          <TimelineView 
            roadmapItems={roadmapItems} 
            updateEstimatedTime={updateEstimatedTime} 
            updateEstimatedFTE={updateEstimatedFTE}
            updateRoleAllocations={updateRoleAllocations}
            removeUseCaseFromRoadmap={removeUseCaseFromRoadmap}
          />
        </TabsContent>
        
        <TabsContent value="quarterly" className="mt-0">
          <QuarterlyView 
            roadmapItems={roadmapItems} 
            updateEstimatedTime={updateEstimatedTime} 
            updateEstimatedFTE={updateEstimatedFTE}
            updateRoleAllocations={updateRoleAllocations}
            removeUseCaseFromRoadmap={removeUseCaseFromRoadmap}
          />
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <ListView 
            roadmapItems={roadmapItems} 
            updateEstimatedTime={updateEstimatedTime} 
            updateEstimatedFTE={updateEstimatedFTE}
            updateRoleAllocations={updateRoleAllocations}
            phases={phases}
            removeUseCaseFromRoadmap={removeUseCaseFromRoadmap}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
