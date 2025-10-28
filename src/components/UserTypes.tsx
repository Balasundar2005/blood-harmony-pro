import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Hospital, Building2 } from "lucide-react";

const UserTypes = () => {
  const userTypes = [
    {
      icon: Hospital,
      title: "Patients & Hospitals",
      description: "Request urgent blood by specifying blood type, location, and urgency level. Get instant notifications when blood is available.",
      features: ["Quick blood requests", "Real-time availability", "Emergency alerts"],
    },
    {
      icon: Heart,
      title: "Volunteer Donors",
      description: "Register as a donor and receive notifications when your blood type is needed nearby. Save lives in your community.",
      features: ["Location-based matching", "Instant notifications", "Donation history"],
    },
    {
      icon: Building2,
      title: "Blood Banks",
      description: "Manage blood inventory, respond to requests, and coordinate with hospitals and donors efficiently.",
      features: ["Inventory management", "Request handling", "Analytics dashboard"],
    },
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Who Can Use LifeLink?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform serves everyone in the blood donation ecosystem
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 bg-card-gradient border-border animate-fade-in">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{type.title}</CardTitle>
                  <CardDescription className="text-base">{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UserTypes;
