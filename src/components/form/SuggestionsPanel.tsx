
import React from 'react';
import { UseCase } from '@/types/types';
import { SimilarUseCaseSuggestions } from '@/components/SimilarUseCaseSuggestions';

interface SuggestionsPanelProps {
  showSuggestions: boolean;
  useCases: UseCase[];
  initialData?: UseCase;
  currentTitle: string;
  currentDescription: string;
  currentTeam: string[];
  currentTech: string[];
  onSelect: (useCase: UseCase) => void;
}

export const SuggestionsPanel = ({
  showSuggestions,
  useCases,
  initialData,
  currentTitle,
  currentDescription,
  currentTeam,
  currentTech,
  onSelect
}: SuggestionsPanelProps) => {
  // Get a filtered list of use cases for suggestions (exclude current one if editing)
  const getSuggestionsUseCases = () => {
    return initialData
      ? useCases.filter(uc => uc.id !== initialData.id)
      : useCases;
  };

  if (!showSuggestions) return null;

  return (
    <div className="md:col-span-1">
      <SimilarUseCaseSuggestions
        useCases={getSuggestionsUseCases()}
        currentTitle={currentTitle}
        currentDescription={currentDescription}
        currentTeam={currentTeam}
        currentTech={currentTech}
        onSelect={onSelect}
      />
    </div>
  );
};
