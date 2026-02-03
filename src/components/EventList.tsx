import { Calendar, MapPin, Euro, Users, ExternalLink, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from '@/hooks/useEvents';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface EventListProps {
  events: Event[];
  onSelectEvent: (eventId: string) => void;
}

const EventCard = ({ event, onSelect, isFirst }: { event: Event; onSelect: () => void; isFirst: boolean }) => {
  const { data: ticketsSold } = useQuery({
    queryKey: ['ticketsSold', event.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_tickets_sold_for_event', {
        event_uuid: event.id,
      });
      if (error) throw error;
      return data || 0;
    },
  });

  const eventDate = new Date(event.event_date);
  const dayName = eventDate.toLocaleDateString('nl-NL', { weekday: 'long' });
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('nl-NL', { month: 'short' }).toUpperCase();
  const time = eventDate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

  const getTicketsRemaining = () => {
    if (!event.max_tickets) return null;
    return event.max_tickets - (ticketsSold || 0);
  };

  const getAvailabilityStatus = () => {
    const remaining = getTicketsRemaining();
    if (remaining === null) return { text: 'Beschikbaar', color: 'text-green-400', badge: 'bg-green-400/10 border-green-400/30' };
    if (remaining <= 0) return { text: 'Uitverkocht', color: 'text-red-400', badge: 'bg-red-400/10 border-red-400/30' };
    if (remaining <= 10) return { text: `Nog ${remaining}!`, color: 'text-neon-gold', badge: 'bg-neon-gold/10 border-neon-gold/30' };
    return { text: `${remaining} over`, color: 'text-green-400', badge: 'bg-green-400/10 border-green-400/30' };
  };

  const getMapsUrl = () => {
    const query = encodeURIComponent(`${event.location_name}, ${event.location_address}, ${event.location_city}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const status = getAvailabilityStatus();
  const isSoldOut = getTicketsRemaining() === 0;

  return (
    <div className={`
      relative bg-card border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl
      ${isFirst ? 'border-neon-pink/50 glow-pink' : 'border-border hover:border-neon-pink/30'}
    `}>
      {isFirst && (
        <div className="absolute top-0 left-0 right-0 bg-neon-pink text-primary-foreground text-center py-1.5 text-xs font-bold">
          🎉 EERSTVOLGENDE EVENT
        </div>
      )}
      
      <div className={`flex flex-col sm:flex-row ${isFirst ? 'pt-8' : ''}`}>
        {/* Date Badge */}
        <div className="sm:w-32 p-4 sm:p-6 flex sm:flex-col items-center sm:items-center justify-center gap-3 sm:gap-1 bg-muted/50 border-b sm:border-b-0 sm:border-r border-border">
          <div className="text-center">
            <span className="block text-3xl sm:text-4xl font-bold text-foreground">{day}</span>
            <span className="block text-sm font-medium text-neon-pink">{month}</span>
          </div>
          <span className="text-xs text-muted-foreground capitalize sm:mt-1">{dayName}</span>
        </div>

        {/* Event Details */}
        <div className="flex-1 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-3">{event.title}</h3>
              
              {/* Description if available */}
              {(event as Event & { description?: string }).description && (
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {(event as Event & { description?: string }).description}
                </p>
              )}

              <div className="space-y-2">
                {/* Time */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-neon-pink" />
                  <span className="font-medium text-foreground">{time}</span>
                  <span>uur</span>
                </div>

                {/* Location */}
                <a 
                  href={getMapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-neon-blue transition-colors group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MapPin className="w-4 h-4 text-neon-blue" />
                  <span className="group-hover:text-neon-blue transition-colors">
                    {event.location_name}, {event.location_city}
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                {/* Availability */}
                <div className="flex items-center gap-2 text-sm">
                  <Users className={`w-4 h-4 ${status.color}`} />
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${status.badge} ${status.color}`}>
                    {status.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Price and Action */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
              <div className="flex items-center gap-1">
                <Euro className="w-5 h-5 text-neon-gold" />
                <span className="text-2xl font-bold text-neon-gold">{event.price_per_ticket}</span>
              </div>
              
              <Button
                onClick={onSelect}
                disabled={isSoldOut}
                className={`
                  px-6 py-2 font-bold rounded-full transition-all duration-300
                  ${isSoldOut 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground glow-pink hover:scale-105'
                  }
                `}
              >
                <Ticket className="w-4 h-4 mr-2" />
                {isSoldOut ? 'Uitverkocht' : 'Reserveer'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventList = ({ events, onSelectEvent }: EventListProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {events.map((event, index) => (
        <EventCard
          key={event.id}
          event={event}
          onSelect={() => onSelectEvent(event.id)}
          isFirst={index === 0}
        />
      ))}
    </div>
  );
};

export default EventList;
