import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Send, CheckCircle, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";
import { sanitizeHtml } from "@/lib/sanitize";

const ContactFormSection = () => {
  const { content: contactContent } = useSiteContent('homepage_contact');
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

    if (website) {
      setIsSubmitted(true);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke("notify-contact", {
        body: { naam: formData.naam, email: formData.email, bericht: formData.bericht },
      });
      if (error) throw error;
      setIsSubmitted(true);
      toast({
        title: "Bericht verzonden!",
        description: "We nemen zo snel mogelijk contact met je op.",
      });
    } catch (err) {
      console.error("Contact form error:", err);
      toast({
        title: "Er ging iets mis",
        description: "Probeer het later opnieuw of mail ons direct.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-background" />
      <div className="absolute top-1/2 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-pink/10 rounded-full blur-3xl" />

      <div className="max-w-xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Klaar voor een bingo die{" "}
            <span className="text-neon-pink">niemand vergeet</span>?
          </h2>
          {contactContent && (
            <div
              className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto [&_p]:mb-2 [&_p]:last:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(contactContent) }}
            />
          )}
        </div>

        {isSubmitted ? (
          <div className="bg-card border border-neon-pink/30 rounded-2xl p-6 sm:p-8 text-center glow-pink">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-neon-pink mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              Bedankt voor je bericht!
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              We nemen zo snel mogelijk contact met je op.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 p-4 sm:p-6 rounded-xl bg-card/50 border border-border text-center">
              <p className="text-muted-foreground mb-3">
                Je kunt ook direct mailen naar:
              </p>
              <a
                href="mailto:info@atthesidebingo.nl"
                className="inline-flex items-center gap-2 text-neon-pink hover:text-neon-pink/80 font-semibold text-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                info@atthesidebingo.nl
              </a>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-2xl p-5 sm:p-8 space-y-4 sm:space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="contact-naam" className="text-foreground text-sm sm:text-base">
                  Naam
                </Label>
                <Input
                  id="contact-naam"
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
                <Label htmlFor="contact-email" className="text-foreground text-sm sm:text-base">
                  Email
                </Label>
                <Input
                  id="contact-email"
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
                <Label htmlFor="contact-bericht" className="text-foreground text-sm sm:text-base">
                  Bericht
                </Label>
                <Textarea
                  id="contact-bericht"
                  name="bericht"
                  required
                  value={formData.bericht}
                  onChange={handleChange}
                  className="bg-input border-border focus:border-neon-pink focus:ring-neon-pink/20 text-base min-h-[120px]"
                  placeholder="Waar kunnen we je mee helpen?"
                />
              </div>

              {/* Honeypot */}
              <div
                className="absolute -left-[9999px] opacity-0 pointer-events-none"
                aria-hidden="true"
              >
                <Label htmlFor="contact-website">Website (laat dit veld leeg)</Label>
                <Input
                  id="contact-website"
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

            <p className="text-center text-muted-foreground text-sm mt-6">
              We reageren meestal binnen 24 uur. Tot snel! 🎉
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default ContactFormSection;
