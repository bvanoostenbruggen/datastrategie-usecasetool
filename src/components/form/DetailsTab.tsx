
import React from 'react';
import { UseCaseFormData, RoleAllocation } from '@/types/types';
import { FormTextField } from './FormTextFields';
import { FormEstimateFields } from './FormTextFields';
import { RoleAllocations } from './RoleAllocations';

interface DetailsTabProps {
  formData: UseCaseFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateRoleAllocations?: (roleAllocations: RoleAllocation[]) => void;
}

export const DetailsTab = ({ 
  formData, 
  handleInputChange,
  updateRoleAllocations
}: DetailsTabProps) => {
  const roleAllocations = formData.roleAllocations || [];

  return (
    <div className="space-y-4">
      <FormTextField
        id="businessObjective"
        name="businessObjective"
        label="Business Objective"
        value={formData.businessObjective}
        onChange={handleInputChange}
        placeholder="What business goal does this use case support?"
        isTextarea={true}
      />

      <FormTextField
        id="expectedOutcome"
        name="expectedOutcome"
        label="Expected Outcome"
        value={formData.expectedOutcome}
        onChange={handleInputChange}
        placeholder="What results do you expect from this use case?"
        isTextarea={true}
      />

      <FormTextField
        id="successCriteria"
        name="successCriteria"
        label="Success Criteria"
        value={formData.successCriteria}
        onChange={handleInputChange}
        placeholder="How will you measure success?"
        isTextarea={true}
      />

      <FormEstimateFields
        estimatedTime={formData.estimatedTime}
        estimatedResources={formData.estimatedResources}
        handleInputChange={handleInputChange}
      />

      {updateRoleAllocations && (
        <RoleAllocations
          roleAllocations={roleAllocations}
          updateRoleAllocations={updateRoleAllocations}
        />
      )}
    </div>
  );
};
