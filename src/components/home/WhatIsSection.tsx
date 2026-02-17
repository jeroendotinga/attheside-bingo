import { Mic2, Music, Users, Gift } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { sanitizeHtml } from "@/lib/sanitize";

const features = [
  {
    icon: Mic2,
    title: "Live gepresenteerd",
    description: "Energieke presentator die de sfeer erin houdt",
    color: "neon-pink",
  },
  {
    icon: Music,
    title: "Muziek & entertainment",
    description: "Hits die iedereen kent en meezingt",
    color: "neon-blue",
  },
  {
    icon: Users,
    title: "Publieksinteractie",
    description: "Iedereen doet mee, niemand kijkt toe",
    color: "neon-gold",
  },
  {
    icon: Gift,
    title: "Prijzen & verrassingen",
    description: "Leuke prijzen en onverwachte momenten",
    color: "neon-purple",
  },
];

const colorClasses = {
  "neon-pink": "text-neon-pink border-neon-pink/30 bg-neon-pink/5 hover:bg-neon-pink/10 hover:border-neon-pink/50",
  "neon-blue": "text-neon-blue border-neon-blue/30 bg-neon-blue/5 hover:bg-neon-blue/10 hover:border-neon-blue/50",
  "neon-gold": "text-neon-gold border-neon-gold/30 bg-neon-gold/5 hover:bg-neon-gold/10 hover:border-neon-gold/50",
  "neon-purple": "text-neon-purple border-neon-purple/30 bg-neon-purple/5 hover:bg-neon-purple/10 hover:border-neon-purple/50",
};

const iconBgClasses = {
  "neon-pink": "bg-neon-pink/20",
  "neon-blue": "bg-neon-blue/20",
  "neon-gold": "bg-neon-gold/20",
  "neon-purple": "bg-neon-purple/20",
};

const WhatIsSection = () => {
  const { content } = useSiteContent('homepage_what');

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            WAT IS DE <span className="text-neon-pink">GROTE BINGO SING A LONG SHOW</span>
          </h2>
          {content && (
            <div
              className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto [&_p]:mb-2 [&_p]:last:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
            />
          )}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${colorClasses[feature.color as keyof typeof colorClasses]}`}
            >
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${iconBgClasses[feature.color as keyof typeof iconBgClasses]} flex items-center justify-center mb-4 sm:mb-5`}>
                <feature.icon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIsSection;
