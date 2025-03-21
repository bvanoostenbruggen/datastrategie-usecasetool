
import { useState, useEffect } from 'react';
import { UseCase, UseCaseFormData, ImpactLevel, EaseLevel, StatusType, ScoreLevel, RoleAllocation } from '@/types/types';
import { Button } from '@/components/ui/button';
import { useUseCases } from '@/hooks/useUseCases';
import { ScorePanel } from './ScorePanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicInfoTab } from './form/BasicInfoTab';
import { DetailsTab } from './form/DetailsTab';
import { FormActions } from './form/FormActions';
import { SimilarUseCaseSuggestions } from './SimilarUseCaseSuggestions';
import { useTeam } from '@/contexts/TeamContext';

interface UseCaseFormProps {
  initialData?: UseCase;
  onComplete: () => void;
  isEditing?: boolean;
}

export const UseCaseForm = ({ initialData, onComplete, isEditing = false }: UseCaseFormProps) => {
  const { addUseCase, updateUseCase, useCases } = useUseCases();
  const { currentTeam } = useTeam();
  
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
    // New field for role-based FTE allocation
    roleAllocations: initialData?.roleAllocations || [],
    // Team information
    teamId: initialData?.teamId || currentTeam?.id,
    teamName: initialData?.teamName || currentTeam?.name
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
      const impactValue = value as ImpactLevel;
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
      const easeValue = value as EaseLevel;
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
      const impact: ImpactLevel = value >= 4 ? 'high' : value >= 2 ? 'medium' : 'low';
      setFormData((prev) => ({
        ...prev,
        impact,
        scores: {
          ...prev.scores!,
          [parameter]: value
        }
      }));
    } else if (parameter === 'easeOfImplementation') {
      const ease: EaseLevel = value >= 4 ? 'high' : value >= 2 ? 'medium' : 'low';
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
    
    // Ensure teamId and teamName are set
    const finalFormData = {
      ...formData,
      teamId: formData.teamId || currentTeam?.id,
      teamName: formData.teamName || currentTeam?.name
    };
    
    if (isEditing && initialData) {
      updateUseCase(initialData.id, finalFormData);
    } else {
      addUseCase(finalFormData);
    }
    
    onComplete();
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

  // Get a filtered list of use cases for suggestions (exclude current one if editing)
  const getSuggestionsUseCases = () => {
    return isEditing && initialData
      ? useCases.filter(uc => uc.id !== initialData.id)
      : useCases;
  };

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
      <div className="md:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="data-[state=active]:bg-pink data-[state=active]:text-black">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="scoring" className="data-[state=active]:bg-purple data-[state=active]:text-black">
                Parameter Scoring
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-pink data-[state=active]:text-black">
                Additional Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <BasicInfoTab
                formData={formData}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                teamInput={teamInput}
                setTeamInput={setTeamInput}
                addTeam={addTeam}
                removeTeam={removeTeam}
                techInput={techInput}
                setTechInput={setTechInput}
                addTechnology={addTechnology}
                removeTechnology={removeTechnology}
              />
              
              {currentTeam && (
                <div className="text-sm text-muted-foreground mt-4">
                  This use case will be submitted by: <span className="font-medium">{currentTeam.name}</span>
                </div>
              )}
            </TabsContent>

            <TabsContent value="scoring" className="mt-4">
              <ScorePanel 
                scores={formData.scores!}
                onChange={handleScoreChange}
              />
            </TabsContent>

            <TabsContent value="details">
              <DetailsTab 
                formData={formData}
                handleInputChange={handleInputChange}
                updateRoleAllocations={updateRoleAllocations}
              />
            </TabsContent>
          </Tabs>

          <FormActions onCancel={onComplete} isEditing={isEditing} />
        </form>
      </div>
      
      {/* Similar Use Case Suggestions */}
      {showSuggestions && (
        <div className="md:col-span-1">
          <SimilarUseCaseSuggestions
            useCases={getSuggestionsUseCases()}
            currentTitle={formData.title}
            currentDescription={formData.description}
            currentTeam={formData.team}
            currentTech={formData.technologies}
            onSelect={handleSuggestionSelect}
          />
        </div>
      )}
    </div>
  );
};
