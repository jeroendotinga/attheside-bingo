import { Calendar, MapPin, Euro, ChevronRight } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

const UpcomingEvents = () => {
  const { events, loading } = useEvents();
  
  // Get all events except the first one (which is shown in EventInfo)
  const upcomingEvents = events.slice(1);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (upcomingEvents.length === 0) {
    return null;
  }

  const scrollToRegistration = (eventId: string) => {
    // Set the event ID in the URL hash
    window.location.hash = `aanmelden?event=${eventId}`;
    const element = document.getElementById('aanmelden');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 text-center">
          Meer <span className="text-neon-blue">Evenementen</span>
        </h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-pink via-neon-blue to-neon-purple" />
          
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => {
              const eventDate = new Date(event.event_date);
              const dayName = eventDate.toLocaleDateString('nl-NL', { weekday: 'short' });
              const formattedDate = eventDate.toLocaleDateString('nl-NL', { 
                day: 'numeric', 
                month: 'short',
                year: 'numeric'
              });
              const formattedTime = eventDate.toLocaleTimeString('nl-NL', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });

              return (
                <div 
                  key={event.id}
                  onClick={() => scrollToRegistration(event.id)}
                  className="relative pl-10 sm:pl-14 cursor-pointer group"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2 sm:left-4 top-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-background border-2 border-neon-blue group-hover:border-neon-pink group-hover:bg-neon-pink/20 transition-all duration-300 z-10" />
                  
                  <div className="p-4 sm:p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:border-neon-pink/50 hover:bg-card/80 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-neon-pink/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-neon-pink transition-colors">
                          {event.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-neon-pink" />
                            <span className="capitalize">{dayName} {formattedDate}</span>
                            <span className="text-neon-pink font-medium">{formattedTime}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-neon-blue" />
                            <span>{event.location_name}, {event.location_city}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neon-gold/10 border border-neon-gold/30">
                          <Euro className="w-4 h-4 text-neon-gold" />
                          <span className="text-lg font-bold text-neon-gold">{event.price_per_ticket}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-neon-pink group-hover:translate-x-1 transition-transform">
                          <span className="text-sm font-medium hidden sm:inline">Tickets</span>
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
