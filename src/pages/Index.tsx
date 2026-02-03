import Navigation from "@/components/Navigation";
import HomeHero from "@/components/HomeHero";
import HomepageIntro from "@/components/HomepageIntro";
import HowItWorks from "@/components/HowItWorks";
import HomeEventTeaser from "@/components/HomeEventTeaser";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      
      {/* Spacer for fixed nav */}
      <div className="h-16 sm:h-20" />
      
      <HomeHero />
      <HomepageIntro />
      <HowItWorks />
      <HomeEventTeaser />
      <Footer />
    </main>
  );
};

export default Index;
