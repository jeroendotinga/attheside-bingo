import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const terms = [
  "Deelname aan De Grote Bingo Sing a Long Show is op eigen risico.",
  "De organisatie is niet aansprakelijk voor verlies, schade of diefstal van persoonlijke eigendommen.",
  "De minimumleeftijd voor deelname is 18 jaar, tenzij anders vermeld.",
  "Gekochte tickets of aanmeldingen kunnen niet worden gerestitueerd, tenzij het evenement door de organisatie wordt geannuleerd.",
  "Bij annulering of wijziging van het programma (bijvoorbeeld artiest, presentator of DJ) bestaat geen recht op restitutie.",
  "De organisatie behoudt zich het recht voor om deelnemers die het evenement verstoren of zich ongepast gedragen, de toegang te ontzeggen.",
  "Over de uitslag van de bingo en toekenning van prijzen kan niet worden gecorrespondeerd.",
  "Prijzen zijn niet inwisselbaar voor geld of andere goederen, tenzij anders aangegeven.",
  "Door deelname geeft de bezoeker toestemming voor het maken en gebruiken van foto- en videomateriaal voor promotionele doeleinden.",
  "De organisatie behoudt zich het recht voor deze voorwaarden te wijzigen.",
];

const Terms = () => {
  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="terms" className="border-border">
            <AccordionTrigger className="text-base sm:text-lg font-semibold hover:text-neon-pink transition-colors py-4">
              Algemene Voorwaarden
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">
                  Algemene voorwaarden – De Grote Bingo Sing a Long Show
                </h3>
                <ol className="list-decimal list-outside ml-4 sm:ml-6 space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
                  {terms.map((term, index) => (
                    <li key={index} className="leading-relaxed pl-1">
                      {term}
                    </li>
                  ))}
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default Terms;
