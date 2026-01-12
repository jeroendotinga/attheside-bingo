import { Calendar, MapPin, Clock } from "lucide-react";

const EventInfo = () => {
  return (
    <section className="py-20 px-4 bg-card/50 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/5 via-transparent to-neon-blue/5" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Eerste <span className="text-neon-gold">Event</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-background/50 backdrop-blur-sm">
            <Calendar className="w-12 h-12 text-neon-pink mb-4" />
            <h3 className="text-lg font-semibold mb-2">Datum</h3>
            <p className="text-2xl font-bold text-foreground">10 April 2026</p>
            <p className="text-muted-foreground">Vrijdag</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-background/50 backdrop-blur-sm">
            <MapPin className="w-12 h-12 text-neon-blue mb-4" />
            <h3 className="text-lg font-semibold mb-2">Locatie</h3>
            <p className="text-xl font-bold text-foreground">Wapen van Diemen</p>
            <p className="text-muted-foreground text-sm">Ouderkerkerlaan 8</p>
            <p className="text-muted-foreground text-sm">1112 BE Diemen</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-background/50 backdrop-blur-sm">
            <Clock className="w-12 h-12 text-neon-gold mb-4" />
            <h3 className="text-lg font-semibold mb-2">Type</h3>
            <p className="text-xl font-bold text-foreground">Bingo</p>
            <p className="text-xl font-bold text-neon-pink">Karaoke</p>
            <p className="text-xl font-bold text-neon-blue">Meezingen</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 text-lg font-bold">
          <span className="px-4 py-2 rounded-full bg-neon-pink/20 text-neon-pink border border-neon-pink/30">
            Bingo
          </span>
          <span className="px-4 py-2 rounded-full bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
            Karaoke
          </span>
          <span className="px-4 py-2 rounded-full bg-neon-gold/20 text-neon-gold border border-neon-gold/30">
            Meezingen
          </span>
          <span className="px-4 py-2 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
            Feest
          </span>
        </div>
      </div>
    </section>
  );
};

export default EventInfo;
