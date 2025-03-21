
import { useEffect, ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useProjects from "@/hooks/useProjects";

interface ProjectRedirectProps {
  children: ReactNode;
}

export default function ProjectRedirect({ children }: ProjectRedirectProps) {
  const { currentProject, projects, isLoading } = useProjects();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !currentProject && projects.length > 0) {
      navigate("/project-selection");
    }
  }, [currentProject, isLoading, navigate, projects.length]);

  // If loading, show nothing yet
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className="h-6 w-20 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  // If no projects exist at all, redirect to project selection
  if (!isLoading && projects.length === 0) {
    return <Navigate to="/project-selection" replace />;
  }
  
  // If there's no current project but projects exist, redirect to selection
  if (!isLoading && !currentProject && projects.length > 0) {
    return <Navigate to="/project-selection" replace />;
  }

  // If there is a current project, render the children
  return <>{children}</>;
}
