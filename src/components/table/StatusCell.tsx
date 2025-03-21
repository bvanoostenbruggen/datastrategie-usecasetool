
import { StatusType } from '@/types/types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface StatusCellProps {
  isEditing: boolean;
  status: StatusType;
  onStatusChange: (value: StatusType) => void;
}

export const StatusCell = ({ isEditing, status, onStatusChange }: StatusCellProps) => {
  if (isEditing) {
    return (
      <div className="flex flex-col space-y-1">
        <label className="text-xs text-muted-foreground font-medium">Status</label>
        <Select
          value={status}
          onValueChange={onStatusChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="backlog">Backlog</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <Badge
      className={`
        rounded-full
        ${status === 'completed' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : ''}
        ${status === 'in-progress' ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : ''}
        ${status === 'backlog' ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30' : ''}
        ${status === 'archived' ? 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30' : ''}
      `}
    >
      {status === 'in-progress' ? 'In Progress' : 
        status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
