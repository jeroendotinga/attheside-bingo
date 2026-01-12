import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Send, CheckCircle, Ticket, Loader2, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEvents, Event } from "@/hooks/useEvents";

const RegistrationForm = () => {
  const { events, loading: eventsLoading, getNextEvent } = useEvents();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    naam: "",
    telefoon: "",
    aantalKaarten: "1",
    email: "",
  });
  const [website, setWebsite] = useState("");

  // Check for event ID in URL hash and select it
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const eventMatch = hash.match(/event=([^&]+)/);
      if (eventMatch && events.length > 0) {
        const eventId = eventMatch[1];
        const event = events.find(e => e.id === eventId);
        if (event) {
          setSelectedEvent(event);
        }
      }
    };

    // Check on mount and when hash changes
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [events]);

  // Set default event if none selected
  useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      // Only set default if no event in URL
      const hash = window.location.hash;
      if (!hash.includes('event=')) {
        const nextEvent = getNextEvent();
        if (nextEvent) {
          setSelectedEvent(nextEvent);
        }
      }
    }
  }, [events, selectedEvent, getNextEvent]);

  const totalPrice = useMemo(() => {
    const amount = parseInt(formData.aantalKaarten) || 0;
    const pricePerTicket = selectedEvent?.price_per_ticket || 20;
    return amount * pricePerTicket;
  }, [formData.aantalKaarten, selectedEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (website) {
      setIsSubmitted(true);
      return;
    }

    if (!selectedEvent) {
      toast({
        title: "Selecteer een event",
        description: "Kies eerst een event waarvoor je tickets wilt kopen.",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Voorwaarden accepteren",
        description: "Je moet de algemene voorwaarden accepteren om door te gaan.",
        variant: "destructive",
      });
      return;
    }
    
    const amount = parseInt(formData.aantalKaarten) || 0;
    
    if (amount < 1) {
      toast({
        title: "Ongeldig aantal",
        description: "Selecteer minimaal 1 kaartje.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("registrations").insert({
      naam: formData.naam,
      email: formData.email,
      telefoon: formData.telefoon,
      aantal_kaarten: amount,
      totaal_prijs: totalPrice,
      event_id: selectedEvent.id,
    });

    if (error) {
      setIsLoading(false);
      toast({
        title: "Er ging iets mis",
        description: "Probeer het later opnieuw of neem contact met ons op.",
        variant: "destructive",
      });
      return;
    }

    supabase.functions.invoke("notify-registration", {
      body: {
        naam: formData.naam,
        email: formData.email,
        telefoon: formData.telefoon,
        aantalKaarten: amount,
        totaalPrijs: totalPrice,
        eventTitle: selectedEvent.title,
        eventDate: new Date(selectedEvent.event_date).toLocaleDateString('nl-NL', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      },
    }).catch(err => {
      console.error("Failed to send notification email:", err);
    });

    setIsLoading(false);
    setIsSubmitted(true);
    toast({
      title: "Aanmelding ontvangen!",
      description: `Dank voor je aanmelding voor ${amount} kaart${amount > 1 ? 'en' : ''} (€${totalPrice}). Check je email voor de betaallink.`,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSubmitted) {
    return (
      <section id="aanmelden" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          <div className="bg-card border border-neon-pink/30 rounded-2xl p-6 sm:p-8 text-center glow-pink">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-neon-pink mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Bedankt voor je aanmelding!</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Dank voor je aanmelding. In de mail krijg je een bevestiging met daarin een betaallink.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="aanmelden" className="py-12 sm:py-20 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-pink/5 to-transparent" />
      
      <div className="max-w-xl mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-4">
          <span className="text-neon-pink">Aanmelden</span>
        </h2>
        <p className="text-muted-foreground text-center mb-6 sm:mb-8 text-sm sm:text-base">
          Reserveer je plek voor het feest!
        </p>
        
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-5 sm:p-8 space-y-4 sm:space-y-6">
          {/* Event Selection */}
          <div className="space-y-2">
            <Label htmlFor="event" className="text-foreground text-sm sm:text-base">Kies je event</Label>
            {eventsLoading ? (
              <div className="h-10 bg-input rounded-md animate-pulse" />
            ) : (
              <Select
                value={selectedEvent?.id || ""}
                onValueChange={(value) => {
                  const event = events.find(e => e.id === value);
                  setSelectedEvent(event || null);
                }}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Selecteer een event" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {events.map((event) => {
                    const eventDate = new Date(event.event_date);
                    return (
                      <SelectItem key={event.id} value={event.id}>
                        <div className="flex items-center gap-2">
                          <span>{event.title}</span>
                          <span className="text-muted-foreground text-xs">
                            - {eventDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Selected Event Info */}
          {selectedEvent && (
            <div className="bg-neon-gold/10 border border-neon-gold/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-neon-gold" />
                <span className="text-foreground">
                  {new Date(selectedEvent.event_date).toLocaleDateString('nl-NL', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-neon-blue" />
                <span className="text-foreground">{selectedEvent.location_name}, {selectedEvent.location_city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-neon-gold" />
                <span className="font-semibold">
                  <span className="text-neon-gold text-lg">€{selectedEvent.price_per_ticket}</span>
                  <span className="text-muted-foreground text-sm ml-1">per kaartje</span>
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="naam" className="text-foreground text-sm sm:text-base">Naam</Label>
            <Input
              id="naam"
              name="naam"
              type="text"
              required
              value={formData.naam}
              onChange={handleChange}
              className="bg-input border-border focus:border-neon-pink focus:ring-neon-pink/20 text-base"
              placeholder="Jouw naam"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground text-sm sm:text-base">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-input border-border focus:border-neon-pink focus:ring-neon-pink/20 text-base"
              placeholder="jouw@email.nl"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefoon" className="text-foreground text-sm sm:text-base">Telefoon</Label>
            <Input
              id="telefoon"
              name="telefoon"
              type="tel"
              required
              value={formData.telefoon}
              onChange={handleChange}
              className="bg-input border-border focus:border-neon-pink focus:ring-neon-pink/20 text-base"
              placeholder="06-12345678"
            />
          </div>
          
          {/* Honeypot */}
          <div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
            <Label htmlFor="website">Website (laat dit veld leeg)</Label>
            <Input
              id="website"
              name="website"
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aantalKaarten" className="text-foreground text-sm sm:text-base">
              Aantal kaarten
            </Label>
            <Input
              id="aantalKaarten"
              name="aantalKaarten"
              type="number"
              min="1"
              required
              value={formData.aantalKaarten}
              onChange={handleChange}
              className="bg-input border-border focus:border-neon-pink focus:ring-neon-pink/20 text-base"
              placeholder="1"
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-xl border border-border">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="mt-0.5"
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              Ik heb de <a href="#voorwaarden" className="text-neon-pink hover:underline">algemene voorwaarden</a> gelezen en ga hiermee akkoord
            </Label>
          </div>
          
          {/* Total price display */}
          <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
            <span className="text-foreground font-medium">Totaal:</span>
            <span className="text-2xl sm:text-3xl font-bold text-neon-pink">€{totalPrice}</span>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !selectedEvent}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-5 sm:py-6 text-base sm:text-lg rounded-xl glow-pink transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                Bezig met aanmelden...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Aanmelden – €{totalPrice}
              </>
            )}
          </Button>
          
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Na aanmelding ontvang je een bevestiging met betaallink per email.
          </p>
        </form>
      </div>
    </section>
  );
};

export default RegistrationForm;
