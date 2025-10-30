import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Droplet } from "lucide-react";
import { toast } from "sonner";

interface InventoryItem {
  id: string;
  blood_type: string;
  units_available: number;
  blood_bank_id: string;
}

const BloodInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('blood_inventory_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blood_inventory'
        },
        () => {
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_inventory')
        .select('*')
        .order('blood_type');

      if (error) throw error;
      
      // Aggregate by blood type
      const aggregated = (data || []).reduce((acc: any, item) => {
        const existing = acc.find((i: any) => i.blood_type === item.blood_type);
        if (existing) {
          existing.units_available += item.units_available;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);
      
      setInventory(aggregated);
    } catch (error: any) {
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const getInventoryForType = (type: string) => {
    const item = inventory.find(i => i.blood_type === type);
    return item?.units_available || 0;
  };

  const getStatusColor = (units: number) => {
    if (units > 50) return "text-green-500";
    if (units > 20) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Blood Storage Inventory
          </h2>
          <p className="text-muted-foreground text-lg">
            Real-time availability of blood units across all blood banks
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {bloodTypes.map((type, index) => {
            const units = getInventoryForType(type);
            return (
              <Card 
                key={type}
                className="group hover:scale-105 transition-all duration-500 bg-card/50 backdrop-blur-lg border-2 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-3">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                    <Droplet className="w-8 h-8 text-primary-foreground fill-current" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-primary">
                    {type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {loading ? (
                    <div className="h-8 w-16 mx-auto bg-muted animate-pulse rounded" />
                  ) : (
                    <>
                      <p className={`text-4xl font-bold ${getStatusColor(units)} transition-colors duration-300`}>
                        {units}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">units available</p>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Card className="inline-block bg-card/50 backdrop-blur-lg border-2 border-primary/20">
            <CardContent className="flex gap-6 p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Adequate (&gt;50)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-muted-foreground">Low (20-50)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">Critical (&lt;20)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BloodInventory;
