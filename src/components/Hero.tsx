import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-blood-donation.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-hero-gradient opacity-90 z-0" />
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Connecting Lives Through Blood Donation
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-95">
            A unified platform connecting patients, donors, and blood banks in real-time to save lives faster
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 group relative overflow-hidden"
              onClick={() => {
                const element = document.getElementById('request');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10">Request Blood</span>
              <ArrowRight className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow opacity-0 group-hover:opacity-20 transition-opacity" />
            </Button>
            <Button 
              size="lg" 
              className="text-lg px-8 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-sm relative overflow-hidden group transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              onClick={() => {
                const element = document.getElementById('donate');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10">Become a Donor</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] group">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-sm opacity-90">Real-Time Matching</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] group">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent group-hover:scale-110 transition-transform">1000+</div>
              <div className="text-sm opacity-90">Active Donors</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] group">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent group-hover:scale-110 transition-transform">500+</div>
              <div className="text-sm opacity-90">Lives Saved</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
