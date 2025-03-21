
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Activity, ChevronDown, Users, Target, Lightbulb, Map } from 'lucide-react';
import { Logo } from '@/components/Logo';
import UserMenu from '@/components/UserMenu';
import ProjectFilter from '@/components/ProjectFilter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTeam } from '@/contexts/TeamContext';

const Header = () => {
  const location = useLocation();
  const { currentTeam, allTeams, setCurrentTeam } = useTeam();

  const isCurrentPage = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Logo />
        <Separator orientation="vertical" className="mx-2 h-6" />
        <nav className="hidden md:flex flex-1 items-center gap-5 text-sm">
          <Link
            to="/challenges"
            className={`flex items-center gap-1 ${
              isCurrentPage('/challenges') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Target className="h-4 w-4" />
            Challenges
          </Link>
          <Link
            to="/"
            className={`flex items-center gap-1 ${
              isCurrentPage('/') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            Use Cases
          </Link>
          <Link
            to="/roadmap"
            className={`flex items-center gap-1 ${
              isCurrentPage('/roadmap') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Map className="h-4 w-4" />
            Roadmap
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-3">
          <ProjectFilter />

          {/* Team Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 font-normal">
                <Users className="h-4 w-4 mr-2 text-primary" />
                <span className="max-w-32 truncate">{currentTeam?.name || 'Select Team'}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Your Team</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allTeams.map((team) => (
                <DropdownMenuItem
                  key={team.id}
                  className={`flex items-center cursor-pointer ${
                    currentTeam?.id === team.id ? 'bg-muted font-medium' : ''
                  }`}
                  onClick={() => setCurrentTeam(team)}
                >
                  <span className="truncate">{team.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
