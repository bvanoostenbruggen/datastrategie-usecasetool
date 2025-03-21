
import { UseCase, UseCaseFormData, StatusType } from '@/types/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TagInput } from './TagInput';
import { Badge } from '@/components/ui/badge';

interface BasicInfoTabProps {
  formData: UseCaseFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, field: string) => void;
  teamInput: string;
  setTeamInput: (value: string) => void;
  addTeam: () => void;
  removeTeam: (team: string) => void;
  techInput: string;
  setTechInput: (value: string) => void;
  addTechnology: () => void;
  removeTechnology: (tech: string) => void;
}

export const BasicInfoTab = ({
  formData,
  handleInputChange,
  handleSelectChange,
  teamInput,
  setTeamInput,
  addTeam,
  removeTeam,
  techInput,
  setTechInput,
  addTechnology,
  removeTechnology,
}: BasicInfoTabProps) => {
  return (
    <div className="space-y-6 mt-6">
      <div>
        <Label htmlFor="title" className="text-base">Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="E.g., Customer Segmentation Analysis"
          required
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-base">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Brief overview of the use case"
          required
          className="mt-1.5 min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="status" className="text-base">Status *</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange(value as StatusType, 'status')}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="backlog">Backlog</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TagInput 
        label="Team"
        tags={formData.team}
        tagInput={teamInput}
        setTagInput={setTeamInput}
        addTag={addTeam}
        removeTag={removeTeam}
        placeholder="Add team members or departments"
      />

      <TagInput 
        label="Technologies"
        tags={formData.technologies}
        tagInput={techInput}
        setTagInput={setTechInput}
        addTag={addTechnology}
        removeTag={removeTechnology}
        placeholder="Add technologies or techniques"
      />
      
      {formData.teamName && (
        <div className="space-y-2">
          <Label className="text-base">Submitted By</Label>
          <div>
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
              {formData.teamName}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};
