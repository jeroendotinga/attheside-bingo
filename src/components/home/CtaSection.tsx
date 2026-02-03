import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PartyPopper, Mail, Phone } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-background" />
      <div className="absolute top-1/2 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-pink/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-neon-blue/10 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center p-8 sm:p-12 rounded-3xl bg-card/80 backdrop-blur-sm border border-border">
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
            Klaar voor een bingo die{" "}
            <span className="text-neon-pink">niemand vergeet</span>?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10">
            Neem contact op en we bespreken de mogelijkheden voor jouw event
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-10">
            <Link to="/contact">
              <Button 
                size="lg" 
                className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-full glow-pink hover:scale-105 transition-transform duration-300 bg-primary text-primary-foreground w-full sm:w-auto"
              >
                <PartyPopper className="w-5 h-5 mr-2" />
                Boek nu
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-full border-border hover:border-neon-pink/50 hover:bg-neon-pink/5 transition-all duration-300 w-full sm:w-auto"
              >
                <Mail className="w-5 h-5 mr-2" />
                Neem contact op
              </Button>
            </Link>
          </div>
          
          {/* Contact info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-muted-foreground text-sm sm:text-base">
            <a 
              href="mailto:info@atthesidebingo.nl" 
              className="flex items-center gap-2 hover:text-neon-pink transition-colors"
            >
              <Mail className="w-4 h-4" />
              info@atthesidebingo.nl
            </a>
            <a 
              href="tel:+31612345678" 
              className="flex items-center gap-2 hover:text-neon-pink transition-colors"
            >
              <Phone className="w-4 h-4" />
              +31 6 12 34 56 78
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
