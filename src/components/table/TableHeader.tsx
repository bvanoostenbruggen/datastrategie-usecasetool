
import { TableHead, TableHeader as ShadCNTableHeader, TableRow } from '@/components/ui/table';
import { SortIcon } from './SortIcon';
import { SortConfig, SortableColumnKey } from './tableUtils';
import { useUseCases } from '@/hooks/useUseCases';

interface TableHeaderProps {
  showAllParameters: boolean;
  sortConfig: SortConfig;
  requestSort: (key: SortableColumnKey) => void;
}

export const TableHeader = ({ showAllParameters, sortConfig, requestSort }: TableHeaderProps) => {
  const { parameters } = useUseCases();
  
  return (
    <ShadCNTableHeader className="bg-muted/30">
      <TableRow>
        <TableHead className="w-[240px]">
          <button
            onClick={() => requestSort('title')}
            className="flex items-center text-left font-medium"
          >
            Title <SortIcon columnKey="title" sortConfig={sortConfig} />
          </button>
        </TableHead>
        
        {parameters.slice(0, showAllParameters ? parameters.length : 2).map(param => (
          <TableHead key={param.id}>
            <button
              onClick={() => requestSort(`scores.${param.id}` as SortableColumnKey)}
              className="flex items-center text-left font-medium"
            >
              {param.name.length > 10 ? param.name.slice(0, 10) + '...' : param.name} 
              <SortIcon 
                columnKey={`scores.${param.id}` as SortableColumnKey} 
                sortConfig={sortConfig} 
              />
            </button>
          </TableHead>
        ))}
        
        <TableHead className="hidden md:table-cell">
          <button
            onClick={() => requestSort('score')}
            className="flex items-center text-left font-medium"
          >
            Score <SortIcon columnKey="score" sortConfig={sortConfig} />
          </button>
        </TableHead>
        
        <TableHead className="hidden lg:table-cell">
          <button
            onClick={() => requestSort('status')}
            className="flex items-center text-left font-medium"
          >
            Status <SortIcon columnKey="status" sortConfig={sortConfig} />
          </button>
        </TableHead>
        
        <TableHead className="w-[100px] text-right">Actions</TableHead>
      </TableRow>
    </ShadCNTableHeader>
  );
};
