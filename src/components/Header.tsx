import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <span className="text-xl font-bold text-foreground">LifeLink</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
          <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">How It Works</a>
          <a href="#request" className="text-foreground hover:text-primary transition-colors">Request Blood</a>
          <a href="#donate" className="text-foreground hover:text-primary transition-colors">Donate</a>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="outline">Sign In</Button>
          <Button variant="hero">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
