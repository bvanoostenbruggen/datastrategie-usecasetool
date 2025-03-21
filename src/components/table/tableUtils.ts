
import { UseCase } from '@/types/types';

export type SortableColumnKey = 
  keyof UseCase | 
  `scores.${string}`; // Updated to handle any parameter ID

export interface SortConfig {
  key: SortableColumnKey | null;
  direction: 'asc' | 'desc';
}

export const getSortedFilteredData = (
  useCases: UseCase[], 
  searchQuery: string, 
  sortConfig: SortConfig
): UseCase[] => {
  const filteredData = useCases.filter(useCase => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      useCase.title.toLowerCase().includes(query) ||
      useCase.description.toLowerCase().includes(query) ||
      useCase.businessObjective.toLowerCase().includes(query) ||
      useCase.status.toLowerCase().includes(query) ||
      (Array.isArray(useCase.team) && useCase.team.some(t => t.toLowerCase().includes(query))) ||
      (Array.isArray(useCase.technologies) && useCase.technologies.some(t => t.toLowerCase().includes(query)))
    );
  });

  if (sortConfig.key === null) {
    return filteredData;
  }

  return [...filteredData].sort((a, b) => {
    // Handle nested properties like scores.impact
    if (sortConfig.key && sortConfig.key.includes('.')) {
      const [parentKey, childKey] = sortConfig.key.split('.') as [keyof UseCase, string];
      
      if (parentKey === 'scores') {
        const scoreKeyA = a.scores?.[childKey];
        const scoreKeyB = b.scores?.[childKey];
        
        const aValue = scoreKeyA ?? 0;
        const bValue = scoreKeyB ?? 0;
        
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    }
    
    // Handle regular properties
    const key = sortConfig.key as keyof UseCase;
    
    // Handle string properties
    if (typeof a[key] === 'string' && typeof b[key] === 'string') {
      return sortConfig.direction === 'asc'
        ? (a[key] as string).localeCompare(b[key] as string)
        : (b[key] as string).localeCompare(a[key] as string);
    }
    
    // Handle number properties
    if (typeof a[key] === 'number' && typeof b[key] === 'number') {
      return sortConfig.direction === 'asc'
        ? (a[key] as number) - (b[key] as number)
        : (b[key] as number) - (a[key] as number);
    }
    
    // Handle date properties (strings or Date objects)
    if (key === 'createdAt' || key === 'updatedAt') {
      const dateA = a[key] instanceof Date ? a[key] as Date : new Date(a[key] as string);
      const dateB = b[key] instanceof Date ? b[key] as Date : new Date(b[key] as string);
      
      return sortConfig.direction === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }
    
    return 0;
  });
};
