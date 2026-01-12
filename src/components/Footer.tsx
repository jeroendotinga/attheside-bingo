import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-border bg-card/30">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative inline-block mb-4 sm:mb-6">
          <div className="absolute inset-0 bg-neon-pink/10 blur-2xl rounded-full" />
          <img 
            src={logo} 
            alt="De Grote Bingo Sing-Along Show" 
            className="relative w-32 sm:w-48 mx-auto opacity-80 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]"
          />
        </div>
        <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
          Bingo. Karaoke. Meezingen. <span className="text-neon-pink font-semibold">Feest.</span>
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">
          © {new Date().getFullYear()} De Grote Bingo Sing a Long Show. Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
