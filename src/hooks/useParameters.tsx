
import { useState, useEffect } from 'react';
import { ScoreParameter, DEFAULT_PARAMETERS } from '@/types/types';
import { safelyParseJSON } from '@/utils/storageUtils';

export const useParameters = () => {
  const [parameters, setParameters] = useState<ScoreParameter[]>(() => {
    const savedParameters = localStorage.getItem('scoreParameters');
    return safelyParseJSON(savedParameters, DEFAULT_PARAMETERS);
  });
  
  // Save to localStorage whenever parameters change
  useEffect(() => {
    try {
      localStorage.setItem('scoreParameters', JSON.stringify(parameters));
    } catch (e) {
      console.error("Error saving parameters to localStorage:", e);
    }
  }, [parameters]);
  
  return {
    parameters,
    setParameters
  };
};
