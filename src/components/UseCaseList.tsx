
import { useState } from 'react';
import { UseCase, StatusType } from '@/types/types';
import UseCaseCard from './UseCaseCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface UseCaseListProps {
  useCases: UseCase[];
  onEdit: (id: string, data: Partial<UseCase>) => void;
  onDelete: (id: string) => void;
}

export const UseCaseList = ({ useCases = [], onEdit, onDelete }: UseCaseListProps) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'impact' | 'ease' | 'recent'>('score');
  const isMobile = useIsMobile();

  // Filter use cases based on status and search query
  const filteredUseCases = (useCases || [])
    .filter((useCase) => {
      // Filter by status if not 'all'
      if (statusFilter !== 'all' && useCase.status !== statusFilter) {
        return false;
      }

      // Filter by search query (title, description, or business objective)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          (useCase.title?.toLowerCase() || "").includes(query) ||
          (useCase.description?.toLowerCase() || "").includes(query) ||
          (useCase.businessObjective?.toLowerCase() || "").includes(query) ||
          (Array.isArray(useCase.team) && useCase.team.some(team => (team || "").toLowerCase().includes(query))) ||
          (Array.isArray(useCase.technologies) && useCase.technologies.some(tech => (tech || "").toLowerCase().includes(query)))
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort based on the selected sort option
      switch (sortBy) {
        case 'score':
          return ((b.score || 0) - (a.score || 0));
        case 'impact':
          return getImpactValue(b.impact) - getImpactValue(a.impact);
        case 'ease':
          return getEaseValue(b.ease) - getEaseValue(a.ease);
        case 'recent':
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          return dateB - dateA;
        default:
          return 0;
      }
    });

  // Helper functions to convert impact and ease levels to numeric values for sorting
  function getImpactValue(impact: string | undefined): number {
    switch (impact) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  function getEaseValue(ease: string | undefined): number {
    switch (ease) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">Search</Label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search use cases..."
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status-filter" className="text-sm font-medium">Filter by Status</Label>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger id="status-filter" className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sort-by" className="text-sm font-medium">Sort By</Label>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as any)}
          >
            <SelectTrigger id="sort-by" className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent align={isMobile ? "center" : "end"}>
              <SelectItem value="score">Highest Score</SelectItem>
              <SelectItem value="impact">Highest Impact</SelectItem>
              <SelectItem value="ease">Ease of Implementation</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6">
        {filteredUseCases.length > 0 ? (
          filteredUseCases.map((useCase) => (
            <UseCaseCard
              key={useCase.id}
              useCase={useCase}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-black/30 rounded-lg border border-border">
            <h3 className="text-lg font-medium text-muted-foreground">No use cases found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery 
                ? "Try adjusting your search or filters"
                : "Start by adding your first use case"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
