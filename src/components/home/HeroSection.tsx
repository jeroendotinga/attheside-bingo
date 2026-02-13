import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PartyPopper, CalendarDays, MapPin } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

const HeroSection = () => {
  const { loading, getNextEvent } = useEvents();
  const nextEvent = getNextEvent();

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

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2">
          Interactieve bingo met{" "}
          <span className="text-neon-blue font-semibold">muziek</span>,{" "}
          <span className="text-neon-gold font-semibold">humor</span> en{" "}
          <span className="text-neon-purple font-semibold">publieksinteractie</span>{" "}
          – perfect voor bedrijfsfeesten, borrels en events.
        </p>

        {/* Next event info + CTA */}
        {!loading && nextEvent && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-2xl bg-card/80 backdrop-blur-sm border border-neon-pink/30 max-w-md mx-auto">
            <p className="text-xs sm:text-sm text-neon-pink font-semibold uppercase tracking-wider mb-2">
              Eerstvolgende event
            </p>
            <p className="text-lg sm:text-xl font-bold text-foreground mb-1">
              {nextEvent.title}
            </p>
            <div className="flex items-center justify-center gap-4 text-muted-foreground text-sm mb-1">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-neon-blue" />
                {format(new Date(nextEvent.event_date), "d MMMM yyyy", { locale: nl })}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-neon-gold" />
                {nextEvent.location_city}
              </span>
            </div>
          </div>
        )}

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
