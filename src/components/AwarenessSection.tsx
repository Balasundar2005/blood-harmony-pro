import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Activity, Award } from "lucide-react";

const AwarenessSection = () => {
  const facts = [
    {
      icon: Heart,
      title: "Every Donation Saves Lives",
      description: "One blood donation can save up to 3 lives. Be a hero today!",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: Users,
      title: "38% Need Blood",
      description: "38% of the population is eligible to donate blood, but less than 10% actually do.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Activity,
      title: "Every 2 Seconds",
      description: "Someone in India needs blood every 2 seconds. Your donation matters.",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: Award,
      title: "Safe & Quick",
      description: "Blood donation is completely safe and takes only 10-15 minutes of your time.",
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Why Blood Donation Matters
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn about the life-saving impact of blood donation and how you can make a difference
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {facts.map((fact, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-card/50 backdrop-blur-lg animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${fact.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <CardContent className="p-6 relative z-10">
                <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${fact.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                  <fact.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {fact.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {fact.description}
                </p>
              </CardContent>

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center animate-bounce-in" style={{ animationDelay: '0.8s' }}>
          <Card className="inline-block bg-gradient-to-r from-primary to-primary-glow p-1 rounded-2xl hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] transition-all duration-500">
            <div className="bg-card rounded-xl px-8 py-6">
              <p className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Join the Mission
              </p>
              <p className="text-muted-foreground">
                Register as a donor today and become part of a life-saving community
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AwarenessSection;
