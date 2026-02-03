import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Euro, Users, ExternalLink, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Event } from '@/hooks/useEvents';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface EventCalendarProps {
  events: Event[];
  onSelectEvent: (eventId: string) => void;
}

const DAYS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
const MONTHS = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december'
];

const EventCalendar = ({ events, onSelectEvent }: EventCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fetch tickets sold for selected event
  const { data: ticketsSold } = useQuery({
    queryKey: ['ticketsSold', selectedEvent?.id],
    queryFn: async () => {
      if (!selectedEvent?.id) return 0;
      const { data, error } = await supabase.rpc('get_tickets_sold_for_event', {
        event_uuid: selectedEvent.id,
      });
      if (error) throw error;
      return data || 0;
    },
    enabled: !!selectedEvent?.id,
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get day of week (0 = Sunday, adjust for Monday start)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek < 0) startDayOfWeek = 6;
    
    const days: (number | null)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }, [currentMonth, currentYear]);

  const eventsByDay = useMemo(() => {
    const map: Record<number, Event[]> = {};
    events.forEach(event => {
      const eventDate = new Date(event.event_date);
      if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
        const day = eventDate.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(event);
      }
    });
    return map;
  }, [events, currentMonth, currentYear]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleReserveer = () => {
    if (selectedEvent) {
      onSelectEvent(selectedEvent.id);
      setSelectedEvent(null);
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };

  const getTicketsRemaining = () => {
    if (!selectedEvent?.max_tickets) return null;
    return selectedEvent.max_tickets - (ticketsSold || 0);
  };

  const getAvailabilityStatus = () => {
    const remaining = getTicketsRemaining();
    if (remaining === null) return { text: 'Beschikbaar', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' };
    if (remaining <= 0) return { text: 'Uitverkocht', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' };
    if (remaining <= 10) return { text: `Nog ${remaining} tickets!`, color: 'text-neon-gold', bg: 'bg-neon-gold/10 border-neon-gold/30' };
    return { text: `${remaining} tickets beschikbaar`, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' };
  };

  const getMapsUrl = (event: Event) => {
    const query = encodeURIComponent(`${event.location_name}, ${event.location_address}, ${event.location_city}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-muted/30">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
            className="hover:bg-muted"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <h3 className="text-lg sm:text-xl font-bold text-foreground capitalize">
            {MONTHS[currentMonth]} {currentYear}
          </h3>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            className="hover:bg-muted"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="p-2 sm:p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayEvents = day ? eventsByDay[day] || [] : [];
              const hasEvents = dayEvents.length > 0;
              
              return (
                <div
                  key={index}
                  className={`
                    aspect-square sm:aspect-[4/3] p-1 sm:p-2 rounded-lg relative
                    ${day ? 'bg-muted/20' : ''}
                    ${isToday(day as number) ? 'ring-2 ring-neon-pink' : ''}
                    ${hasEvents ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}
                  `}
                  onClick={() => hasEvents && handleEventClick(dayEvents[0])}
                >
                  {day && (
                    <>
                      <span className={`
                        text-xs sm:text-sm font-medium
                        ${isToday(day) ? 'text-neon-pink' : 'text-foreground'}
                      `}>
                        {day}
                      </span>
                      
                      {hasEvents && (
                        <div className="absolute bottom-1 left-1 right-1">
                          <div className="w-full h-1.5 sm:h-2 bg-neon-pink rounded-full animate-pulse" />
                          {dayEvents.length > 1 && (
                            <span className="absolute -top-3 right-0 text-[10px] text-neon-pink font-bold">
                              +{dayEvents.length - 1}
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="px-4 sm:px-6 pb-4 flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1.5 bg-neon-pink rounded-full" />
            <span>Event gepland</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded ring-2 ring-neon-pink" />
            <span>Vandaag</span>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  {selectedEvent.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Date & Time */}
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-neon-pink shrink-0" />
                  <div>
                    <p className="text-foreground font-medium">
                      {new Date(selectedEvent.event_date).toLocaleDateString('nl-NL', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm">
                      {new Date(selectedEvent.event_date).toLocaleTimeString('nl-NL', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })} uur
                    </p>
                  </div>
                </div>

                {/* Location with map link */}
                <a 
                  href={getMapsUrl(selectedEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <MapPin className="w-5 h-5 text-neon-blue shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-foreground font-medium group-hover:text-neon-blue transition-colors">
                      {selectedEvent.location_name}
                    </p>
                    <p className="text-sm">{selectedEvent.location_address}</p>
                    <p className="text-sm">{selectedEvent.location_city}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-neon-blue" />
                </a>

                {/* Description */}
                {(selectedEvent as Event & { description?: string }).description && (
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-muted-foreground text-sm">
                      {(selectedEvent as Event & { description?: string }).description}
                    </p>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-3">
                  <Euro className="w-5 h-5 text-neon-gold shrink-0" />
                  <span className="text-2xl font-bold text-neon-gold">
                    €{selectedEvent.price_per_ticket}
                  </span>
                  <span className="text-muted-foreground text-sm">per ticket</span>
                </div>

                {/* Availability */}
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${getAvailabilityStatus().bg}`}>
                  <Users className={`w-5 h-5 ${getAvailabilityStatus().color}`} />
                  <span className={`font-medium ${getAvailabilityStatus().color}`}>
                    {getAvailabilityStatus().text}
                  </span>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleReserveer}
                  disabled={getTicketsRemaining() === 0}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-xl glow-pink transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  Reserveer tickets
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCalendar;
