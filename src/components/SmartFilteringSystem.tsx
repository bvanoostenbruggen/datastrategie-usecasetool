
import { useState, useEffect } from 'react';
import { UseCase, Team, Technology } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchIcon, Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SmartFilteringSystemProps {
  useCases: UseCase[];
  onFiltersChange: (filteredUseCases: UseCase[]) => void;
}

export const SmartFilteringSystem = ({ useCases, onFiltersChange }: SmartFilteringSystemProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string[]>([]);
  const [techFilter, setTechFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'impact' | 'ease' | 'recent' | 'title'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [availableTechnologies, setAvailableTechnologies] = useState<Technology[]>([]);
  const [filterCount, setFilterCount] = useState(0);

  // Extract unique teams and technologies from all use cases
  useEffect(() => {
    const teams = new Set<Team>();
    const technologies = new Set<Technology>();

    useCases.forEach(useCase => {
      useCase.team.forEach(team => teams.add(team));
      useCase.technologies.forEach(tech => technologies.add(tech));
    });

    setAvailableTeams(Array.from(teams));
    setAvailableTechnologies(Array.from(technologies));
  }, [useCases]);

  // Apply filters and update parent component
  useEffect(() => {
    let count = 0;
    if (searchQuery) count++;
    if (statusFilter !== 'all') count++;
    if (teamFilter.length > 0) count++;
    if (techFilter.length > 0) count++;
    setFilterCount(count);

    // Apply all filters
    let filtered = [...useCases];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(useCase => 
        useCase.title.toLowerCase().includes(query) ||
        useCase.description.toLowerCase().includes(query) ||
        useCase.businessObjective.toLowerCase().includes(query) ||
        useCase.team.some(team => team.toLowerCase().includes(query)) ||
        useCase.technologies.some(tech => tech.toLowerCase().includes(query))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(useCase => useCase.status === statusFilter);
    }

    // Filter by team
    if (teamFilter.length > 0) {
      filtered = filtered.filter(useCase => 
        useCase.team.some(team => teamFilter.includes(team))
      );
    }

    // Filter by technology
    if (techFilter.length > 0) {
      filtered = filtered.filter(useCase => 
        useCase.technologies.some(tech => techFilter.includes(tech))
      );
    }

    // Sort the filtered list
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'score':
          comparison = b.score - a.score;
          break;
        case 'impact':
          if (a.scores?.impact && b.scores?.impact) {
            comparison = b.scores.impact - a.scores.impact;
          }
          break;
        case 'ease':
          if (a.scores?.easeOfImplementation && b.scores?.easeOfImplementation) {
            comparison = b.scores.easeOfImplementation - a.scores.easeOfImplementation;
          }
          break;
        case 'recent':
          const dateA = new Date(a.updatedAt).getTime();
          const dateB = new Date(b.updatedAt).getTime();
          comparison = dateB - dateA;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      // Reverse if ascending order
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    onFiltersChange(filtered);
  }, [useCases, searchQuery, statusFilter, teamFilter, techFilter, sortBy, sortOrder, onFiltersChange]);

  // Toggle team in filter
  const toggleTeamFilter = (team: Team) => {
    if (teamFilter.includes(team)) {
      setTeamFilter(teamFilter.filter(t => t !== team));
    } else {
      setTeamFilter([...teamFilter, team]);
    }
  };

  // Toggle technology in filter
  const toggleTechFilter = (tech: Technology) => {
    if (techFilter.includes(tech)) {
      setTechFilter(techFilter.filter(t => t !== tech));
    } else {
      setTechFilter([...techFilter, tech]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTeamFilter([]);
    setTechFilter([]);
    setSortBy('score');
    setSortOrder('desc');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Box */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, team..."
            className="pl-10 h-10"
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filters Button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "flex items-center w-full sm:w-auto px-4 h-10",
                filterCount > 0 && "border-purple text-purple"
              )}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {filterCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-purple text-white">
                  {filterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <h4 className="font-medium">Filter Use Cases</h4>
              
              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger id="status-filter">
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
              
              {/* Team Filter */}
              <div className="space-y-2">
                <Label>Teams</Label>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">
                  {availableTeams.map((team) => (
                    <Badge 
                      key={team}
                      variant={teamFilter.includes(team) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTeamFilter(team)}
                    >
                      {team}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Technology Filter */}
              <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">
                  {availableTechnologies.map((tech) => (
                    <Badge 
                      key={tech}
                      variant={techFilter.includes(tech) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTechFilter(tech)}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Sort Options */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="sort-by">Sort By</Label>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as any)}
                  >
                    <SelectTrigger id="sort-by">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score">Score</SelectItem>
                      <SelectItem value="impact">Impact</SelectItem>
                      <SelectItem value="ease">Ease</SelectItem>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort-order">Order</Label>
                  <Select
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
                  >
                    <SelectTrigger id="sort-order">
                      <SelectValue placeholder="Sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Highest First</SelectItem>
                      <SelectItem value="asc">Lowest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Reset Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-auto">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as any)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Highest Score</SelectItem>
              <SelectItem value="impact">Highest Impact</SelectItem>
              <SelectItem value="ease">Ease of Implementation</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {filterCount > 0 && (
        <div className="flex flex-wrap gap-2 py-2">
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {statusFilter}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => setStatusFilter('all')} 
              />
            </Badge>
          )}
          {teamFilter.map(team => (
            <Badge key={team} variant="secondary" className="flex items-center gap-1">
              Team: {team}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleTeamFilter(team)} 
              />
            </Badge>
          ))}
          {techFilter.map(tech => (
            <Badge key={tech} variant="secondary" className="flex items-center gap-1">
              Tech: {tech}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleTechFilter(tech)} 
              />
            </Badge>
          ))}
          {filterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={resetFilters}
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
