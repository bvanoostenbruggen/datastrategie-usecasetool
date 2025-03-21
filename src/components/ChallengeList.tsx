
import React, { useState } from 'react';
import { Challenge } from '@/types/challenge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, CheckCircle, Circle, Tag } from 'lucide-react';
import { ChallengeForm } from './ChallengeForm';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { StatusBadge } from './StatusBadge';
import { useTeam } from '@/contexts/TeamContext';

interface ChallengeListProps {
  challenges: Challenge[];
  selectedChallenges: string[];
  onEdit: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  onToggleSelection: (id: string) => void;
}

export const ChallengeList: React.FC<ChallengeListProps> = ({ 
  challenges,
  selectedChallenges,
  onEdit,
  onDelete,
  onToggleSelection
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const { isTeamView } = useTeam();

  if (challenges.length === 0) {
    return (
      <Card className="border-dashed bg-black/20">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No challenges yet. Add your first challenge above.</p>
        </CardContent>
      </Card>
    );
  }

  // Sort challenges: selected first, then by creation date (most recent first)
  const sortedChallenges = [...challenges].sort((a, b) => {
    // First sort by selection status
    if (a.selected && !b.selected) return -1;
    if (!a.selected && b.selected) return 1;
    
    // Then by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="grid grid-cols-1 gap-4">
      {sortedChallenges.map((challenge) => (
        <Card 
          key={challenge.id}
          className={`relative transition-colors ${challenge.selected ? 'border-l-4 border-l-primary' : ''}`}
        >
          {editingId === challenge.id ? (
            <ChallengeForm 
              onSubmit={(data) => {
                onEdit(challenge.id, data);
                setEditingId(null);
              }}
              initialData={challenge}
              isEditing
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg line-clamp-2">
                    <Toggle
                      pressed={challenge.selected}
                      onPressedChange={() => onToggleSelection(challenge.id)}
                      className="p-0 h-auto data-[state=on]:text-primary"
                      variant="default"
                      size="sm"
                    >
                      {challenge.selected ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </Toggle>
                    <span>{challenge.title}</span>
                  </CardTitle>
                </div>
                <StatusBadge status={challenge.status} />
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2 items-center text-sm">
                  {challenge.category && (
                    <Badge variant="outline" className="font-normal">
                      <Tag className="h-3 w-3 mr-1" />
                      {challenge.category}
                    </Badge>
                  )}
                  
                  {challenge.scores && (
                    <>
                      <Badge variant="secondary" className="font-normal">
                        Impact: {challenge.scores.impact}/5
                      </Badge>
                      <Badge variant="secondary" className="font-normal">
                        Feasibility: {challenge.scores.feasibility}/5
                      </Badge>
                      <Badge variant="secondary" className="font-normal">
                        Priority: {challenge.scores.priority}/5
                      </Badge>
                    </>
                  )}
                  
                  {!isTeamView && challenge.teamName && (
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30 font-normal">
                      Team: {challenge.teamName}
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-1 pb-3 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2 text-xs"
                  onClick={() => setEditingId(challenge.id)}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="h-8 px-2 text-xs"
                  onClick={() => onDelete(challenge.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      ))}
    </div>
  );
};
