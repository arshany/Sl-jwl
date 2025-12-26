import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { PrayerProvider } from "@/lib/prayer-context";
import { BottomNav } from "@/components/bottom-nav";
import HomePage from "@/pages/home";
import AthkarPage from "@/pages/athkar";
import QuranPage from "@/pages/quran";
import SettingsPage from "@/pages/settings";
import QiblaPage from "@/pages/qibla";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/quran/:id?" component={QuranPage} />
      <Route path="/athkar" component={AthkarPage} />
      <Route path="/qibla" component={QiblaPage} />
      <Route path="/settings" component={SettingsPage} />
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
