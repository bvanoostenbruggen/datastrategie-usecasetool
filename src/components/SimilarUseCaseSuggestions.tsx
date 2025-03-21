
import { UseCase } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LightbulbIcon } from 'lucide-react';

interface SimilarUseCaseSuggestionsProps {
  useCases: UseCase[];
  currentTitle: string;
  currentDescription: string;
  currentTeam: string[];
  currentTech: string[];
  onSelect: (useCase: UseCase) => void;
}

export const SimilarUseCaseSuggestions = ({ 
  useCases, 
  currentTitle,
  currentDescription,
  currentTeam,
  currentTech,
  onSelect
}: SimilarUseCaseSuggestionsProps) => {
  // Simple similarity algorithm that checks for matching keywords and teams
  const getSimilarUseCases = (): UseCase[] => {
    if (!currentTitle && !currentDescription && currentTeam.length === 0 && currentTech.length === 0) {
      return [];
    }

    // Extract keywords from title and description
    const keywords = [
      ...currentTitle.toLowerCase().split(/\s+/),
      ...currentDescription.toLowerCase().split(/\s+/)
    ]
    .filter(word => word.length > 3) // Filter out short words
    .filter(word => !['with', 'that', 'this', 'from', 'have', 'based', 'using'].includes(word)); // Filter common words

    return useCases
      .map(useCase => {
        let score = 0;
        
        // Check team overlap
        const teamOverlap = currentTeam.filter(team => 
          useCase.team.includes(team)
        ).length;
        score += teamOverlap * 10; // Team matches are weighted heavily
        
        // Check technology overlap
        const techOverlap = currentTech.filter(tech => 
          useCase.technologies.includes(tech)
        ).length;
        score += techOverlap * 8; // Tech matches are weighted heavily
        
        // Check keyword matches in title and description
        const useCaseText = `${useCase.title} ${useCase.description}`.toLowerCase();
        for (const keyword of keywords) {
          if (useCaseText.includes(keyword)) {
            score += 5;
          }
        }
        
        return { useCase, score };
      })
      .filter(item => item.score > 0) // Only keep items with some similarity
      .sort((a, b) => b.score - a.score) // Sort by similarity score
      .slice(0, 3) // Take top 3
      .map(item => item.useCase);
  };

  const similarUseCases = getSimilarUseCases();

  if (similarUseCases.length === 0) {
    return null;
  }

  return (
    <Card className="bg-black/40 border-purple/30 shadow-sm animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <LightbulbIcon className="h-4 w-4 mr-2 text-yellow-400" />
          Similar Use Cases Found
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-3">
          We found similar use cases in your library. Select one to pre-fill the form or continue with a new one.
        </p>
        <div className="space-y-3">
          {similarUseCases.map((useCase) => (
            <div 
              key={useCase.id} 
              className="p-3 rounded-md border border-muted bg-black/30 hover:bg-black/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">{useCase.title}</h4>
                <Badge variant="outline" className="text-xs">
                  Score: {useCase.score.toFixed(1)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {useCase.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {useCase.team.map((team, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {team}
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => onSelect(useCase)}
              >
                Use as Template
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
