import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

const HomeEventTeaser = () => {
  const { events, loading } = useEvents();

  if (loading) {
    return (
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mx-auto mb-8" />
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  // Show only the first 2 upcoming events as a teaser
  const teaserEvents = events.slice(0, 2);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8">
          Aankomende <span className="text-neon-gold">Events</span>
        </h2>

        <div className="space-y-4 mb-8">
          {teaserEvents.map((event, index) => {
            const eventDate = new Date(event.event_date);
            const formattedDate = eventDate.toLocaleDateString('nl-NL', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const formattedTime = eventDate.toLocaleTimeString('nl-NL', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={event.id}
                className={`p-4 sm:p-6 rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-300 ${
                  index === 0
                    ? "border-neon-pink/50 glow-pink"
                    : "border-border hover:border-neon-pink/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-neon-pink" />
                        <span className="capitalize">{formattedDate}</span>
                        <span className="text-neon-pink font-medium">{formattedTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-neon-blue" />
                        <span>{event.location_name}, {event.location_city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-neon-gold font-bold text-xl">
                    €{event.price_per_ticket}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/agenda"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full glow-pink hover:scale-105 transition-transform duration-300"
          >
            Bekijk agenda & reserveer
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeEventTeaser;
