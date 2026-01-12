import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border bg-card/30">
      <div className="max-w-4xl mx-auto text-center">
        <img 
          src={logo} 
          alt="De Grote Bingo Sing-Along Show" 
          className="w-48 mx-auto mb-6 opacity-80"
        />
        <p className="text-muted-foreground mb-4">
          Bingo. Karaoke. Meezingen. <span className="text-neon-pink font-semibold">Feest.</span>
        </p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} De Grote Bingo Sing a Long Show. Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
