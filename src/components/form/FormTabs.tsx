
import React from 'react';
import { UseCaseFormData, RoleAllocation, ScoreLevel } from '@/types/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicInfoTab } from './BasicInfoTab';
import { ScoringTab } from './ScoringTab';
import { DetailsTab } from './DetailsTab';

interface FormTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  formData: UseCaseFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, field: string) => void;
  handleScoreChange: (parameter: string, value: ScoreLevel) => void;
  updateRoleAllocations: (roleAllocations: RoleAllocation[]) => void;
  teamInput: string;
  setTeamInput: (value: string) => void;
  addTeam: () => void;
  removeTeam: (team: string) => void;
  techInput: string;
  setTechInput: (value: string) => void;
  addTechnology: () => void;
  removeTechnology: (tech: string) => void;
}

export const FormTabs = ({
  activeTab,
  setActiveTab,
  formData,
  handleInputChange,
  handleSelectChange,
  handleScoreChange,
  updateRoleAllocations,
  teamInput,
  setTeamInput,
  addTeam,
  removeTeam,
  techInput,
  setTechInput,
  addTechnology,
  removeTechnology
}: FormTabsProps) => {
  return (
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
      </TabsContent>

      <TabsContent value="scoring" className="mt-4">
        <ScoringTab scores={formData.scores!} onChange={handleScoreChange} />
      </TabsContent>

      <TabsContent value="details">
        <DetailsTab 
          formData={formData}
          handleInputChange={handleInputChange}
          updateRoleAllocations={updateRoleAllocations}
        />
      </TabsContent>
    </Tabs>
  );
};
