import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Droplet, Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import DonorNotifications from "@/components/DonorNotifications";

interface DonationRecord {
  id: string;
  donation_date: string;
  blood_type: string;
  units_donated: number;
}

const DonorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    fetchDonations();
  }, [user, navigate]);

  const fetchDonations = async () => {
    try {
      if (!user) return;

      // First get the donor record
      const { data: donorData, error: donorError } = await supabase
        .from('donors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (donorError) {
        if (donorError.code === 'PGRST116') {
          // No donor record found
          setDonations([]);
          return;
        }
        throw donorError;
      }

      // Then get donation records
      const { data, error } = await supabase
        .from('donation_records')
        .select('*')
        .eq('donor_id', donorData.id)
        .order('donation_date', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error: any) {
      console.error("Error fetching donations:", error);
      // Don't show error toast, just set empty array
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const totalDonations = donations.length;
  const totalUnits = donations.reduce((sum, d) => sum + d.units_donated, 0);
  const livesSaved = totalUnits * 3; // Each unit can save up to 3 lives

  const getBadge = (donations: number) => {
    if (donations >= 50) return { title: "Legend", color: "from-purple-500 to-pink-600", icon: "👑" };
    if (donations >= 25) return { title: "Hero", color: "from-yellow-500 to-orange-600", icon: "🏆" };
    if (donations >= 10) return { title: "Champion", color: "from-blue-500 to-cyan-600", icon: "⭐" };
    if (donations >= 5) return { title: "Warrior", color: "from-green-500 to-emerald-600", icon: "💪" };
    return { title: "Beginner", color: "from-gray-500 to-gray-600", icon: "🌱" };
  };

  const badge = getBadge(totalDonations);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Donor Journey
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your life-saving contributions and achievements
            </p>
          </div>

          {/* Real-time Notifications Section */}
          <div className="mb-8">
            <DonorNotifications />
          </div>

          {/* Badge Card */}
          <Card className="mb-8 overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-lg animate-scale-in">
            <div className={`h-2 bg-gradient-to-r ${badge.color}`} />
            <CardContent className="p-8">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-5xl animate-pulse-glow`}>
                    {badge.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-1">{badge.title}</h2>
                    <p className="text-muted-foreground">Current Level</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {totalDonations}
                  </p>
                  <p className="text-muted-foreground">Total Donations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="group hover:scale-105 transition-all duration-500 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mb-2 group-hover:animate-pulse-glow">
                  <Droplet className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">{totalUnits}</CardTitle>
                <CardDescription>Units Donated</CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-500 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-2 group-hover:animate-pulse-glow">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">{livesSaved}</CardTitle>
                <CardDescription>Lives Potentially Saved</CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-500 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-2 group-hover:animate-pulse-glow">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">{totalDonations >= 5 ? "Yes" : "Soon"}</CardTitle>
                <CardDescription>Achievement Unlocked</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Donation History */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Donation History
              </CardTitle>
              <CardDescription>Your blood donation timeline</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : donations.length === 0 ? (
                <div className="text-center py-12">
                  <Droplet className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-2">No donations recorded yet</p>
                  <p className="text-sm text-muted-foreground">
                    Your donation history will appear here once you start donating
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donations.map((donation, index) => (
                    <div 
                      key={donation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors animate-slide-in-right"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Droplet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{donation.blood_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(donation.donation_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-primary/50">
                        {donation.units_donated} {donation.units_donated === 1 ? 'unit' : 'units'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Badge Progress */}
          {totalDonations < 50 && (
            <Card className="mt-8 bg-gradient-to-br from-card to-primary/5 border-2 border-primary/20 animate-bounce-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold">Progress to Next Badge</p>
                  <p className="text-sm text-muted-foreground">
                    {totalDonations} / {totalDonations < 5 ? 5 : totalDonations < 10 ? 10 : totalDonations < 25 ? 25 : 50}
                  </p>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 animate-shimmer"
                    style={{ 
                      width: `${(totalDonations / (totalDonations < 5 ? 5 : totalDonations < 10 ? 10 : totalDonations < 25 ? 25 : 50)) * 100}%`,
                      backgroundSize: '200% 100%'
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
