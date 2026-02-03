import Navigation from "@/components/Navigation";
import HeroSection from "@/components/home/HeroSection";
import WhatIsSection from "@/components/home/WhatIsSection";
import ForWhoSection from "@/components/home/ForWhoSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import CtaSection from "@/components/home/CtaSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      
      {/* Spacer for fixed nav */}
      <div className="h-16 sm:h-20" />
      
      <HeroSection />
      <WhatIsSection />
      <ForWhoSection />
      <HowItWorksSection />
      <WhyUsSection />
      <ReviewsSection />
      <CtaSection />
      <Footer />
    </main>
  );
};

export default Index;
