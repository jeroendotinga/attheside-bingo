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
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-6 sm:mb-8">
          Waarom <span className="text-neon-purple">At The Side Bingo</span>?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-card border border-border hover:border-neon-pink/30 transition-all duration-300"
            >
              <Check className="w-5 h-5 text-neon-pink flex-shrink-0" />
              <p className="text-foreground font-medium text-sm sm:text-base">{reason.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
