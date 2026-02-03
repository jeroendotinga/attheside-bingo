import { Star, Quote } from "lucide-react";

const reviews = [
  {
    text: "Nog nooit zoveel gelachen tijdens een bingo. Absolute aanrader voor ons bedrijfsfeest!",
    author: "Sandra K.",
    company: "Marketing Bureau Amsterdam",
  },
  {
    text: "De hele zaal ging uit z'n dak. At The Side Bingo maakte ons event onvergetelijk.",
    author: "Jeroen B.",
    company: "Tech Startup Utrecht",
  },
  {
    text: "Professioneel, energiek en gewoon heel erg leuk. Volgend jaar weer!",
    author: "Lisa M.",
    company: "Evenementenbureau Rotterdam",
  },
];

const ReviewsSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Wat <span className="text-neon-gold">anderen</span> zeggen
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 sm:w-7 sm:h-7 text-neon-gold fill-neon-gold" />
            ))}
          </div>
          <p className="text-muted-foreground text-base sm:text-lg">
            Al gespeeld op 100+ events door heel Nederland
          </p>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="relative p-6 sm:p-8 rounded-2xl bg-card border border-border hover:border-neon-gold/30 transition-all duration-300"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-neon-gold/20" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-neon-gold fill-neon-gold" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-foreground text-base sm:text-lg mb-6 leading-relaxed">
                "{review.text}"
              </p>
              
              {/* Author */}
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{review.author}</p>
                <p className="text-muted-foreground text-sm">{review.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
