
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface UseCaseTitleCellProps {
  title: string;
  description: string;
}

export const UseCaseTitleCell = ({ title, description }: UseCaseTitleCellProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="max-w-[240px] truncate font-medium">
            {title}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="max-w-[300px]">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
