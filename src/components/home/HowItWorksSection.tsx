import { CalendarCheck, Truck, PartyPopper, Smile } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { sanitizeHtml } from "@/lib/sanitize";

const steps = [
  {
    icon: CalendarCheck,
    number: "1",
    title: "Jij boekt De Grote Bingo Sing a Long Show",
    description: "Kies je datum en laat ons weten wat je wilt",
    color: "neon-pink",
  },
  {
    icon: Truck,
    number: "2",
    title: "Wij komen alles verzorgen",
    description: "Apparatuur, presentator, alles geregeld",
    color: "neon-blue",
  },
  {
    icon: PartyPopper,
    number: "3",
    title: "Spelen, zingen & lachen",
    description: "Een avond vol entertainment en plezier",
    color: "neon-gold",
  },
  {
    icon: Smile,
    number: "4",
    title: "Iedereen blij naar huis",
    description: "Met een glimlach en mooie herinneringen",
    color: "neon-purple",
  },
];

const colorClasses = {
  "neon-pink": {
    bg: "bg-neon-pink/10",
    border: "border-neon-pink/50",
    text: "text-neon-pink",
    glow: "shadow-[0_0_20px_rgba(236,72,153,0.3)]",
  },
  "neon-blue": {
    bg: "bg-neon-blue/10",
    border: "border-neon-blue/50",
    text: "text-neon-blue",
    glow: "shadow-[0_0_20px_rgba(56,189,248,0.3)]",
  },
  "neon-gold": {
    bg: "bg-neon-gold/10",
    border: "border-neon-gold/50",
    text: "text-neon-gold",
    glow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]",
  },
  "neon-purple": {
    bg: "bg-neon-purple/10",
    border: "border-neon-purple/50",
    text: "text-neon-purple",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
  },
};

const HowItWorksSection = () => {
  const { content } = useSiteContent('homepage_howitworks');

  return (
    <section id="hoe-werkt-het" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Zo <span className="text-neon-gold">werkt</span> het
          </h2>
          {content && (
            <div
              className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto [&_p]:mb-2 [&_p]:last:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
            />
          )}
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const colors = colorClasses[step.color as keyof typeof colorClasses];
            return (
              <div key={index} className="relative">
                {/* Connector line (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+2rem)] w-[calc(100%-2rem)] h-0.5 bg-gradient-to-r from-border to-transparent" />
                )}
                
                <div className={`relative p-6 sm:p-8 rounded-2xl border ${colors.border} ${colors.bg} ${colors.glow} backdrop-blur-sm transition-all duration-300 hover:scale-105`}>
                  {/* Step number */}
                  <div className={`absolute -top-4 -left-2 w-8 h-8 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center ${colors.text} font-bold text-sm`}>
                    {step.number}
                  </div>
                  
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${colors.bg} flex items-center justify-center mb-4 sm:mb-5`}>
                    <step.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${colors.text}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
