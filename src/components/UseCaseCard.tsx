
import React, { useState } from 'react';
import { UseCase } from '@/types/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { UseCaseForm } from './UseCaseForm';
import { ScoreRadarChart } from './ScoreRadarChart';
import { StatusBadge } from './StatusBadge';
import { Edit2, Trash2, Tag, Users, Briefcase } from 'lucide-react';
import { useTeam } from '@/contexts/TeamContext';
import { Table, TableBody, TableCell, TableRow } from './ui/table';

interface UseCaseCardProps {
  useCase: UseCase;
  onEdit: (id: string, data: Partial<UseCase>) => void;
  onDelete: (id: string) => void;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { isTeamView } = useTeam();

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg line-clamp-2">
            {useCase.title}
          </CardTitle>
          <div className="flex flex-wrap gap-1">
            <StatusBadge status={useCase.status} size="sm" />
            {!isTeamView && useCase.teamName && (
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-xs">
                {useCase.teamName}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <div className="line-clamp-3 text-sm text-muted-foreground mb-3">
          {useCase.description}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {useCase.team.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {useCase.team.length > 1 
                ? `${useCase.team[0]} +${useCase.team.length - 1}` 
                : useCase.team[0]}
            </Badge>
          )}
          
          {useCase.technologies.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {useCase.technologies.length > 1 
                ? `${useCase.technologies[0]} +${useCase.technologies.length - 1}` 
                : useCase.technologies[0]}
            </Badge>
          )}
        </div>
        
        <div className="w-full aspect-square max-h-28">
          <ScoreRadarChart useCase={useCase} size="small" />
        </div>
      </CardContent>
      
      <CardFooter className="pt-1 pb-3 flex justify-between">
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs h-8" onClick={toggleDetails}>
              Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="flex items-center justify-between">
                <span>{useCase.title}</span>
                <StatusBadge status={useCase.status} />
              </DialogTitle>
            </DialogHeader>
            
            <div className="p-6 pt-2 space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {useCase.teamName && (
                  <Badge className="bg-primary/20 text-primary">
                    Team: {useCase.teamName}
                  </Badge>
                )}
                {useCase.team.map((t) => (
                  <Badge key={t} variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    {t}
                  </Badge>
                ))}
                {useCase.technologies.map((t) => (
                  <Badge key={t} variant="outline">
                    <Tag className="h-3 w-3 mr-1" />
                    {t}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{useCase.description}</p>
                  
                  <Table className="mt-4">
                    <TableBody>
                      {useCase.businessObjective && (
                        <TableRow>
                          <TableCell className="font-medium">Business Objective</TableCell>
                          <TableCell>{useCase.businessObjective}</TableCell>
                        </TableRow>
                      )}
                      {useCase.expectedOutcome && (
                        <TableRow>
                          <TableCell className="font-medium">Expected Outcome</TableCell>
                          <TableCell>{useCase.expectedOutcome}</TableCell>
                        </TableRow>
                      )}
                      {useCase.successCriteria && (
                        <TableRow>
                          <TableCell className="font-medium">Success Criteria</TableCell>
                          <TableCell>{useCase.successCriteria}</TableCell>
                        </TableRow>
                      )}
                      {useCase.estimatedTime && (
                        <TableRow>
                          <TableCell className="font-medium">Estimated Time</TableCell>
                          <TableCell>{useCase.estimatedTime}</TableCell>
                        </TableRow>
                      )}
                      {useCase.estimatedResources && (
                        <TableRow>
                          <TableCell className="font-medium">Estimated Resources</TableCell>
                          <TableCell>{useCase.estimatedResources}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Parameter Scores</h3>
                  <div className="w-full max-w-[300px] mx-auto">
                    <ScoreRadarChart useCase={useCase} size="medium" />
                  </div>
                  
                  {useCase.roleAllocations && useCase.roleAllocations.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Team Allocation</h3>
                      <Table>
                        <TableBody>
                          {useCase.roleAllocations.map((allocation, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{allocation.role}</TableCell>
                              <TableCell>{allocation.fte} FTE</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button variant="default" onClick={() => {
                  setShowDetails(false);
                  setIsEditing(true);
                }}>
                  Edit Use Case
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-8"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive text-xs h-8"
            onClick={() => onDelete(useCase.id)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[700px] p-0 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Edit Use Case</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            <UseCaseForm 
              initialData={useCase} 
              onComplete={handleEditComplete} 
              isEditing
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UseCaseCard;
