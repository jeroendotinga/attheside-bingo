import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import SocialLinks from "@/components/SocialLinks";
import { Button } from "@/components/ui/button";
import { PartyPopper, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card opacity-80" />
      <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-pink/10 rounded-full blur-3xl animate-pulse-neon" />
      <div className="absolute bottom-1/4 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-neon" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-neon-gold/5 rounded-full blur-3xl animate-pulse-neon" style={{ animationDelay: "2s" }} />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        {/* Logo with enhanced glow */}
        <div className="relative inline-block mb-8 sm:mb-10">
          <div className="absolute inset-0 bg-neon-pink/30 blur-3xl rounded-full scale-125" />
          <img 
            src={logo} 
            alt="At The Side Bingo" 
            className="relative w-full max-w-sm sm:max-w-lg md:max-w-xl mx-auto animate-float drop-shadow-[0_0_40px_rgba(236,72,153,0.6)]" 
          />
        </div>
        
        {/* Main headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
          De leukste <span className="text-neon-pink">bingo-show</span> voor jouw event
        </h1>
        
        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2">
          At The Side Bingo is een interactieve bingo-ervaring met{" "}
          <span className="text-neon-blue font-semibold">muziek</span>,{" "}
          <span className="text-neon-gold font-semibold">humor</span> en{" "}
          <span className="text-neon-purple font-semibold">publieksinteractie</span>{" "}
          – perfect voor bedrijfsfeesten, borrels en events.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-10">
          <Link to="/contact">
            <Button 
              size="lg" 
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full glow-pink hover:scale-105 transition-transform duration-300 bg-primary text-primary-foreground"
            >
              <PartyPopper className="w-5 h-5 mr-2" />
              Boek At The Side Bingo
            </Button>
          </Link>
          <Link to="#hoe-werkt-het">
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Bekijk hoe het werkt
            </Button>
          </Link>
        </div>
        
        {/* Social Links */}
        <div className="flex justify-center">
          <SocialLinks iconSize="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
