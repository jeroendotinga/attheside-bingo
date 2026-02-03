import { Music, Mic2, Trophy, Laugh, Disc3, PartyPopper } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Bingo met een knipoog",
    description: "Spannende rondes met verrassende prijzen",
    color: "neon-gold",
  },
  {
    icon: Music,
    title: "Meezinghits",
    description: "Hits die iedereen kent (en denkt te kunnen zingen)",
    color: "neon-pink",
  },
  {
    icon: Mic2,
    title: "Karaoke-momenten",
    description: "Voor de durfals en podiumbeesten",
    color: "neon-blue",
  },
  {
    icon: Laugh,
    title: "Humor & energie",
    description: "Een presentator die de sfeer erin houdt",
    color: "neon-purple",
  },
  {
    icon: Disc3,
    title: "DJ aan het roer",
    description: "Die alles aan elkaar draait",
    color: "neon-pink",
  },
  {
    icon: PartyPopper,
    title: "Pure gezelligheid",
    description: "Lachen, zingen, dansen!",
    color: "neon-gold",
  },
];

const colorClasses = {
  "neon-pink": "text-neon-pink border-neon-pink/50 bg-neon-pink/10",
  "neon-blue": "text-neon-blue border-neon-blue/50 bg-neon-blue/10",
  "neon-gold": "text-neon-gold border-neon-gold/50 bg-neon-gold/10",
  "neon-purple": "text-neon-purple border-neon-purple/50 bg-neon-purple/10",
};

const HowItWorks = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3">
          Hoe werkt <span className="text-neon-pink">het?</span>
        </h2>
        <p className="text-muted-foreground text-center mb-8 sm:mb-10 text-sm sm:text-base">
          Een avond om nooit te vergeten
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-3 sm:p-5 rounded-xl border ${colorClasses[feature.color as keyof typeof colorClasses]} backdrop-blur-sm transition-all duration-300 hover:scale-105`}
            >
              <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3" />
              <h3 className="text-sm sm:text-base font-bold mb-1 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
