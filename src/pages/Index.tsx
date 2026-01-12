import Hero from "@/components/Hero";
import Features from "@/components/Features";
import EventInfo from "@/components/EventInfo";
import RegistrationForm from "@/components/RegistrationForm";
import Terms from "@/components/Terms";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Hero />
      <Features />
      <EventInfo />
      <RegistrationForm />
      <Terms />
      <Footer />
    </main>
  );
};

export default Index;
