import { usePrayer } from "@/lib/prayer-context";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { motion } from "framer-motion";
import { MapPin, Volume2, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Prayer } from "adhan";
import patternBg from "@assets/generated_images/subtle_islamic_geometric_pattern_background.png";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { prayerTimes, nextPrayer, timeToNextPrayer, settings, refreshLocation } = usePrayer();
  const [prayerLog, setPrayerLog] = useLocalStorage<Record<string, boolean>>("prayer-log", {});
  
  // Stats calculation
  const todayKey = format(new Date(), "yyyy-MM-dd");
  
  const togglePrayer = (prayerId: string) => {
    const key = `${todayKey}-${prayerId}`;
    setPrayerLog(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const prayers = [
    { id: Prayer.Fajr, name: "الفجر", time: prayerTimes?.fajr },
    { id: Prayer.Sunrise, name: "الشروق", time: prayerTimes?.sunrise, noTrack: true }, // Usually no fard prayer for sunrise
    { id: Prayer.Dhuhr, name: "الظهر", time: prayerTimes?.dhuhr },
    { id: Prayer.Asr, name: "العصر", time: prayerTimes?.asr },
    { id: Prayer.Maghrib, name: "المغرب", time: prayerTimes?.maghrib },
    { id: Prayer.Isha, name: "العشاء", time: prayerTimes?.isha },
  ];

  const nextPrayerName = prayers.find(p => p.id === nextPrayer)?.name || "الفجر";
  const todayHijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const todayGregorian = format(new Date(), "EEEE، d MMMM", { locale: arSA });

  // Weekly Stats
  const calculateWeeklyProgress = () => {
    let completed = 0;
    let total = 0;
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateKey = format(d, "yyyy-MM-dd");
        
        [Prayer.Fajr, Prayer.Dhuhr, Prayer.Asr, Prayer.Maghrib, Prayer.Isha].forEach(p => {
            if (prayerLog[`${dateKey}-${p}`]) completed++;
            total++;
        });
    }
    return total === 0 ? 0 : (completed / total) * 100;
  };
  
  const weeklyProgress = calculateWeeklyProgress();

  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none z-0"
        style={{ backgroundImage: `url(${patternBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Header / Hero */}
      <header className="relative z-10 p-6 pt-12 flex flex-col items-center justify-center text-center space-y-2">
        <div className="flex items-center space-x-2 space-x-reverse bg-card/50 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50 shadow-sm cursor-pointer hover:bg-card/80 transition-colors" onClick={refreshLocation}>
            <MapPin className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-foreground/80">{settings.city}</span>
        </div>
        
        <div className="pt-4">
            <h2 className="text-sm font-medium text-muted-foreground">{todayGregorian}</h2>
            <h1 className="text-lg font-bold text-primary">{todayHijri}</h1>
        </div>

        {/* Next Prayer Display */}
        <div className="mt-8 mb-4">
            <div className="text-sm text-muted-foreground mb-1">الصلاة القادمة</div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">{nextPrayerName}</h1>
            <div className="text-6xl font-black text-primary font-mono mt-2 tracking-tighter tabular-nums">
                {timeToNextPrayer || "--:--:--"}
            </div>
            <div className="text-xs text-muted-foreground mt-2">متبقي للأذان</div>
        </div>
        
        {/* Weekly Stats Mini-bar */}
        <div className="w-full max-w-xs mt-4">
             <div className="flex justify-between text-[10px] text-muted-foreground mb-1 px-1">
                <span>التزامك الأسبوعي</span>
                <span>{Math.round(weeklyProgress)}%</span>
             </div>
             <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                    className="h-full bg-secondary transition-all duration-1000 ease-out" 
                    style={{ width: `${weeklyProgress}%` }}
                />
             </div>
        </div>
      </header>

      {/* Prayer List */}
      <main className="relative z-10 px-4 mt-6 space-y-3 pb-8">
        {prayers.map((prayer) => {
            const isNext = prayer.id === nextPrayer;
            const isDone = prayerLog[`${todayKey}-${prayer.id}`];

            return (
                <motion.div 
                    key={prayer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className={`border-none shadow-sm overflow-hidden transition-all duration-300 ${isNext ? 'bg-primary text-primary-foreground ring-2 ring-primary/20 ring-offset-2' : 'bg-card hover:bg-accent/50'} ${isDone && !isNext ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Tracker Checkbox */}
                                {!prayer.noTrack ? (
                                    <button 
                                        onClick={() => togglePrayer(prayer.id)}
                                        className={`transition-all ${isNext ? 'text-white' : 'text-primary'}`}
                                    >
                                        {isDone ? <CheckCircle2 className="h-6 w-6 fill-current" /> : <Circle className="h-6 w-6" />}
                                    </button>
                                ) : (
                                    <div className="w-6" /> // Spacer
                                )}
                                
                                <span className={`font-bold text-lg ${isNext ? 'text-white' : 'text-foreground'} ${isDone ? 'line-through decoration-current/50' : ''}`}>
                                    {prayer.name}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <span className={`font-mono text-xl font-medium ${isNext ? 'text-white' : 'text-foreground'}`}>
                                    {prayer.time ? format(prayer.time, "h:mm a") : "--:--"}
                                </span>
                                <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-full ${isNext ? 'text-white/80 hover:text-white hover:bg-white/20' : 'text-muted-foreground'}`}>
                                    <Volume2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            );
        })}
      </main>
    </div>
  );
}
