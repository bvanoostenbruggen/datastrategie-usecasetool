
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Challenge, ChallengeFormData, CHALLENGE_CATEGORIES, CHALLENGE_PLACEHOLDERS, ChallengeScores } from '@/types/challenge';
import { getRandomItem } from '@/lib/utils';
import { ChallengeScoring } from './ChallengeScoring';
import { useTeam } from '@/contexts/TeamContext';

interface ChallengeFormProps {
  onSubmit: (data: ChallengeFormData) => void;
  initialData?: Challenge;
  isEditing?: boolean;
  onCancel?: () => void;
}

export const ChallengeForm = ({ onSubmit, initialData, isEditing = false, onCancel }: ChallengeFormProps) => {
  const { currentTeam } = useTeam();
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<string | undefined>(initialData?.category);
  const [scores, setScores] = useState<ChallengeScores>(initialData?.scores || {
    impact: 3,
    feasibility: 3,
    priority: 3
  });
  const [placeholder, setPlaceholder] = useState(getRandomItem(CHALLENGE_PLACEHOLDERS));

  // Rotate placeholders every few seconds if not editing
  useEffect(() => {
    if (!isEditing && title === '') {
      const interval = setInterval(() => {
        setPlaceholder(getRandomItem(CHALLENGE_PLACEHOLDERS));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isEditing, title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    onSubmit({
      title: title.trim(),
      category: category as any,
      status: initialData?.status || 'backlog',
      scores: scores,
      teamId: initialData?.teamId || currentTeam?.id,
      teamName: initialData?.teamName || currentTeam?.name
    });
    
    if (!isEditing) {
      setTitle('');
      setCategory(undefined);
      setScores({
        impact: 3,
        feasibility: 3,
        priority: 3
      });
    }
  };

  const handleScoreChange = (newScores: ChallengeScores) => {
    setScores(newScores);
  };

  return (
    <Card className={`p-6 ${!isEditing ? 'bg-black/30 border-muted' : ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="challenge">
            {isEditing ? "Edit Challenge" : "Add a new challenge"}
          </Label>
          <Input
            id="challenge"
            placeholder={placeholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CHALLENGE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Challenge Scoring</Label>
            <ChallengeScoring 
              scores={scores} 
              onChange={handleScoreChange} 
            />
          </div>
        </div>

        {currentTeam && (
          <div className="text-sm text-muted-foreground pt-1">
            This challenge will be submitted by: <span className="font-medium">{currentTeam.name}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          {isEditing && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {isEditing ? "Save Changes" : "Add Challenge"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
