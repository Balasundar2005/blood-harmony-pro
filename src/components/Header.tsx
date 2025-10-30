import { Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <span className="text-xl font-bold text-foreground">LifeLink</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollToSection('home')} className="text-foreground hover:text-primary transition-colors">Home</button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-foreground hover:text-primary transition-colors">How It Works</button>
          <button onClick={() => scrollToSection('request')} className="text-foreground hover:text-primary transition-colors">Request Blood</button>
          <button onClick={() => scrollToSection('donate')} className="text-foreground hover:text-primary transition-colors">Donate</button>
        </nav>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="hidden md:flex">
                My Dashboard
              </Button>
              <span className="text-sm text-muted-foreground hidden md:inline">
                {user.email}
              </span>
              <Button variant="outline" onClick={handleSignOut} className="animate-pulse-glow">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/auth')}>Sign In</Button>
              <Button variant="default" onClick={() => navigate('/auth')} className="animate-pulse-glow">Get Started</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
