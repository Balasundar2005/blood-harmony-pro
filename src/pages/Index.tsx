import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UserTypes from "@/components/UserTypes";
import HowItWorks from "@/components/HowItWorks";
import BloodInventory from "@/components/BloodInventory";
import AwarenessSection from "@/components/AwarenessSection";
import BloodRequestForm from "@/components/BloodRequestForm";
import DonorRegistrationForm from "@/components/DonorRegistrationForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <UserTypes />
      <HowItWorks />
      <BloodInventory />
      <AwarenessSection />
      <BloodRequestForm />
      <DonorRegistrationForm />
      <Footer />
    </div>
  );
};

export default Index;
