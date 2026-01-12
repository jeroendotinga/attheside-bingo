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

const Features = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Wat je kunt <span className="text-neon-pink">verwachten</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 text-lg">
          Een avond om nooit te vergeten
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 ${colorClasses[feature.color as keyof typeof colorClasses]} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg`}
            >
              <feature.icon className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-xl md:text-2xl text-foreground/90 italic">
            "Of je nou komt om te winnen, te zingen of gewoon voor de lol..."
          </p>
          <p className="text-lg md:text-xl text-neon-pink mt-4 font-semibold">
            Je gaat sowieso met een schorre stem en een grote glimlach naar huis.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
