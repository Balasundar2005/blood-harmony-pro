import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const donorSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  age: z.number().min(18, "Must be at least 18 years old").max(65, "Must be under 65 years old"),
  contactNumber: z.string().min(10, "Invalid phone number").max(20),
  email: z.string().email("Invalid email address").max(255),
  bloodType: z.string().min(1, "Blood type required"),
  weight: z.number().min(50, "Weight must be at least 50 kg"),
  location: z.string().min(2, "Location required").max(200),
  lastDonationDate: z.string().optional(),
});

const DonorRegistrationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    contactNumber: "",
    email: "",
    bloodType: "",
    weight: "",
    location: "",
    lastDonationDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to register as a donor");
      navigate("/auth");
      return;
    }
    
    if (!agreed) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    
    try {
      const validation = donorSchema.parse({
        ...formData,
        age: parseInt(formData.age),
        weight: parseInt(formData.weight),
      });
      
      setLoading(true);

      const { error } = await supabase
        .from('donors')
        .insert({
          user_id: user.id,
          full_name: validation.fullName,
          age: validation.age,
          contact_number: validation.contactNumber,
          email: validation.email,
          blood_type: validation.bloodType,
          weight: validation.weight,
          location: validation.location,
          last_donation_date: validation.lastDonationDate || null,
        } as any);

      if (error) throw error;

      toast.success("Registration successful! Thank you for becoming a life-saver.");
      setFormData({
        fullName: "",
        age: "",
        contactNumber: "",
        email: "",
        bloodType: "",
        weight: "",
        location: "",
        lastDonationDate: "",
      });
      setAgreed(false);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error.code === '23505') {
        toast.error("You are already registered as a donor");
      } else {
        toast.error(error.message || "Failed to register");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="donate" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-border bg-card-gradient">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary fill-primary" />
              </div>
              <CardTitle className="text-3xl">Become a Donor</CardTitle>
              <CardDescription className="text-base">
                Register as a volunteer donor and help save lives in your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="donor-name">Full Name</Label>
                    <Input 
                      id="donor-name" 
                      placeholder="Enter your full name" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      min="18" 
                      max="65" 
                      placeholder="Your age" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="donor-phone">Contact Number</Label>
                    <Input 
                      id="donor-phone" 
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="donor-blood-type">Blood Type</Label>
                    <Select 
                      value={formData.bloodType}
                      onValueChange={(value) => setFormData({...formData, bloodType: value})}
                      required
                    >
                      <SelectTrigger id="donor-blood-type">
                        <SelectValue placeholder="Select your blood type" />
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
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input 
                      id="weight" 
                      type="number" 
                      min="50" 
                      placeholder="Your weight" 
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="donor-location">City/Location</Label>
                  <Input 
                    id="donor-location" 
                    placeholder="Enter your city" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last-donation">Last Donation Date (if any)</Label>
                  <Input 
                    id="last-donation" 
                    type="date" 
                    value={formData.lastDonationDate}
                    onChange={(e) => setFormData({...formData, lastDonationDate: e.target.value})}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to be contacted when my blood type is needed and I am medically fit to donate
                  </label>
                </div>
                
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Registering..." : "Register as Donor"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DonorRegistrationForm;
