import { Search, Bell, Users, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Request Blood",
      description: "Patient or hospital submits blood request with type, location, and urgency",
    },
    {
      icon: Search,
      title: "Check Availability",
      description: "System automatically searches nearby blood banks for matching blood type",
    },
    {
      icon: Bell,
      title: "Alert Donors",
      description: "If unavailable, nearby registered donors with matching blood type are notified",
    },
    {
      icon: CheckCircle,
      title: "Connect & Save",
      description: "Donor/bank responds, coordination happens, and lives are saved",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and effective blood matching in four steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border z-0" />
                )}
                <div className="relative z-10 text-center animate-fade-in">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
