import { Calendar, MapPin, Ticket, Euro, ShoppingCart } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

const EventInfo = () => {
  const { events, loading, getNextEvent } = useEvents();
  const nextEvent = getNextEvent();

  if (loading) {
    return (
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-card/50 relative">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-64 mx-auto mb-12" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!nextEvent) {
    return null;
  }

  const eventDate = new Date(nextEvent.event_date);
  const dayName = eventDate.toLocaleDateString('nl-NL', { weekday: 'long' });
  const formattedDate = eventDate.toLocaleDateString('nl-NL', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  const formattedTime = eventDate.toLocaleTimeString('nl-NL', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const scrollToRegistration = () => {
    const element = document.getElementById('aanmelden');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 bg-card/50 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/5 via-transparent to-neon-blue/5" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
          Eerstvolgende <span className="text-neon-gold">Event</span>
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl border border-border bg-background/50 backdrop-blur-sm">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-neon-pink mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Datum</h3>
            <p className="text-lg sm:text-xl font-bold text-foreground">{formattedDate}</p>
            <p className="text-muted-foreground text-sm capitalize">{dayName} {formattedTime}</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl border border-border bg-background/50 backdrop-blur-sm">
            <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-neon-blue mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Locatie</h3>
            <p className="text-lg sm:text-xl font-bold text-foreground">{nextEvent.location_name}</p>
            <p className="text-muted-foreground text-xs sm:text-sm">{nextEvent.location_address}</p>
            <p className="text-muted-foreground text-xs sm:text-sm">{nextEvent.location_city}</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl border border-neon-gold/30 bg-neon-gold/5 backdrop-blur-sm">
            <Euro className="w-10 h-10 sm:w-12 sm:h-12 text-neon-gold mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Prijs</h3>
            <p className="text-2xl sm:text-3xl font-bold text-neon-gold">€{nextEvent.price_per_ticket}</p>
            <p className="text-muted-foreground text-sm">per kaartje</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl border border-border bg-background/50 backdrop-blur-sm">
            <Ticket className="w-10 h-10 sm:w-12 sm:h-12 text-neon-purple mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Beschikbaar</h3>
            <p className="text-2xl sm:text-3xl font-bold text-neon-purple">
              {nextEvent.max_tickets ? nextEvent.max_tickets : '∞'}
            </p>
            <p className="text-muted-foreground text-sm">
              {nextEvent.max_tickets ? 'kaarten max' : 'onbeperkt'}
            </p>
          </div>

          <div 
            onClick={scrollToRegistration}
            className="flex flex-col items-center justify-center text-center p-4 sm:p-6 rounded-xl border border-neon-pink/50 bg-neon-pink/10 backdrop-blur-sm cursor-pointer hover:bg-neon-pink/20 hover:border-neon-pink/70 transition-all duration-300 col-span-2 lg:col-span-1 glow-pink"
          >
            <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-neon-pink mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-neon-pink">Koop je tickets</h3>
            <p className="text-muted-foreground text-sm mt-1">Reserveer nu!</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm sm:text-lg font-bold">
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-neon-pink/20 text-neon-pink border border-neon-pink/30">
            Bingo
          </span>
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
            Karaoke
          </span>
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-neon-gold/20 text-neon-gold border border-neon-gold/30">
            Meezingen
          </span>
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
            Feest
          </span>
        </div>
      </div>
    </section>
  );
};

export default EventInfo;
