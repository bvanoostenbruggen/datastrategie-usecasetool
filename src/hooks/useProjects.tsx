
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Project, ProjectFormData } from "@/types/project";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import useAuth from "@/hooks/useAuth";
import { safelyParseJSON } from "@/utils/storageUtils";

interface ProjectsContextType {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  createProject: (data: ProjectFormData) => Promise<Project>;
  selectProject: (projectId: string) => void;
  getLastSelectedProject: () => Project | null;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from localStorage on mount
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      try {
        const savedProjects = localStorage.getItem(`projects_${user.id}`);
        const parsedProjects = safelyParseJSON<Project[]>(savedProjects, []);
        
        // Normalize dates
        const normalizedProjects = parsedProjects.map(project => ({
          ...project,
          createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt),
          updatedAt: project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt)
        }));
        
        setProjects(normalizedProjects);
        
        // Check for last selected project
        const lastProjectId = localStorage.getItem(`lastProject_${user.id}`);
        if (lastProjectId) {
          const lastProject = normalizedProjects.find(p => p.id === lastProjectId);
          if (lastProject) {
            setCurrentProject(lastProject);
          }
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your projects. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (user && projects.length > 0) {
      try {
        localStorage.setItem(`projects_${user.id}`, JSON.stringify(projects));
      } catch (error) {
        console.error("Error saving projects:", error);
      }
    }
  }, [projects, user]);

  // Save last selected project to localStorage
  useEffect(() => {
    if (user && currentProject) {
      localStorage.setItem(`lastProject_${user.id}`, currentProject.id);
    }
  }, [currentProject, user]);

  const createProject = async (data: ProjectFormData): Promise<Project> => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const newProject: Project = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: user.id
    };
    
    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    
    toast({
      title: "Project Created",
      description: `"${data.name}" has been created successfully.`
    });
    
    return newProject;
  };

  const selectProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      toast({
        title: "Project Selected",
        description: `You are now working on "${project.name}".`
      });
    }
  };

  const getLastSelectedProject = (): Project | null => {
    if (!user) return null;
    
    const lastProjectId = localStorage.getItem(`lastProject_${user.id}`);
    if (!lastProjectId) return null;
    
    return projects.find(p => p.id === lastProjectId) || null;
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        currentProject,
        isLoading,
        createProject,
        selectProject,
        getLastSelectedProject
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export default function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
