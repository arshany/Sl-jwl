import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { PrayerProvider } from "@/lib/prayer-context";
import { BottomNav } from "@/components/bottom-nav";
import HomePage from "@/pages/home";
import AthkarPage from "@/pages/athkar";
import QuranIndex, { QuranReader } from "@/pages/quran";
import SettingsPage from "@/pages/settings";
import QiblaPage from "@/pages/qibla";
import TasbihPage from "@/pages/tasbih";
import DuaMoodPage from "@/pages/dua-mood";
import PrivacyPage from "@/pages/privacy";
import AboutPage from "@/pages/about";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/quran" component={QuranIndex} />
      <Route path="/quran/:id" component={QuranReader} />
      <Route path="/athkar" component={AthkarPage} />
      <Route path="/qibla" component={QiblaPage} />
      <Route path="/tasbih" component={TasbihPage} />
      <Route path="/dua-mood" component={DuaMoodPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/about" component={AboutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PrayerProvider>
        <div dir="rtl" className="font-sans antialiased bg-background text-foreground min-h-screen selection:bg-primary/20">
          <Router />
          <BottomNav />
          <Toaster />
        </div>
      </PrayerProvider>
    </QueryClientProvider>
  );
}

export default App;
