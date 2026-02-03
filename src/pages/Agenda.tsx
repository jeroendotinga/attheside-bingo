import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Terms from "@/components/Terms";
import RegistrationForm from "@/components/RegistrationForm";
import EventCalendar from "@/components/EventCalendar";
import EventList from "@/components/EventList";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List } from "lucide-react";

const Agenda = () => {
  const { events, loading } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');

  const scrollToRegistration = (eventId: string) => {
    setSelectedEventId(eventId);
    window.location.hash = `aanmelden?event=${eventId}`;
    const element = document.getElementById('aanmelden');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      
      {/* Spacer for fixed nav */}
      <div className="h-16 sm:h-20" />

      {/* Page Header */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
          <span className="text-neon-gold">Agenda</span> & Reserveren
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Bekijk alle aankomende events en reserveer direct je tickets
        </p>
      </section>

      {/* Events Section */}
      <section className="pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-2xl">
              <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Er zijn momenteel geen events gepland.</p>
              <p className="text-sm text-muted-foreground mt-2">Kom binnenkort terug!</p>
            </div>
          ) : (
            <>
              {/* View Toggle */}
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'calendar' | 'list')} className="mb-6">
                <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2">
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Lijst
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Kalender
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="mt-6">
                  <EventList events={events} onSelectEvent={scrollToRegistration} />
                </TabsContent>

                <TabsContent value="calendar" className="mt-6">
                  <EventCalendar events={events} onSelectEvent={scrollToRegistration} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </section>

      {/* Registration Form */}
      <RegistrationForm />

      {/* Terms */}
      <Terms />

      <Footer />
    </main>
  );
};

export default Agenda;
