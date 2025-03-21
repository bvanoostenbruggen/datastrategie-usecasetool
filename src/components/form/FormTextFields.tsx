
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface FormTextFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  isTextarea?: boolean;
}

export const FormTextField = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  isTextarea = false
}: FormTextFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      {isTextarea ? (
        <Textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="resize-none"
        />
      ) : (
        <Input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export const FormEstimateFields = ({
  estimatedTime,
  estimatedResources,
  handleInputChange
}: {
  estimatedTime: string;
  estimatedResources: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormTextField
        id="estimatedTime"
        name="estimatedTime"
        label="Estimated Time"
        value={estimatedTime}
        onChange={handleInputChange}
        placeholder="e.g., 3 months"
      />
      <FormTextField
        id="estimatedResources"
        name="estimatedResources"
        label="Estimated Resources"
        value={estimatedResources}
        onChange={handleInputChange}
        placeholder="e.g., 2 data scientists, 1 engineer"
      />
    </div>
  );
};
