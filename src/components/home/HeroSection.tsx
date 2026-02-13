import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight drop-shadow-lg">
          De leukste <span className="text-neon-pink">bingo-show</span> voor jouw event
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-14 px-2">
          Interactieve bingo met{" "}
          <span className="text-neon-blue font-semibold">muziek</span>,{" "}
          <span className="text-neon-gold font-semibold">humor</span> en{" "}
          <span className="text-neon-purple font-semibold">publieksinteractie</span>{" "}
          – perfect voor bedrijfsfeesten, borrels en events.
        </p>

        <Link to="/agenda">
          <Button
            size="lg"
            className="text-lg sm:text-xl px-10 sm:px-14 py-6 sm:py-8 rounded-full glow-pink hover:scale-105 transition-transform duration-300 bg-primary text-primary-foreground font-bold"
          >
            <PartyPopper className="w-6 h-6 mr-3" />
            Boek de BINGO
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
