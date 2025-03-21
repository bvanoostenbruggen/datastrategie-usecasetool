
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        description: "You have been logged out successfully.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{user.name || user.email}</span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        className="text-muted-foreground hover:text-foreground"
      >
        <LogOut className="h-4 w-4 mr-1" />
        <span className="sr-only md:not-sr-only">Logout</span>
      </Button>
    </div>
  );
}
