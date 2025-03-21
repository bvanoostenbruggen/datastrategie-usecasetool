
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AuthLayout } from "@/components/AuthLayout";
import useProjects from "@/hooks/useProjects";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useAuth from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof formSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { currentProject, projects } = useProjects();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (currentProject) {
        navigate("/");
      } else if (projects.length > 0) {
        navigate("/project-selection");
      } else {
        navigate("/project-selection");
      }
    }
  }, [isAuthenticated, navigate, currentProject, projects]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(data.email, data.password);
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
      navigate("/project-selection");
    } catch (error) {
      setError(
        error instanceof Error 
          ? error.message 
          : "Failed to login. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <AuthLayout>
      <Card className="w-full max-w-md border-border/50 glass shadow-lg transition-all duration-300 hover:shadow-primary/20">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-gradient-pink font-bold">Use Case Scoring Hub</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="you@example.com"
                          className="pl-10"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pl-10"
                          {...field}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                variant="pink"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Link 
            to="/forgot-password" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
