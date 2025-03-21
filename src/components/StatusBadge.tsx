
import { cn } from '@/lib/utils';
import { StatusType } from '@/types/types';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge = ({ status, className, size = 'md' }: StatusBadgeProps) => {
  const statusConfig = {
    'backlog': {
      color: 'bg-status-backlog/20 text-status-backlog border-status-backlog/30',
      label: 'Backlog'
    },
    'in-progress': {
      color: 'bg-purple/20 text-purple border-purple/30',
      label: 'In Progress'
    },
    'completed': {
      color: 'bg-pink/20 text-pink border-pink/30',
      label: 'Completed'
    },
    'archived': {
      color: 'bg-status-archived/20 text-status-archived border-status-archived/30',
      label: 'Archived'
    }
  };

  const config = statusConfig[status];
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1'
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {config.label}
    </span>
  );
};
