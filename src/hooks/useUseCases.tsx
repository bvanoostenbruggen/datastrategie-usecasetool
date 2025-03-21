
import { useState, useEffect } from 'react';
import { UseCase, UseCaseFormData, ScoreParameter } from '@/types/types';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useParameters } from './useParameters';
import { calculateScore, ensureCompleteScores, mapImpactToScore, mapEaseToScore } from '@/utils/scoreUtils';
import { safelyParseJSON, normalizeDates } from '@/utils/storageUtils';
import { initialUseCases } from '@/data/initialUseCases';
import useProjects from './useProjects';
import { useTeam } from '@/contexts/TeamContext';

export const useUseCases = () => {
  const { parameters, setParameters } = useParameters();
  const { currentProject } = useProjects();
  const { currentTeam, isTeamView } = useTeam();
  
  const [useCases, setUseCases] = useState<UseCase[]>(() => {
    // Check if we have saved use cases in localStorage
    const savedUseCases = localStorage.getItem('useCases');
    if (savedUseCases) {
      try {
        const parsed = safelyParseJSON(savedUseCases, []);
        
        if (!Array.isArray(parsed) || parsed.length === 0) {
          return initialUseCases;
        }
        
        // Ensure all use cases have complete scores and valid dates
        return parsed.map((useCase: UseCase) => {
          const normalizedUseCase = normalizeDates(useCase);
          
          return {
            ...normalizedUseCase,
            scores: ensureCompleteScores(normalizedUseCase.scores, parameters),
            score: normalizedUseCase.score || calculateScore(ensureCompleteScores(normalizedUseCase.scores, parameters), parameters),
            team: Array.isArray(normalizedUseCase.team) ? normalizedUseCase.team : [],
            technologies: Array.isArray(normalizedUseCase.technologies) ? normalizedUseCase.technologies : [],
            projectId: normalizedUseCase.projectId || null
          };
        });
      } catch (e) {
        console.error("Error parsing use cases from localStorage:", e);
        return initialUseCases;
      }
    }
    return initialUseCases;
  });
  
  // Save to localStorage whenever useCases changes
  useEffect(() => {
    try {
      localStorage.setItem('useCases', JSON.stringify(useCases));
    } catch (e) {
      console.error("Error saving use cases to localStorage:", e);
    }
  }, [useCases]);

  // Filter use cases by current project
  const projectFilteredUseCases = useCases.filter(useCase => 
    !currentProject || useCase.projectId === currentProject.id
  );

  // Further filter by team if in team view
  const teamFilteredUseCases = isTeamView && currentTeam
    ? projectFilteredUseCases.filter(useCase => useCase.teamId === currentTeam.id)
    : projectFilteredUseCases;

  // Add a new use case
  const addUseCase = (formData: UseCaseFormData) => {
    // Create default scores if not provided
    const scores = ensureCompleteScores(formData.scores, parameters);
    const score = calculateScore(scores, parameters);
    
    const newUseCase: UseCase = {
      id: uuidv4(),
      ...formData,
      scores,
      score,
      createdAt: new Date(),
      updatedAt: new Date(),
      projectId: currentProject?.id || null,
      teamId: formData.teamId || currentTeam?.id,
      teamName: formData.teamName || currentTeam?.name
    };
    
    setUseCases(prevUseCases => [...prevUseCases, newUseCase]);
    toast({
      title: "Use Case Added",
      description: `"${formData.title}" has been added successfully.`,
    });
    
    return newUseCase;
  };

  // Update an existing use case
  const updateUseCase = (id: string, formData: Partial<UseCaseFormData>) => {
    setUseCases(prevUseCases => {
      return prevUseCases.map(useCase => {
        if (useCase.id === id) {
          // Create a new updatedScores object
          let updatedScores = ensureCompleteScores(useCase.scores, parameters);
          
          // If scores are being explicitly updated, use those
          if (formData.scores) {
            updatedScores = ensureCompleteScores(formData.scores, parameters);
          }
          
          // If legacy impact/ease being updated, update the corresponding score
          if (formData.impact && updatedScores.impact !== undefined) {
            updatedScores.impact = mapImpactToScore(formData.impact);
          }
          
          if (formData.ease && updatedScores.easeOfImplementation !== undefined) {
            updatedScores.easeOfImplementation = mapEaseToScore(formData.ease);
          }
          
          // Calculate new total score
          const score = calculateScore(updatedScores, parameters);
          
          // Create the updated use case object
          const updatedUseCase = {
            ...useCase,
            ...formData,
            scores: updatedScores,
            score,
            updatedAt: new Date(),
          };
          
          return updatedUseCase;
        }
        return useCase;
      });
    });
    
    toast({
      title: "Use Case Updated",
      description: "The use case has been updated successfully.",
    });
  };

  // Update parameters (add, modify, delete, reorder)
  const updateParameters = (newParameters: ScoreParameter[]) => {
    setParameters(newParameters);
    
    // Recalculate scores for all use cases with the updated parameters
    setUseCases(prevUseCases => {
      return prevUseCases.map(useCase => {
        const completeScores = ensureCompleteScores(useCase.scores, newParameters);
        const newScore = calculateScore(completeScores, newParameters);
        return {
          ...useCase,
          scores: completeScores,
          score: newScore,
          updatedAt: new Date()
        };
      });
    });
  };

  // Delete a use case
  const deleteUseCase = (id: string) => {
    setUseCases(prevUseCases => prevUseCases.filter(useCase => useCase.id !== id));
    toast({
      title: "Use Case Deleted",
      description: "The use case has been deleted.",
      variant: "destructive",
    });
  };

  // Get a sorted list of use cases based on score (descending)
  const getSortedUseCases = () => {
    return [...projectFilteredUseCases].sort((a, b) => b.score - a.score);
  };

  // Filter use cases by status
  const filterUseCasesByStatus = (status: string) => {
    if (status === 'all') return projectFilteredUseCases;
    return projectFilteredUseCases.filter(useCase => useCase.status === status);
  };

  // Get a use case by id
  const getUseCaseById = (id: string) => {
    return useCases.find(useCase => useCase.id === id);
  };

  // Check if a use case has high/low relative parameter scores based on preferences
  const getParameterHighlights = (useCase: UseCase) => {
    const highlights: Record<string, 'high' | 'low' | null> = {};
    
    parameters.forEach(param => {
      const score = useCase.scores?.[param.id] || 3;
      
      // Only highlight if there's a preferred direction
      if (param.preferredDirection === 'high' || param.preferredDirection === 'low') {
        // For "higher is better" parameters
        if (param.preferredDirection === 'high') {
          highlights[param.id] = score >= 4 ? 'high' : score <= 2 ? 'low' : null;
        } 
        // For "lower is better" parameters
        else if (param.preferredDirection === 'low') {
          highlights[param.id] = score <= 2 ? 'high' : score >= 4 ? 'low' : null;
        }
      } else {
        highlights[param.id] = null;
      }
    });
    
    return highlights;
  };

  // Add a new function to get only certain fields for the table view
  const getUseCaseColumns = () => {
    // This returns column information useful for the table view, now using parameters
    const columns = [
      { id: 'title', name: 'Title', sortable: true }
    ];
    
    // Add columns based on parameters
    parameters.forEach(param => {
      columns.push({
        id: `scores.${param.id}`,
        name: param.name,
        sortable: true
      });
    });
    
    // Add remaining standard columns
    columns.push(
      { id: 'score', name: 'Score', sortable: true },
      { id: 'status', name: 'Status', sortable: true },
    );
    
    return columns;
  };

  return {
    useCases: teamFilteredUseCases,
    allUseCases: useCases,
    parameters,
    addUseCase,
    updateUseCase,
    updateParameters,
    deleteUseCase,
    getSortedUseCases,
    filterUseCasesByStatus,
    getUseCaseById,
    getUseCaseColumns,
    getParameterHighlights,
  };
};
