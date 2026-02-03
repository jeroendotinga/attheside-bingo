import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Send, CheckCircle, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    bericht: "",
  });
  const [website, setWebsite] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (website) {
      setIsSubmitted(true);
      return;
    }

    setIsLoading(true);

    // For now, we'll just show a success message
    // You can add email sending logic via edge function later
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubmitted(true);
    toast({
      title: "Bericht verzonden!",
      description: "We nemen zo snel mogelijk contact met je op.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      
      {/* Spacer for fixed nav */}
      <div className="h-16 sm:h-20" />

      {/* Page Header */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          <span className="text-neon-pink">Contact</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Vragen, boekingen of samenwerkingen? We horen graag van je!
        </p>
      </section>

      {/* Contact Content */}
      <section className="pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          {isSubmitted ? (
            <div className="bg-card border border-neon-pink/30 rounded-2xl p-6 sm:p-8 text-center glow-pink">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-neon-pink mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Bedankt voor je bericht!</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                We nemen zo snel mogelijk contact met je op.
              </p>
            </div>
          ) : (
            <>
              {/* Direct Contact */}
              <div className="mb-8 p-4 sm:p-6 rounded-xl bg-card/50 border border-border text-center">
                <p className="text-muted-foreground mb-3">Je kunt ook direct mailen naar:</p>
                <a 
                  href="mailto:info@atthesidebingo.nl" 
                  className="inline-flex items-center gap-2 text-neon-pink hover:text-neon-pink/80 font-semibold text-lg transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  info@atthesidebingo.nl
                </a>
              </div>

              {/* Contact Form */}
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
                  <Label htmlFor="bericht" className="text-foreground text-sm sm:text-base">Bericht</Label>
                  <Textarea
                    id="bericht"
                    name="bericht"
                    required
                    value={formData.bericht}
                    onChange={handleChange}
                    className="bg-input border-border focus:border-neon-pink focus:ring-neon-pink/20 text-base min-h-[120px]"
                    placeholder="Waar kunnen we je mee helpen?"
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
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-5 sm:py-6 text-base sm:text-lg rounded-xl glow-pink transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      Versturen...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Verstuur bericht
                    </>
                  )}
                </Button>
              </form>

              {/* Friendly note */}
              <p className="text-center text-muted-foreground text-sm mt-6">
                We reageren meestal binnen 24 uur. Tot snel! 🎉
              </p>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
