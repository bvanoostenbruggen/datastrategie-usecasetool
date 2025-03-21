
import { UseCase } from '@/types/types';

// Safe version of parsing data from localStorage
export const safelyParseJSON = <T,>(jsonString: string | null, fallback: T): T => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return fallback;
  }
};

// Normalize date objects in parsed data
export const normalizeDates = (useCase: UseCase): UseCase => {
  return {
    ...useCase,
    createdAt: useCase.createdAt instanceof Date ? useCase.createdAt : new Date(useCase.createdAt || Date.now()),
    updatedAt: useCase.updatedAt instanceof Date ? useCase.updatedAt : new Date(useCase.updatedAt || Date.now()),
  };
};
