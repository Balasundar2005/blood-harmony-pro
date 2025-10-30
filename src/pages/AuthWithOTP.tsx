import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Heart, ArrowLeft } from "lucide-react";
import { z } from "zod";

const phoneSchema = z.string()
  .regex(/^\+91[0-9]{10}$/, "Must be +91 followed by 10 digits");

const AuthWithOTP = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      phoneSchema.parse(phone);
      setLoading(true);

      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;

      toast.success("OTP sent to your phone!");
      setOtpSent(true);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      toast.success("Phone verified successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/auth")}
          className="mb-4 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Email Login
        </Button>

        <Card className="max-w-md mx-auto bg-card/80 backdrop-blur-xl border-2 border-primary/20 shadow-2xl animate-scale-in">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <Heart className="w-8 h-8 text-primary-foreground fill-current" />
            </div>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {otpSent ? "Verify OTP" : "Phone Verification"}
            </CardTitle>
            <CardDescription>
              {otpSent 
                ? "Enter the 6-digit code sent to your phone" 
                : "We'll send you a one-time password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91XXXXXXXXXX"
                    value={phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!value.startsWith('+91')) {
                        value = '+91' + value.replace(/^\+91/, '');
                      }
                      value = value.slice(0, 13);
                      setPhone(value);
                    }}
                    required
                    className="text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: +91 followed by 10 digits
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full animate-pulse-glow" 
                  size="lg" 
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-center block">Enter OTP</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full animate-pulse-glow" 
                    size="lg" 
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    disabled={loading}
                  >
                    Change Phone Number
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthWithOTP;
