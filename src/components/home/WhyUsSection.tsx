import { Check, Sparkles, Zap, Heart, Shield, Users } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    text: "Geen saaie bingo – vol energie en actie",
  },
  {
    icon: Sparkles,
    text: "Humor en entertainment de hele avond",
  },
  {
    icon: Users,
    text: "Professionele, ervaren presentatie",
  },
  {
    icon: Shield,
    text: "Volledig ontzorgd – wij regelen alles",
  },
  {
    icon: Heart,
    text: "Altijd aangepast aan jouw publiek",
  },
];

const WhyUsSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-card/50">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Waarom <span className="text-neon-purple">At The Side Bingo</span>?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Dit is geen gewone bingo – dit is een feest
          </p>
        </div>

        {/* Reasons list */}
        <div className="space-y-4 sm:space-y-5">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl bg-card border border-border hover:border-neon-pink/30 hover:bg-neon-pink/5 transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neon-pink/10 flex items-center justify-center group-hover:bg-neon-pink/20 transition-colors">
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-neon-pink" />
              </div>
              <div className="flex items-center gap-3 flex-1">
                <reason.icon className="w-5 h-5 text-muted-foreground hidden sm:block" />
                <p className="text-foreground font-medium text-base sm:text-lg">{reason.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
