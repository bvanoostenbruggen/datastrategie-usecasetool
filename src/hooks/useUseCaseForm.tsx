
import { useState, useEffect } from 'react';
import { UseCase, UseCaseFormData, RoleAllocation, ScoreLevel } from '@/types/types';
import { useUseCases } from '@/hooks/useUseCases';

export const useUseCaseForm = (initialData?: UseCase, onComplete?: () => void, isEditing = false) => {
  const { addUseCase, updateUseCase, useCases } = useUseCases();
  
  // Create default scores if not provided
  const defaultScores = {
    impact: initialData?.scores?.impact || 3,
    easeOfImplementation: initialData?.scores?.easeOfImplementation || 3,
    dataAvailability: initialData?.scores?.dataAvailability || 3,
    businessValue: initialData?.scores?.businessValue || 3,
    technicalFeasibility: initialData?.scores?.technicalFeasibility || 3,
    maintainability: initialData?.scores?.maintainability || 3,
    ethicalConsiderations: initialData?.scores?.ethicalConsiderations || 3
  };
  
  const [formData, setFormData] = useState<UseCaseFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    impact: initialData?.impact || 'medium',
    ease: initialData?.ease || 'medium',
    scores: defaultScores,
    team: initialData?.team || [],
    technologies: initialData?.technologies || [],
    businessObjective: initialData?.businessObjective || '',
    expectedOutcome: initialData?.expectedOutcome || '',
    successCriteria: initialData?.successCriteria || '',
    estimatedTime: initialData?.estimatedTime || '',
    estimatedResources: initialData?.estimatedResources || '',
    status: initialData?.status || 'backlog',
    roleAllocations: initialData?.roleAllocations || [],
  });

  // For multi-select fields (team, technologies)
  const [teamInput, setTeamInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [showSuggestions, setShowSuggestions] = useState(!isEditing);

  // Hide suggestions when editing or when form fields have significant data
  useEffect(() => {
    if (isEditing) {
      setShowSuggestions(false);
      return;
    }
    
    // Show suggestions only when there's some data to base them on
    const hasRelevantData = 
      formData.title.length > 3 || 
      formData.description.length > 10 || 
      formData.team.length > 0 || 
      formData.technologies.length > 0;
      
    setShowSuggestions(hasRelevantData);
  }, [formData.title, formData.description, formData.team, formData.technologies, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    // For legacy impact/ease fields, also update the corresponding score
    if (field === 'impact') {
      // Ensure value is a valid ImpactLevel
      const impactValue = value as any;
      const impactScore = impactValue === 'high' ? 5 : impactValue === 'medium' ? 3 : 1;
      setFormData((prev) => ({
        ...prev,
        [field]: impactValue,
        scores: {
          ...prev.scores!,
          impact: impactScore as ScoreLevel
        }
      }));
    } else if (field === 'ease') {
      // Ensure value is a valid EaseLevel
      const easeValue = value as any;
      const easeScore = easeValue === 'high' ? 5 : easeValue === 'medium' ? 3 : 1;
      setFormData((prev) => ({
        ...prev,
        [field]: easeValue,
        scores: {
          ...prev.scores!,
          easeOfImplementation: easeScore as ScoreLevel
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleScoreChange = (parameter: string, value: ScoreLevel) => {
    // When changing scores, also update the legacy fields for backward compatibility
    if (parameter === 'impact') {
      const impact = value >= 4 ? 'high' : value >= 2 ? 'medium' : 'low';
      setFormData((prev) => ({
        ...prev,
        impact,
        scores: {
          ...prev.scores!,
          [parameter]: value
        }
      }));
    } else if (parameter === 'easeOfImplementation') {
      const ease = value >= 4 ? 'high' : value >= 2 ? 'medium' : 'low';
      setFormData((prev) => ({
        ...prev,
        ease,
        scores: {
          ...prev.scores!,
          [parameter]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        scores: {
          ...prev.scores!,
          [parameter]: value
        }
      }));
    }
  };

  const updateRoleAllocations = (roleAllocations: RoleAllocation[]) => {
    setFormData((prev) => ({
      ...prev,
      roleAllocations
    }));
  };

  const addTeam = () => {
    if (teamInput.trim() && !formData.team.includes(teamInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        team: [...prev.team, teamInput.trim()],
      }));
      setTeamInput('');
    }
  };

  const removeTeam = (team: string) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.filter((t) => t !== team),
    }));
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && initialData) {
      updateUseCase(initialData.id, formData);
    } else {
      addUseCase(formData);
    }
    
    if (onComplete) onComplete();
  };

  const handleSuggestionSelect = (useCase: UseCase) => {
    // Use the selected use case as a template
    setFormData({
      title: useCase.title + " (Copy)",
      description: useCase.description,
      impact: useCase.impact,
      ease: useCase.ease,
      scores: { ...useCase.scores },
      team: [...useCase.team],
      technologies: [...useCase.technologies],
      businessObjective: useCase.businessObjective,
      expectedOutcome: useCase.expectedOutcome,
      successCriteria: useCase.successCriteria,
      estimatedTime: useCase.estimatedTime,
      estimatedResources: useCase.estimatedResources,
      roleAllocations: useCase.roleAllocations ? [...useCase.roleAllocations] : [],
      status: 'backlog', // Always start as backlog
    });
    
    // Hide suggestions after selection
    setShowSuggestions(false);
  };

  return {
    formData,
    teamInput,
    setTeamInput,
    techInput,
    setTechInput,
    activeTab,
    setActiveTab,
    showSuggestions,
    handleInputChange,
    handleSelectChange,
    handleScoreChange,
    updateRoleAllocations,
    addTeam,
    removeTeam,
    addTechnology,
    removeTechnology,
    handleSubmit,
    handleSuggestionSelect,
    useCases
  };
};
