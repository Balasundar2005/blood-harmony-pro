import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Droplet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const requestSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters").max(100),
  contactNumber: z.string()
    .regex(/^\+91[0-9]{10}$/, "Must be +91 followed by 10 digits")
    .min(13, "Must be +91 followed by 10 digits")
    .max(13, "Must be +91 followed by 10 digits"),
  hospitalName: z.string().min(2, "Hospital name required").max(200),
  bloodType: z.string().min(1, "Blood type required"),
  unitsRequired: z.number().min(1, "At least 1 unit required"),
  location: z.string().min(2, "Location required").max(200),
  urgency: z.string().min(1, "Urgency level required"),
});

const BloodRequestForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    contactNumber: "",
    hospitalName: "",
    bloodType: "",
    unitsRequired: "",
    location: "",
    urgency: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to request blood");
      navigate("/auth");
      return;
    }
    
    try {
      const validation = requestSchema.parse({
        ...formData,
        unitsRequired: parseInt(formData.unitsRequired),
      });
      
      setLoading(true);

      const { error } = await supabase
        .from('blood_requests')
        .insert({
          user_id: user.id,
          patient_name: validation.patientName,
          contact_number: validation.contactNumber,
          hospital_name: validation.hospitalName,
          blood_type: validation.bloodType,
          units_required: validation.unitsRequired,
          location: validation.location,
          urgency: validation.urgency,
        } as any);

      if (error) throw error;

      toast.success("Request submitted successfully! We're notifying nearby donors and blood banks.");
      setFormData({
        patientName: "",
        contactNumber: "",
        hospitalName: "",
        bloodType: "",
        unitsRequired: "",
        location: "",
        urgency: "",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to submit request");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="request" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-border bg-card-gradient">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplet className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl">Request Blood</CardTitle>
              <CardDescription className="text-base">
                Fill in the details below and we'll find matching donors immediately
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Patient Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter patient name" 
                      value={formData.patientName}
                      onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+91XXXXXXXXXX" 
                      value={formData.contactNumber}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (!value.startsWith('+91')) {
                          value = '+91' + value.replace(/^\+91/, '');
                        }
                        value = value.slice(0, 13);
                        setFormData({...formData, contactNumber: value});
                      }}
                      required 
                    />
                    <p className="text-xs text-muted-foreground">Format: +91 followed by 10 digits</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital Name</Label>
                  <Input 
                    id="hospital" 
                    placeholder="Enter hospital name" 
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="blood-type">Blood Type</Label>
                    <Select 
                      value={formData.bloodType}
                      onValueChange={(value) => setFormData({...formData, bloodType: value})}
                      required
                    >
                      <SelectTrigger id="blood-type">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="units">Units Required</Label>
                    <Input 
                      id="units" 
                      type="number" 
                      min="1" 
                      placeholder="Number of units" 
                      value={formData.unitsRequired}
                      onChange={(e) => setFormData({...formData, unitsRequired: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location/City</Label>
                  <Input 
                    id="location" 
                    placeholder="Enter city or area" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select 
                    value={formData.urgency}
                    onValueChange={(value) => setFormData({...formData, urgency: value})}
                    required
                  >
                    <SelectTrigger id="urgency">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical (Within hours)</SelectItem>
                      <SelectItem value="urgent">Urgent (Within 24 hours)</SelectItem>
                      <SelectItem value="normal">Normal (Within 2-3 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Blood Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BloodRequestForm;
