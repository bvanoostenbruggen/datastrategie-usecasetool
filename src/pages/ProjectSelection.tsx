import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, FolderOpen, ArrowRight, Clock, Info, Sparkles } from "lucide-react";
import { format } from "date-fns";

import useProjects from "@/hooks/useProjects";
import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Project name must be at least 2 characters" }),
  description: z.string().optional(),
});

// Use the Zod schema to type FormData
type FormData = z.infer<typeof formSchema>;

export default function ProjectSelection() {
  const { projects, createProject, selectProject, currentProject } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Ensure name is not undefined when passing to createProject
      await createProject({
        name: data.name,
        description: data.description,
      });
      form.reset();
      setIsDialogOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleSelectProject = (projectId: string) => {
    selectProject(projectId);
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 container py-8 md:py-12 animate-fade-in">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient-pink mb-3">Project Hub</h1>
            <p className="text-muted-foreground text-balance max-w-2xl mx-auto">
              Create a new project or select an existing one to get started with Use Case Scoring and Prioritization
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create new project card */}
            <Card className="border-dashed border-2 h-full col-span-1 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 card-interactive">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full h-full flex flex-col items-center justify-center p-10 space-y-4 rounded-md hover:bg-muted/10">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <PlusCircle className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-xl font-medium">Create New Project</span>
                    <p className="text-muted-foreground text-sm text-pretty max-w-xs">
                      Start fresh with a new project for your use cases
                    </p>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                      Fill in the details for your new project.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                              <Input placeholder="My Awesome Project" {...field} className="focus-ring" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description of your project"
                                className="resize-none focus-ring min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter className="mt-6">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                          Cancel
                        </Button>
                        <Button type="submit" variant="pink" className="w-full sm:w-auto">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Create Project
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </Card>

            {/* Existing projects section */}
            <Card className="col-span-1 lg:col-span-2 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Your Projects</CardTitle>
                    <CardDescription>Select a project to continue working</CardDescription>
                  </div>
                  {projects.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {projects.length} project{projects.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </CardHeader>
              <Separator className="mx-6" />
              <CardContent className="pt-4">
                {projects.length === 0 ? (
                  <div className="py-8 text-center bg-muted/5 rounded-md border border-dashed">
                    <Info className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-70" />
                    <p className="text-muted-foreground">No projects yet. Create your first one!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {projects.map((project) => (
                      <Card 
                        key={project.id} 
                        className={`hover:shadow-md transition-all cursor-pointer card-interactive ${
                          currentProject?.id === project.id ? "border-primary/60 bg-primary/5" : ""
                        }`}
                        onClick={() => handleSelectProject(project.id)}
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{project.name}</CardTitle>
                              <CardDescription className="line-clamp-1 mt-1">
                                {project.description || "No description"}
                              </CardDescription>
                            </div>
                            {currentProject?.id === project.id && (
                              <div className="rounded-full px-2 py-1 text-xs bg-primary/20 text-primary border border-primary/30">
                                Current
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardFooter className="p-4 pt-2 flex justify-between items-center">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {format(new Date(project.updatedAt), "MMM d, yyyy")}
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectProject(project.id);
                            }}
                            variant={currentProject?.id === project.id ? "secondary" : "outline"}
                            className="gap-1"
                          >
                            {currentProject?.id === project.id ? (
                              "Selected"
                            ) : (
                              <>
                                <span>Select</span>
                                <ArrowRight className="h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
