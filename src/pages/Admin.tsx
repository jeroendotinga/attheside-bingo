import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { LogOut, Trash2, Loader2, Lock, RefreshCw, Download, CheckCircle, XCircle, Calendar, FileText, Users, Filter } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import EventManager from "@/components/admin/EventManager";
import ContentEditor from "@/components/admin/ContentEditor";
import { useAllEvents, Event } from "@/hooks/useEvents";

interface Registration {
  id: string;
  naam: string;
  email: string;
  telefoon: string;
  aantal_kaarten: number;
  totaal_prijs: number;
  betaald: boolean;
  created_at: string;
  event_id: string | null;
}

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventFilter, setEventFilter] = useState<string>("all");
  const { events } = useAllEvents();

  // Create a map of event_id to event for quick lookup
  const eventsMap = useMemo(() => {
    const map = new Map<string, Event>();
    events.forEach((event) => map.set(event.id, event));
    return map;
  }, [events]);

  // Filter registrations by event
  const filteredRegistrations = useMemo(() => {
    if (eventFilter === "all") return registrations;
    if (eventFilter === "none") return registrations.filter((r) => !r.event_id);
    return registrations.filter((r) => r.event_id === eventFilter);
  }, [registrations, eventFilter]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    const { error } = await supabase
      .from("registrations")
      .select("id")
      .limit(1);
    
    if (error) {
      setIsAdmin(false);
      toast({
        title: "Geen toegang",
        description: "Je hebt geen admin rechten.",
        variant: "destructive",
      });
    } else {
      setIsAdmin(true);
      fetchRegistrations();
    }
    setLoading(false);
  };

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Fout bij ophalen",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setRegistrations(data || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoginLoading(false);

    if (error) {
      toast({
        title: "Login mislukt",
        description: "Controleer je email en wachtwoord.",
        variant: "destructive",
      });
      return;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    toast({
      title: "Uitgelogd",
      description: "Je bent succesvol uitgelogd.",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze aanmelding wilt verwijderen?")) {
      return;
    }

    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Fout bij verwijderen",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Verwijderd",
      description: "Aanmelding is verwijderd.",
    });
    
    fetchRegistrations();
  };

  const handlePaymentToggle = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("registrations")
      .update({ betaald: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Fout bij bijwerken",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: currentStatus ? "Niet betaald" : "Betaald",
      description: `Betaalstatus is bijgewerkt.`,
    });
    
    fetchRegistrations();
  };

  const exportToCSV = () => {
    const dataToExport = filteredRegistrations;
    const headers = ["Naam", "Email", "Telefoon", "Event", "Aantal Kaarten", "Totaal Prijs", "Betaald", "Aangemeld Op"];
    const rows = dataToExport.map(r => [
      r.naam,
      r.email,
      r.telefoon,
      r.event_id ? eventsMap.get(r.event_id)?.title || "Onbekend" : "Geen event",
      r.aantal_kaarten.toString(),
      `€${r.totaal_prijs}`,
      r.betaald ? "Ja" : "Nee",
      new Date(r.created_at).toLocaleString("nl-NL"),
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `aanmeldingen_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const totalTickets = filteredRegistrations.reduce((sum, r) => sum + r.aantal_kaarten, 0);
  const totalRevenue = filteredRegistrations.reduce((sum, r) => sum + Number(r.totaal_prijs), 0);
  const paidRevenue = filteredRegistrations.filter(r => r.betaald).reduce((sum, r) => sum + Number(r.totaal_prijs), 0);
  const paidCount = filteredRegistrations.filter(r => r.betaald).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-pink" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-neon-pink mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
              <p className="text-muted-foreground text-sm mt-2">
                Log in om aanmeldingen te beheren
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-input"
                  placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-input"
                  placeholder="••••••••"
                />
              </div>
              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Inloggen...
                  </>
                ) : (
                  "Inloggen"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Geen toegang</h1>
            <p className="text-muted-foreground mb-6">
              Je account heeft geen admin rechten.
            </p>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Uitloggen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              De Grote Bingo Sing a Long Show
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRegistrations}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Vernieuwen
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex-1 sm:flex-none"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Uitloggen
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs defaultValue="registrations" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="registrations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Aanmeldingen
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Evenementen
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registrations" className="space-y-6">
            {/* Event Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger className="w-[280px] bg-input border-border">
                    <SelectValue placeholder="Filter op event" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all">Alle aanmeldingen</SelectItem>
                    <SelectItem value="none">Zonder event</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title} - {new Date(event.event_date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {eventFilter !== "all" && (
                <Button variant="ghost" size="sm" onClick={() => setEventFilter("all")}>
                  Filter wissen
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                <p className="text-muted-foreground text-xs sm:text-sm">Aanmeldingen</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{filteredRegistrations.length}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                <p className="text-muted-foreground text-xs sm:text-sm">Kaarten Verkocht</p>
                <p className="text-2xl sm:text-3xl font-bold text-neon-pink">{totalTickets}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                <p className="text-muted-foreground text-xs sm:text-sm">Totaal Omzet</p>
                <p className="text-2xl sm:text-3xl font-bold text-neon-gold">€{totalRevenue}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                <p className="text-muted-foreground text-xs sm:text-sm">Betaald</p>
                <p className="text-2xl sm:text-3xl font-bold text-neon-blue">{paidCount}/{filteredRegistrations.length}</p>
              </div>
              <div className="bg-card border border-neon-blue/30 rounded-xl p-4 sm:p-6 col-span-2 lg:col-span-1">
                <p className="text-muted-foreground text-xs sm:text-sm">Omzet (betaald)</p>
                <p className="text-2xl sm:text-3xl font-bold text-neon-blue">€{paidRevenue}</p>
                <p className="text-xs text-muted-foreground">van €{totalRevenue} totaal</p>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={exportToCSV} disabled={filteredRegistrations.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Exporteer CSV
              </Button>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-foreground">Naam</TableHead>
                      <TableHead className="text-foreground">Event</TableHead>
                      <TableHead className="text-foreground hidden lg:table-cell">Email</TableHead>
                      <TableHead className="text-foreground hidden sm:table-cell">Telefoon</TableHead>
                      <TableHead className="text-foreground text-center">Kaarten</TableHead>
                      <TableHead className="text-foreground text-right">Prijs</TableHead>
                      <TableHead className="text-foreground text-center">Betaald</TableHead>
                      <TableHead className="text-foreground hidden md:table-cell">Datum</TableHead>
                      <TableHead className="text-foreground text-right">Actie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          {eventFilter !== "all" ? "Geen aanmeldingen voor dit event" : "Nog geen aanmeldingen"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRegistrations.map((reg) => {
                        const event = reg.event_id ? eventsMap.get(reg.event_id) : null;
                        return (
                          <TableRow key={reg.id} className="border-border">
                            <TableCell className="font-medium text-foreground">{reg.naam}</TableCell>
                            <TableCell>
                              {event ? (
                                <div className="flex flex-col">
                                  <span className="text-sm text-foreground font-medium truncate max-w-[150px]">
                                    {event.title}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(event.event_date).toLocaleDateString('nl-NL', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">Geen event</span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm hidden lg:table-cell">{reg.email}</TableCell>
                            <TableCell className="text-muted-foreground hidden sm:table-cell">{reg.telefoon}</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-neon-pink/20 text-neon-pink px-2 py-1 rounded-full text-sm font-semibold">
                                {reg.aantal_kaarten}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-semibold text-neon-gold">
                              €{reg.totaal_prijs}
                            </TableCell>
                            <TableCell className="text-center">
                              <button
                                onClick={() => handlePaymentToggle(reg.id, reg.betaald)}
                                className="inline-flex items-center justify-center"
                              >
                                {reg.betaald ? (
                                  <CheckCircle className="w-6 h-6 text-neon-blue" />
                                ) : (
                                  <XCircle className="w-6 h-6 text-muted-foreground hover:text-neon-blue transition-colors" />
                                )}
                              </button>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                              {new Date(reg.created_at).toLocaleDateString("nl-NL", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(reg.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <EventManager />
          </TabsContent>

          <TabsContent value="content">
            <ContentEditor />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
