
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, ChevronDown } from "lucide-react";
import useProjects from "@/hooks/useProjects";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function ProjectFilter() {
  const { projects, currentProject, selectProject } = useProjects();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentProject) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/project-selection")}
        className="h-8"
      >
        <FolderOpen className="h-4 w-4 mr-2" />
        Select a Project
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 font-normal">
          <FolderOpen className="h-4 w-4 mr-2 text-primary" />
          <span className="max-w-32 truncate">{currentProject.name}</span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Your Projects</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            className={`flex items-center cursor-pointer ${
              currentProject.id === project.id ? "bg-muted font-medium" : ""
            }`}
            onClick={() => {
              selectProject(project.id);
              setIsOpen(false);
            }}
          >
            <span className="truncate">{project.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setIsOpen(false);
            navigate("/project-selection");
          }}
        >
          Manage Projects
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
