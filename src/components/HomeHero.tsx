import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import SocialLinks from "@/components/SocialLinks";

const HomeHero = () => {
  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 py-12 sm:py-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card opacity-80" />
      <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-pink/10 rounded-full blur-3xl animate-pulse-neon" />
      <div className="absolute bottom-1/4 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-neon" style={{ animationDelay: "1s" }} />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        {/* Logo with glow effect */}
        <div className="relative inline-block mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-neon-pink/20 blur-3xl rounded-full scale-110" />
          <img 
            src={logo} 
            alt="At The Side Bingo" 
            className="relative w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto animate-float drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]" 
          />
        </div>
        
        <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 mb-2 sm:mb-4 font-medium px-2">
          Dit is geen gewone bingo…
        </p>
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-neon-pink mb-6 sm:mb-8">
          dit is een feest.
        </p>
        
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
          Een avond vol muziek, interactie en gezelligheid waar alles door elkaar loopt: 
          <span className="text-neon-pink font-semibold"> bingo</span>, 
          <span className="text-neon-blue font-semibold"> meezingen</span>, 
          <span className="text-neon-gold font-semibold"> karaoke</span> en 
          <span className="text-neon-purple font-semibold"> dansen</span>.
        </p>
        
        {/* Social Links */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <SocialLinks iconSize="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        
        <Link 
          to="/agenda"
          className="inline-block mt-8 sm:mt-10 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-bold text-base sm:text-lg rounded-full glow-pink hover:scale-105 transition-transform duration-300"
        >
          Bekijk agenda & koop tickets
        </Link>
      </div>
    </section>
  );
};

export default HomeHero;
