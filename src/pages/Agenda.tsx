import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Terms from "@/components/Terms";
import RegistrationForm from "@/components/RegistrationForm";
import { Calendar, MapPin, Euro, ChevronRight } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const Agenda = () => {
  const { events, loading } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const scrollToRegistration = (eventId: string) => {
    setSelectedEventId(eventId);
    window.location.hash = `aanmelden?event=${eventId}`;
    const element = document.getElementById('aanmelden');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      
      {/* Spacer for fixed nav */}
      <div className="h-16 sm:h-20" />

      {/* Page Header */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          <span className="text-neon-gold">Agenda</span> & Reserveren
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Bekijk alle aankomende events en reserveer direct je tickets
        </p>
      </section>

      {/* Events Timeline */}
      <section className="pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Er zijn momenteel geen events gepland.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-pink via-neon-blue to-neon-purple" />
              
              <div className="space-y-4">
                {events.map((event, index) => {
                  const eventDate = new Date(event.event_date);
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

                  const isFirstEvent = index === 0;

                  return (
                    <div 
                      key={event.id}
                      onClick={() => scrollToRegistration(event.id)}
                      className="relative pl-10 sm:pl-14 cursor-pointer group"
                    >
                      {/* Timeline dot */}
                      <div className={`absolute left-2 sm:left-4 top-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-background border-2 transition-all duration-300 z-10 ${
                        isFirstEvent 
                          ? "border-neon-pink bg-neon-pink/20" 
                          : "border-neon-blue group-hover:border-neon-pink group-hover:bg-neon-pink/20"
                      }`} />
                      
                      <div className={`p-4 sm:p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg ${
                        isFirstEvent 
                          ? "border-neon-pink/50 bg-card glow-pink" 
                          : "border-border bg-card/50 hover:border-neon-pink/30 group-hover:shadow-neon-pink/10"
                      }`}>
                        {isFirstEvent && (
                          <span className="inline-block px-2 py-0.5 mb-2 text-xs font-bold text-neon-pink bg-neon-pink/10 border border-neon-pink/30 rounded-full">
                            Eerstvolgende
                          </span>
                        )}
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-neon-pink transition-colors">
                              {event.title}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-neon-pink" />
                                <span className="capitalize">{dayName}</span>
                                <span>{formattedDate}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-neon-pink font-semibold">{formattedTime}</span>
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
                              <span className="text-sm font-medium">Reserveer</span>
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
          )}
        </div>
      </section>

      {/* Registration Form */}
      <RegistrationForm />

      {/* Terms */}
      <Terms />

      <Footer />
    </main>
  );
};

export default Agenda;
