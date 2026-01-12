import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Send, CheckCircle, Ticket, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PRICE_PER_TICKET = 20;
const MAX_TICKETS = 100;

const RegistrationForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [formData, setFormData] = useState({
    naam: "",
    telefoon: "",
    aantalKaarten: "1",
    email: "",
  });

  // Fetch current ticket count
  useEffect(() => {
    const fetchTicketCount = async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("aantal_kaarten");
      
      if (!error && data) {
        const total = data.reduce((sum, reg) => sum + reg.aantal_kaarten, 0);
        setTicketsSold(total);
      }
    };

    fetchTicketCount();
  }, []);

  const ticketsRemaining = MAX_TICKETS - ticketsSold;

  const totalPrice = useMemo(() => {
    const amount = parseInt(formData.aantalKaarten) || 0;
    return amount * PRICE_PER_TICKET;
  }, [formData.aantalKaarten]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(formData.aantalKaarten) || 0;
    
    if (amount < 1 || amount > 10) {
      toast({
        title: "Ongeldig aantal",
        description: "Je kunt maximaal 10 kaarten per aanmelding bestellen.",
        variant: "destructive",
      });
      return;
    }

    if (amount > ticketsRemaining) {
      toast({
        title: "Niet genoeg kaarten",
        description: `Er zijn nog maar ${ticketsRemaining} kaarten beschikbaar.`,
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
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Er ging iets mis",
        description: "Probeer het later opnieuw of neem contact met ons op.",
        variant: "destructive",
      });
      return;
    }

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
        
        {/* Price and availability info banner */}
        <div className="bg-neon-gold/10 border border-neon-gold/30 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-neon-gold" />
            <span className="text-foreground font-semibold">
              <span className="text-neon-gold text-lg sm:text-xl">€20</span> per kaartje
            </span>
          </div>
          <span className="hidden sm:inline text-muted-foreground">·</span>
          <span className={`font-semibold ${ticketsRemaining < 20 ? 'text-neon-pink' : 'text-muted-foreground'}`}>
            Nog {ticketsRemaining} van {MAX_TICKETS} kaarten beschikbaar
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-5 sm:p-8 space-y-4 sm:space-y-6">
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
          
          <div className="space-y-2">
            <Label htmlFor="aantalKaarten" className="text-foreground text-sm sm:text-base">
              Aantal kaarten <span className="text-muted-foreground">(max. 10 per aanmelding)</span>
            </Label>
            <Input
              id="aantalKaarten"
              name="aantalKaarten"
              type="number"
              min="1"
              max="10"
              required
              value={formData.aantalKaarten}
              onChange={handleChange}
              className="bg-input border-border focus:border-neon-pink focus:ring-neon-pink/20 text-base"
              placeholder="1"
            />
          </div>
          
          {/* Total price display */}
          <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
            <span className="text-foreground font-medium">Totaal:</span>
            <span className="text-2xl sm:text-3xl font-bold text-neon-pink">€{totalPrice}</span>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || ticketsRemaining === 0}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-5 sm:py-6 text-base sm:text-lg rounded-xl glow-pink transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                Bezig met aanmelden...
              </>
            ) : ticketsRemaining === 0 ? (
              "Uitverkocht"
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
