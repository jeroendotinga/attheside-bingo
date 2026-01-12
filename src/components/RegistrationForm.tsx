import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Send, CheckCircle } from "lucide-react";

const RegistrationForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    naam: "",
    telefoon: "",
    aantalKaarten: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast({
      title: "Aanmelding ontvangen!",
      description: "Dank voor je aanmelding. In de mail krijg je een bevestiging met daarin een betaallink.",
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
      <section id="aanmelden" className="py-20 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-card border border-neon-pink/30 rounded-2xl p-8 text-center glow-pink">
            <CheckCircle className="w-16 h-16 text-neon-pink mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Bedankt voor je aanmelding!</h3>
            <p className="text-muted-foreground">
              Dank voor je aanmelding. In de mail krijg je een bevestiging met daarin een betaallink.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="aanmelden" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-pink/5 to-transparent" />
      
      <div className="max-w-xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="text-neon-pink">Aanmelden</span>
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Reserveer je plek voor het feest!
        </p>
        
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="naam" className="text-foreground">Naam</Label>
            <Input
              id="naam"
              name="naam"
              type="text"
              required
              value={formData.naam}
              onChange={handleChange}
              className="bg-input border-border focus:border-neon-pink focus:ring-neon-pink/20"
              placeholder="Jouw naam"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-input border-border focus:border-neon-pink focus:ring-neon-pink/20"
              placeholder="jouw@email.nl"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefoon" className="text-foreground">Telefoon</Label>
            <Input
              id="telefoon"
              name="telefoon"
              type="tel"
              required
              value={formData.telefoon}
              onChange={handleChange}
              className="bg-input border-border focus:border-neon-pink focus:ring-neon-pink/20"
              placeholder="06-12345678"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aantalKaarten" className="text-foreground">Aantal kaarten</Label>
            <Input
              id="aantalKaarten"
              name="aantalKaarten"
              type="number"
              min="1"
              required
              value={formData.aantalKaarten}
              onChange={handleChange}
              className="bg-input border-border focus:border-neon-pink focus:ring-neon-pink/20"
              placeholder="1"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-xl glow-pink transition-all duration-300 hover:scale-[1.02]"
          >
            <Send className="w-5 h-5 mr-2" />
            Aanmelden
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            Na aanmelding ontvang je een bevestiging met betaallink per email.
          </p>
        </form>
      </div>
    </section>
  );
};

export default RegistrationForm;
