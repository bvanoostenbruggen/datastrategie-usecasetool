
import { 
  Plus, 
  Upload, 
  Download,
  Settings2,
  Weight,
  ArrowLeft,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface PageHeaderProps {
  onExport?: () => void;
  onNewUseCaseClick?: () => void;
  onParametersClick?: () => void;
  onWeightsClick?: () => void;
  title?: string;
  description?: string;
  actions?: ReactNode;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export const PageHeader = ({ 
  onExport, 
  onNewUseCaseClick, 
  onParametersClick, 
  onWeightsClick,
  title = "Use Cases",
  description = "Step 2: Identify and prioritize AI use cases for your organization.",
  actions,
  onToggleSidebar,
  isSidebarCollapsed
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex items-start gap-2">
        {onToggleSidebar && (
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={onToggleSidebar}
            className="mt-1"
          >
            {isSidebarCollapsed ? (
              <ChevronsRight className="h-5 w-5" />
            ) : (
              <ChevronsLeft className="h-5 w-5" />
            )}
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-2">
            {description}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        {actions ? (
          actions
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1.5">
                  <Settings2 className="h-3.5 w-3.5" />
                  Manage
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onParametersClick && (
                  <DropdownMenuItem onClick={onParametersClick}>
                    <Settings2 className="mr-2 h-4 w-4" />
                    Parameters
                  </DropdownMenuItem>
                )}
                {onWeightsClick && (
                  <DropdownMenuItem onClick={onWeightsClick}>
                    <Weight className="mr-2 h-4 w-4" />
                    Weights
                  </DropdownMenuItem>
                )}
                {onExport && (
                  <DropdownMenuItem onClick={onExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem disabled>
                  <Upload className="mr-2 h-4 w-4" />
                  Import from CSV (coming soon)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/challenges">
              <Button variant="outline" size="sm" className="hidden sm:flex h-9 items-center gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Challenges
              </Button>
            </Link>
            
            {onNewUseCaseClick && (
              <Button onClick={onNewUseCaseClick} size="sm" className="h-9 gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                New Use Case
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
