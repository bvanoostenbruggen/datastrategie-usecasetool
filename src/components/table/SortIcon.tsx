
import { ArrowUpDown } from 'lucide-react';
import { SortableColumnKey, SortConfig } from './tableUtils';

interface SortIconProps {
  columnKey: SortableColumnKey;
  sortConfig: SortConfig;
}

export const SortIcon = ({ columnKey, sortConfig }: SortIconProps) => {
  return (
    <ArrowUpDown className={`ml-1 h-4 w-4 ${
      sortConfig.key === columnKey ? 'opacity-100' : 'opacity-50'
    } ${
      sortConfig.key === columnKey && sortConfig.direction === 'desc' ? 'rotate-180' : ''
    } transition-all`} />
  );
};
