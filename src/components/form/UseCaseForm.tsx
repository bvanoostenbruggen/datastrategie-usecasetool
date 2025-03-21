
import React from 'react';
import { UseCase } from '@/types/types';
import { useUseCaseForm } from '@/hooks/useUseCaseForm';
import { FormTabs } from './FormTabs';
import { FormActions } from './FormActions';
import { SuggestionsPanel } from './SuggestionsPanel';

interface UseCaseFormProps {
  initialData?: UseCase;
  onComplete: () => void;
  isEditing?: boolean;
}

export const UseCaseForm = ({ initialData, onComplete, isEditing = false }: UseCaseFormProps) => {
  const {
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
  } = useUseCaseForm(initialData, onComplete, isEditing);

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
      <div className="md:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleScoreChange={handleScoreChange}
            updateRoleAllocations={updateRoleAllocations}
            teamInput={teamInput}
            setTeamInput={setTeamInput}
            addTeam={addTeam}
            removeTeam={removeTeam}
            techInput={techInput}
            setTechInput={setTechInput}
            addTechnology={addTechnology}
            removeTechnology={removeTechnology}
          />

          <FormActions onCancel={onComplete} isEditing={isEditing} />
        </form>
      </div>
      
      <SuggestionsPanel
        showSuggestions={showSuggestions}
        useCases={useCases}
        initialData={initialData}
        currentTitle={formData.title}
        currentDescription={formData.description}
        currentTeam={formData.team}
        currentTech={formData.technologies}
        onSelect={handleSuggestionSelect}
      />
    </div>
  );
};
