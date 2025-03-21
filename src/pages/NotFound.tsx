
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="absolute top-6 right-6">
        <Logo />
      </div>
      <div className="text-center p-6 max-w-md glass rounded-lg">
        <h1 className="text-4xl font-bold mb-4 text-gradient-pink">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-primary/80 underline transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
