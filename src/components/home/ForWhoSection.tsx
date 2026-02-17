import { Building2, Beer, PartyPopper, Tent, GraduationCap, Users } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { sanitizeHtml } from "@/lib/sanitize";

const audiences = [
  {
    icon: Building2,
    label: "Bedrijfsfeesten",
    description: "Personeelsfeesten & eindejaarsborrels",
  },
  {
    icon: Beer,
    label: "Vrijmibo's & borrels",
    description: "Gezellige afsluiting van de week",
  },
  {
    icon: PartyPopper,
    label: "Verjaardagen",
    description: "Onvergetelijke feesten",
  },
  {
    icon: Tent,
    label: "Festivals & events",
    description: "Groot of klein, altijd feest",
  },
  {
    icon: GraduationCap,
    label: "Scholen & verenigingen",
    description: "Leuke activiteiten voor elk niveau",
  },
  {
    icon: Users,
    label: "Privé events",
    description: "Elk feest wordt een succes",
  },
];

const ForWhoSection = () => {
  const { content } = useSiteContent('homepage_forwho');

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Voor <span className="text-neon-blue">wie</span> is het?
          </h2>
          {content && (
            <div
              className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto [&_p]:mb-2 [&_p]:last:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
            />
          )}
        </div>

        {/* Audience grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl bg-card border border-border hover:border-neon-pink/30 hover:bg-neon-pink/5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-neon-pink/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-neon-pink/20 transition-colors">
                <audience.icon className="w-6 h-6 sm:w-7 sm:h-7 text-neon-pink" />
              </div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">{audience.label}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm hidden sm:block">{audience.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <div className="text-center">
          <p className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neon-gold/10 border border-neon-gold/30 text-neon-gold font-medium text-sm sm:text-base">
            <Users className="w-5 h-5" />
            Geschikt voor groepen van 20 tot 500+ personen
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForWhoSection;
