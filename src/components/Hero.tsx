import logo from "@/assets/logo.png";

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card opacity-80" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl animate-pulse-neon" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-neon" style={{ animationDelay: "1s" }} />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <img 
          src={logo} 
          alt="De Grote Bingo Sing-Along Show" 
          className="w-full max-w-lg mx-auto mb-8 animate-float drop-shadow-2xl"
        />
        
        <p className="text-xl md:text-2xl text-foreground/90 mb-4 font-medium">
          Dit is geen gewone bingo…
        </p>
        <p className="text-3xl md:text-4xl font-bold text-neon-pink mb-8">
          dit is een feest.
        </p>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Een avond vol muziek, interactie en gezelligheid waar alles door elkaar loopt: 
          <span className="text-neon-pink font-semibold"> bingo</span>, 
          <span className="text-neon-blue font-semibold"> meezingen</span>, 
          <span className="text-neon-gold font-semibold"> karaoke</span> en 
          <span className="text-neon-purple font-semibold"> dansen</span>.
        </p>
        
        <a 
          href="#aanmelden" 
          className="inline-block mt-10 px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-full glow-pink hover:scale-105 transition-transform duration-300"
        >
          Nu Aanmelden
        </a>
      </div>
    </section>
  );
};

export default Hero;
