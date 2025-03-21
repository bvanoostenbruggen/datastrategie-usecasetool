
import { useState, useEffect, useMemo } from 'react';
import { UseCase, RoadmapPhase, RoleAllocation } from '@/types/types';
import { toast } from '@/components/ui/use-toast';
import { timelinePhases, quarterlyPhases } from '@/components/roadmap/roadmapConstants';

interface RoadmapItem extends UseCase {
  phase: RoadmapPhase;
}

export const useRoadmapState = (
  useCases: UseCase[],
  view: 'timeline' | 'list' | 'quarterly',
  updateUseCase: (id: string, data: Partial<UseCase>) => void
) => {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);

  // Initialize roadmap with use cases
  useEffect(() => {
    if (useCases.length) {
      const initialSelected = useCases
        .filter(useCase => useCase.inRoadmap)
        .map(useCase => useCase.id);
      
      if (initialSelected.length > 0) {
        setSelectedUseCases(initialSelected);
      } else {
        const topCases = [...useCases]
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(useCase => useCase.id);
        
        setSelectedUseCases(topCases);
      }
    }
  }, [useCases]);
  
  // Update roadmap items when selected use cases change
  useEffect(() => {
    const selectedItems = useCases
      .filter(useCase => selectedUseCases.includes(useCase.id))
      .map(useCase => {
        let phase: RoadmapPhase = useCase.roadmapPhase || 'short-term';
        
        if (!useCase.roadmapPhase) {
          const sortedCases = [...selectedUseCases].sort((a, b) => {
            const caseA = useCases.find(uc => uc.id === a);
            const caseB = useCases.find(uc => uc.id === b);
            return (caseB?.score || 0) - (caseA?.score || 0);
          });
          
          const index = sortedCases.indexOf(useCase.id);
          const percentile = index / sortedCases.length;
          
          if (view === 'quarterly') {
            if (percentile < 0.25) phase = 'quarterly-q1';
            else if (percentile < 0.5) phase = 'quarterly-q2';
            else if (percentile < 0.75) phase = 'quarterly-q3';
            else phase = 'quarterly-q4';
          } else {
            if (percentile < 0.33) phase = 'short-term';
            else if (percentile < 0.66) phase = 'mid-term';
            else phase = 'long-term';
          }
        }
        
        let timeEstimate = useCase.estimatedTimeInWeeks;
        if (timeEstimate === undefined) {
          const timeMatch = useCase.estimatedTime.match(/(\d+)/);
          timeEstimate = timeMatch ? parseInt(timeMatch[0]) * 4 : 4;
        }
        
        let fteEstimate = useCase.estimatedFTE;
        if (fteEstimate === undefined) {
          const resourcesMatch = useCase.estimatedResources.match(/(\d+)/);
          fteEstimate = resourcesMatch ? parseInt(resourcesMatch[0]) : 1;
        }
        
        return {
          ...useCase,
          phase,
          estimatedTimeInWeeks: timeEstimate,
          estimatedFTE: fteEstimate
        } as RoadmapItem;
      });
    
    setRoadmapItems(selectedItems);
    
    useCases.forEach(useCase => {
      const inRoadmap = selectedUseCases.includes(useCase.id);
      if (useCase.inRoadmap !== inRoadmap) {
        updateUseCase(useCase.id, { 
          inRoadmap
        });
      }
    });
  }, [selectedUseCases, useCases, view, updateUseCase]);

  // Function to add use case to roadmap
  const addUseCaseToRoadmap = (id: string) => {
    setSelectedUseCases(prev => [...prev, id]);
    toast({
      title: "Use Case Added",
      description: "The use case has been added to the roadmap.",
    });
  };
  
  // Function to remove use case from roadmap
  const removeUseCaseFromRoadmap = (id: string) => {
    setSelectedUseCases(prev => prev.filter(caseId => caseId !== id));
    toast({
      title: "Use Case Removed",
      description: "The use case has been removed from the roadmap.",
    });
  };
  
  // Function to update estimated time
  const updateEstimatedTime = (id: string, weeks: number) => {
    updateUseCase(id, { estimatedTimeInWeeks: weeks });
    const updatedItems = roadmapItems.map(item => {
      if (item.id === id) {
        return { ...item, estimatedTimeInWeeks: weeks };
      }
      return item;
    });
    setRoadmapItems(updatedItems);
  };
  
  // Function to update estimated FTE
  const updateEstimatedFTE = (id: string, fte: number) => {
    updateUseCase(id, { estimatedFTE: fte });
    const updatedItems = roadmapItems.map(item => {
      if (item.id === id) {
        return { ...item, estimatedFTE: fte };
      }
      return item;
    });
    setRoadmapItems(updatedItems);
  };

  // Function to update role allocations
  const updateRoleAllocations = (id: string, roleAllocations: RoleAllocation[]) => {
    updateUseCase(id, { roleAllocations });
    const updatedItems = roadmapItems.map(item => {
      if (item.id === id) {
        return { ...item, roleAllocations };
      }
      return item;
    });
    setRoadmapItems(updatedItems);
  };

  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    const phases = view === 'quarterly' ? quarterlyPhases : timelinePhases;
    
    if (source.droppableId === 'available' && destination.droppableId !== 'available') {
      const availableUseCases = useCases.filter(useCase => !selectedUseCases.includes(useCase.id));
      const movedId = availableUseCases[source.index].id;
      addUseCaseToRoadmap(movedId);
      return;
    }
    
    if (source.droppableId !== 'available' && destination.droppableId === 'available') {
      const phase = source.droppableId as RoadmapPhase;
      const phaseItems = roadmapItems.filter(item => item.phase === phase);
      const movedId = phaseItems[source.index].id;
      removeUseCaseFromRoadmap(movedId);
      return;
    }
    
    if (source.droppableId !== destination.droppableId) {
      const sourcePhase = source.droppableId as RoadmapPhase;
      const destPhase = destination.droppableId as RoadmapPhase;
      
      const sourceItems = roadmapItems.filter(item => item.phase === sourcePhase);
      const destItems = roadmapItems.filter(item => item.phase === destPhase);
      const otherItems = roadmapItems.filter(
        item => item.phase !== sourcePhase && item.phase !== destPhase
      );
      
      const [movedItem] = sourceItems.splice(source.index, 1);
      movedItem.phase = destPhase;
      destItems.splice(destination.index, 0, movedItem);
      
      const newRoadmapItems = [
        ...otherItems,
        ...sourceItems,
        ...destItems
      ];
      
      setRoadmapItems(newRoadmapItems);
      
      updateUseCase(movedItem.id, { 
        roadmapPhase: destPhase
      });
      
      toast({
        title: "Use Case Moved",
        description: `"${movedItem.title}" moved to ${view === 'quarterly' 
          ? quarterlyPhases.find(p => p.id === destPhase)?.label 
          : timelinePhases.find(p => p.id === destPhase)?.label}`,
      });
    } else {
      const phase = source.droppableId as RoadmapPhase;
      const phaseItems = roadmapItems.filter(item => item.phase === phase);
      const otherItems = roadmapItems.filter(item => item.phase !== phase);
      
      const [movedItem] = phaseItems.splice(source.index, 1);
      phaseItems.splice(destination.index, 0, movedItem);
      
      setRoadmapItems([...otherItems, ...phaseItems]);
      
      phaseItems.forEach((item, index) => {
        updateUseCase(item.id, { 
          roadmapOrder: index
        });
      });
    }
  };
  
  // Get all role allocations from all roadmap items
  const getAllRoleAllocations = useMemo(() => {
    return roadmapItems.flatMap(item => item.roleAllocations || []);
  }, [roadmapItems]);

  // Calculate totals
  const totals = useMemo(() => {
    return roadmapItems.reduce((acc, item) => {
      return {
        time: acc.time + (item.estimatedTimeInWeeks || 0),
        fte: acc.fte + (item.estimatedFTE || 0)
      };
    }, { time: 0, fte: 0 });
  }, [roadmapItems]);

  return {
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
  };
};
