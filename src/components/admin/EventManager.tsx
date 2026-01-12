import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAllEvents, Event } from '@/hooks/useEvents';
import { Plus, Pencil, Trash2, Ticket } from 'lucide-react';

interface EventWithStats extends Event {
  tickets_sold: number;
  revenue: number;
}

const EventManager = () => {
  const { events, loading, fetchEvents } = useAllEvents();
  const [eventsWithStats, setEventsWithStats] = useState<EventWithStats[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    event_time: '20:00',
    location_name: '',
    location_address: '',
    location_city: '',
    price_per_ticket: '20',
    max_tickets: '',
    is_active: true,
  });

  // Fetch ticket stats for each event
  useEffect(() => {
    const fetchStats = async () => {
      if (events.length === 0) {
        setEventsWithStats([]);
        return;
      }

      const { data: registrations } = await supabase
        .from('registrations')
        .select('event_id, aantal_kaarten, totaal_prijs');

      const statsMap = new Map<string, { tickets: number; revenue: number }>();
      
      registrations?.forEach((reg) => {
        if (reg.event_id) {
          const existing = statsMap.get(reg.event_id) || { tickets: 0, revenue: 0 };
          statsMap.set(reg.event_id, {
            tickets: existing.tickets + reg.aantal_kaarten,
            revenue: existing.revenue + Number(reg.totaal_prijs),
          });
        }
      });

      const enrichedEvents = events.map((event) => ({
        ...event,
        tickets_sold: statsMap.get(event.id)?.tickets || 0,
        revenue: statsMap.get(event.id)?.revenue || 0,
      }));

      setEventsWithStats(enrichedEvents);
    };

    fetchStats();
  }, [events]);

  const resetForm = () => {
    setFormData({
      title: '',
      event_date: '',
      event_time: '20:00',
      location_name: '',
      location_address: '',
      location_city: '',
      price_per_ticket: '20',
      max_tickets: '',
      is_active: true,
    });
    setEditingEvent(null);
  };

  const openNewEventDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    const eventDate = new Date(event.event_date);
    setEditingEvent(event);
    setFormData({
      title: event.title,
      event_date: eventDate.toISOString().split('T')[0],
      event_time: eventDate.toTimeString().slice(0, 5),
      location_name: event.location_name,
      location_address: event.location_address,
      location_city: event.location_city,
      price_per_ticket: event.price_per_ticket.toString(),
      max_tickets: event.max_tickets?.toString() || '',
      is_active: event.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventDateTime = new Date(`${formData.event_date}T${formData.event_time}`);
    
    const eventData = {
      title: formData.title,
      event_date: eventDateTime.toISOString(),
      location_name: formData.location_name,
      location_address: formData.location_address,
      location_city: formData.location_city,
      price_per_ticket: parseFloat(formData.price_per_ticket),
      max_tickets: formData.max_tickets ? parseInt(formData.max_tickets) : null,
      is_active: formData.is_active,
    };

    if (editingEvent) {
      const { error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', editingEvent.id);

      if (error) {
        toast({ title: 'Fout bij bijwerken', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Event bijgewerkt!' });
    } else {
      const { error } = await supabase.from('events').insert(eventData);

      if (error) {
        toast({ title: 'Fout bij aanmaken', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Event aangemaakt!' });
    }

    setIsDialogOpen(false);
    resetForm();
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit event wilt verwijderen?')) return;

    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      toast({ title: 'Fout bij verwijderen', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Event verwijderd' });
    fetchEvents();
  };

  const totalTicketsSold = eventsWithStats.reduce((sum, e) => sum + e.tickets_sold, 0);
  const totalRevenue = eventsWithStats.reduce((sum, e) => sum + e.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <p className="text-muted-foreground text-xs sm:text-sm">Totaal Events</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{eventsWithStats.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <p className="text-muted-foreground text-xs sm:text-sm">Actieve Events</p>
          <p className="text-2xl sm:text-3xl font-bold text-neon-blue">{eventsWithStats.filter(e => e.is_active).length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
          <p className="text-muted-foreground text-xs sm:text-sm">Totaal Tickets Verkocht</p>
          <p className="text-2xl sm:text-3xl font-bold text-neon-pink">{totalTicketsSold}</p>
        </div>
        <div className="bg-card border border-neon-gold/30 rounded-xl p-4 sm:p-6">
          <p className="text-muted-foreground text-xs sm:text-sm">Totaal Omzet</p>
          <p className="text-2xl sm:text-3xl font-bold text-neon-gold">€{totalRevenue}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Evenementen</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewEventDialog} className="bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nieuw Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Event Bewerken' : 'Nieuw Event'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-input"
                  placeholder="De Grote Bingo Sing a Long Show"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Datum</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    required
                    className="bg-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_time">Tijd</Label>
                  <Input
                    id="event_time"
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    required
                    className="bg-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_name">Locatie naam</Label>
                <Input
                  id="location_name"
                  value={formData.location_name}
                  onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                  required
                  className="bg-input"
                  placeholder="Wapen van Diemen"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_address">Adres</Label>
                <Input
                  id="location_address"
                  value={formData.location_address}
                  onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                  required
                  className="bg-input"
                  placeholder="Ouderkerkerlaan 8"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_city">Postcode & Plaats</Label>
                <Input
                  id="location_city"
                  value={formData.location_city}
                  onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                  required
                  className="bg-input"
                  placeholder="1112 BE Diemen"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_per_ticket">Prijs per kaart (€)</Label>
                  <Input
                    id="price_per_ticket"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_per_ticket}
                    onChange={(e) => setFormData({ ...formData, price_per_ticket: e.target.value })}
                    required
                    className="bg-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_tickets">Max kaarten (optioneel)</Label>
                  <Input
                    id="max_tickets"
                    type="number"
                    min="1"
                    value={formData.max_tickets}
                    onChange={(e) => setFormData({ ...formData, max_tickets: e.target.value })}
                    className="bg-input"
                    placeholder="Onbeperkt"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
                />
                <Label htmlFor="is_active">Event actief (zichtbaar op website)</Label>
              </div>

              <Button type="submit" className="w-full bg-primary">
                {editingEvent ? 'Opslaan' : 'Event Aanmaken'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-foreground">Event</TableHead>
              <TableHead className="text-foreground">Datum</TableHead>
              <TableHead className="text-foreground hidden md:table-cell">Locatie</TableHead>
              <TableHead className="text-foreground text-center">Tickets</TableHead>
              <TableHead className="text-foreground text-right">Omzet</TableHead>
              <TableHead className="text-foreground text-center">Status</TableHead>
              <TableHead className="text-foreground text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Laden...
                </TableCell>
              </TableRow>
            ) : eventsWithStats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nog geen events
                </TableCell>
              </TableRow>
            ) : (
              eventsWithStats.map((event) => (
                <TableRow key={event.id} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    <div>
                      <p>{event.title}</p>
                      <p className="text-xs text-muted-foreground">€{event.price_per_ticket} per ticket</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(event.event_date).toLocaleDateString('nl-NL', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{event.location_name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Ticket className="w-4 h-4 text-neon-pink" />
                      <span className="font-semibold text-neon-pink">{event.tickets_sold}</span>
                      {event.max_tickets && (
                        <span className="text-muted-foreground text-sm">/ {event.max_tickets}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-neon-gold">
                    €{event.revenue}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      event.is_active 
                        ? 'bg-neon-blue/20 text-neon-blue' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {event.is_active ? 'Actief' : 'Inactief'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(event)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EventManager;
