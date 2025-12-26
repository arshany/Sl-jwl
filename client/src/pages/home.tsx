import { usePrayer } from "@/lib/prayer-context";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, RefreshCw, ChevronLeft, Share2, Compass, MapPin, Navigation, Loader2, Check, Sun, Moon, HandHeart, BookOpen, Info, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Prayer } from "adhan";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { getDirectionsUrl } from "@/lib/mosque-finder";
import { toPng } from "html-to-image";

const dailyVerses = [
  { text: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", surah: "الزمر: 53", tafsir: "يخاطب الله عباده الذين أكثروا من الذنوب ألا يفقدوا الأمل في رحمته، فهو يغفر جميع الذنوب لمن تاب." },
  { text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ", surah: "الطلاق: 2-3", tafsir: "من يتق الله ويلتزم بأوامره، يجعل له فرجاً من كل ضيق ورزقاً من حيث لا يتوقع." },
  { text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", surah: "الشرح: 6", tafsir: "بشارة من الله أن مع كل صعوبة يسراً، وأن الفرج قريب مهما اشتدت المحن." },
  { text: "وَقُل رَّبِّ زِدْنِي عِلْمًا", surah: "طه: 114", tafsir: "أمر الله نبيه أن يطلب المزيد من العلم، مما يدل على فضل العلم وأهميته." },
  { text: "فَاذْكُرُونِي أَذْكُرْكُمْ", surah: "البقرة: 152", tafsir: "من يذكر الله بقلبه ولسانه، يذكره الله في الملأ الأعلى ويغفر له." },
  { text: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", surah: "البقرة: 186", tafsir: "الله قريب من عباده، يسمع دعاءهم ويستجيب لهم بلا واسطة." },
  { text: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا", surah: "آل عمران: 8", tafsir: "دعاء للثبات على الهداية وعدم الانحراف بعد معرفة الحق." },
];

const dailyAdhkar = [
  { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100, reward: "من قالها مائة مرة غُفرت ذنوبه وإن كانت مثل زبد البحر" },
  { text: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", count: 10, reward: "كأنما أعتق أربع رقاب من ولد إسماعيل" },
  { text: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ", count: 10, reward: "أحب الكلام إلى الله" },
  { text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", count: 100, reward: "من أكثر من الاستغفار جعل الله له من كل هم فرجاً" },
  { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", count: 10, reward: "من صلى عليّ صلاة صلى الله عليه بها عشراً" },
  { text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", count: 10, reward: "كنز من كنوز الجنة" },
  { text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", count: 33, reward: "تملأ الميزان بالحسنات" },
];

const moodContent = {
  peaceful: {
    title: "مطمئن",
    icon: "☀️",
    message: "الحمد لله على نعمة الطمأنينة",
    suggestion: "حافظ على هذه الحالة بالشكر والذكر",
    dhikr: "اللَّهُمَّ لَكَ الْحَمْدُ كَمَا يَنْبَغِي لِجَلَالِ وَجْهِكَ وَعَظِيمِ سُلْطَانِكَ"
  },
  needDhikr: {
    title: "محتاج ذكر",
    icon: "🌙",
    message: "القلوب تطمئن بذكر الله",
    suggestion: "ابدأ بالتسبيح والاستغفار",
    dhikr: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
  },
  needDua: {
    title: "أحتاج دعاء",
    icon: "🤲",
    message: "ادعُ ربك، فهو قريب مجيب",
    suggestion: "ارفع يديك وادعُ بما في قلبك",
    dhikr: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ"
  }
};

type MoodType = 'peaceful' | 'needDhikr' | 'needDua';

function getDayOfYear() {
  return Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
}

function getDateString() {
  return new Date().toISOString().split('T')[0];
}

export default function HomePage() {
  const { prayerTimes, nextPrayer, timeToNextPrayer, proximityLevel, settings, refreshLocation, nearestMosque, mosqueLoading, refreshMosque } = usePrayer();
  const [lastRead] = useLocalStorage<{surah: number, name: string} | null>("last-read", null);
  
  const [dhikrCompleted, setDhikrCompleted] = useLocalStorage<{date: string, completed: boolean}>('daily-dhikr-completed', {date: '', completed: false});
  const [dhikrStreak, setDhikrStreak] = useLocalStorage<{count: number, lastDate: string}>('dhikr-streak', {count: 0, lastDate: ''});
  const [currentMood, setCurrentMood] = useLocalStorage<MoodType>('current-mood', 'peaceful');
  const [showTafsir, setShowTafsir] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const verseImageRef = useRef<HTMLDivElement>(null);

  const dayOfYear = getDayOfYear();
  const todayDate = getDateString();
  
  const dailyVerse = dailyVerses[dayOfYear % dailyVerses.length];
  const dailyDhikr = dailyAdhkar[dayOfYear % dailyAdhkar.length];
  
  const isDhikrCompletedToday = dhikrCompleted.date === todayDate && dhikrCompleted.completed;

  const handleDhikrComplete = () => {
    if (isDhikrCompletedToday) return;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    let newStreak = 1;
    if (dhikrStreak.lastDate === yesterdayStr) {
      newStreak = dhikrStreak.count + 1;
    }
    
    setDhikrCompleted({date: todayDate, completed: true});
    setDhikrStreak({count: newStreak, lastDate: todayDate});
    
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };
  
  const prayers = [
    { id: Prayer.Fajr, name: "الفجر", time: prayerTimes?.fajr },
    { id: Prayer.Sunrise, name: "الشروق", time: prayerTimes?.sunrise },
    { id: Prayer.Dhuhr, name: "الظهر", time: prayerTimes?.dhuhr },
    { id: Prayer.Asr, name: "العصر", time: prayerTimes?.asr },
    { id: Prayer.Maghrib, name: "المغرب", time: prayerTimes?.maghrib },
    { id: Prayer.Isha, name: "العشاء", time: prayerTimes?.isha },
  ];

  const nextPrayerName = prayers.find(p => p.id === nextPrayer)?.name || "الفجر";
  const todayHijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  const getProximityColor = () => {
    switch (proximityLevel) {
      case 'imminent': return 'from-red-500 to-red-600';
      case 'close': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'far': return 'from-emerald-500 to-emerald-600';
      default: return 'from-emerald-500 to-emerald-600';
    }
  };

  const getProximityTextColor = () => {
    return 'text-white';
  };

  const shareVerse = async () => {
    if (!verseImageRef.current) return;
    
    setIsGeneratingImage(true);
    try {
      const dataUrl = await toPng(verseImageRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#1a365d',
      });
      
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'verse-of-the-day.png', { type: 'image/png' });
      
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'آية اليوم',
          text: `${dailyVerse.text}\n\n📖 ${dailyVerse.surah}`,
        });
      } else if (navigator.share) {
        const text = `${dailyVerse.text}\n\n📖 ${dailyVerse.surah}\n\n🌙 من تطبيق صلاة تايم`;
        await navigator.share({ text });
      } else {
        const link = document.createElement('a');
        link.download = 'verse-of-the-day.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (e) {
      const text = `${dailyVerse.text}\n\n📖 ${dailyVerse.surah}\n\n🌙 من تطبيق صلاة تايم`;
      navigator.clipboard.writeText(text);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const mood = moodContent[currentMood];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pt-6">
        <div className="flex items-center gap-2">
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary" data-testid="btn-settings">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary" onClick={refreshLocation} data-testid="btn-refresh">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
        <h1 className="text-xl font-bold text-primary" data-testid="text-page-title">الرئيسية</h1>
      </header>

      {/* Location Card */}
      <div className="px-4 mb-4">
        <Card className="bg-card shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Compass className="h-6 w-6 text-primary" />
            </div>
            <span className="font-medium text-foreground" data-testid="text-location">{settings.city}</span>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Next Prayer Widget */}
      <div className="px-4 mb-4">
        <motion.div
          animate={{ scale: proximityLevel === 'imminent' ? [1, 1.02, 1] : 1 }}
          transition={{ repeat: proximityLevel === 'imminent' ? Infinity : 0, duration: 1.5 }}
        >
          <Card className={`overflow-hidden shadow-lg bg-gradient-to-l ${getProximityColor()}`}>
            <CardContent className="p-4 text-center">
              <p className="text-sm mb-1 text-white/80">الصلاة القادمة</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl font-bold font-mono tabular-nums text-white" data-testid="text-countdown">
                  {timeToNextPrayer || "00:00:00"}
                </span>
                <span className="text-3xl font-bold text-white" data-testid="text-next-prayer">{nextPrayerName}</span>
              </div>
              <p className="text-xs mt-2 text-white/70" data-testid="text-hijri-date">{todayHijri}</p>
              {proximityLevel === 'imminent' && (
                <p className="text-sm text-white mt-2 animate-pulse">⏰ اقترب وقت الصلاة!</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Prayer Times Row */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {prayers.map((prayer) => {
            const isNext = prayer.id === nextPrayer;
            return (
              <Card 
                key={prayer.id} 
                className={`flex-shrink-0 min-w-[70px] ${isNext ? 'bg-primary text-primary-foreground' : 'bg-card'}`}
                data-testid={`card-prayer-${prayer.id}`}
              >
                <CardContent className="p-3 text-center">
                  <p className={`text-xs mb-1 ${isNext ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{prayer.name}</p>
                  <p className={`text-sm font-bold font-mono ${isNext ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {prayer.time ? format(prayer.time, "h:mm") : "--:--"}
                  </p>
                  <p className={`text-[10px] ${isNext ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {prayer.time ? format(prayer.time, "a") : ""}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* My Mood Today Widget */}
      <div className="px-4 mb-6">
        <Card className="bg-card shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <h3 className="font-bold text-foreground mb-3 text-center">حالتي اليوم</h3>
            <div className="flex gap-2 mb-4">
              {(['peaceful', 'needDhikr', 'needDua'] as MoodType[]).map((moodKey) => {
                const m = moodContent[moodKey];
                const isActive = currentMood === moodKey;
                return (
                  <button
                    key={moodKey}
                    onClick={() => setCurrentMood(moodKey)}
                    className={`flex-1 p-3 rounded-lg border transition-all ${
                      isActive 
                        ? 'bg-primary text-primary-foreground border-primary scale-105' 
                        : 'bg-muted border-border hover:bg-muted/80'
                    }`}
                    data-testid={`btn-mood-${moodKey}`}
                  >
                    <span className="text-2xl block mb-1">{m.icon}</span>
                    <span className="text-xs font-medium">{m.title}</span>
                  </button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMood}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-muted p-3 rounded-lg"
              >
                <p className="text-sm text-foreground mb-2">{mood.message}</p>
                <p className="text-xs text-muted-foreground mb-2">{mood.suggestion}</p>
                <p className="text-sm font-serif text-primary arabic-text">{mood.dhikr}</p>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Daily Dhikr Widget */}
      <div className="px-4 mb-6">
        <Card className="bg-gradient-to-l from-emerald-600 to-emerald-700 text-white shadow-lg overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">ذكر اليوم</h3>
              {dhikrStreak.count > 0 && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  🔥 {dhikrStreak.count} يوم متتالي
                </span>
              )}
            </div>
            <p className="text-lg font-serif mb-2 arabic-text" data-testid="text-daily-dhikr">{dailyDhikr.text}</p>
            <p className="text-sm opacity-80 mb-3">× {dailyDhikr.count} مرة</p>
            <p className="text-xs opacity-70 mb-4">{dailyDhikr.reward}</p>
            <Button
              onClick={handleDhikrComplete}
              disabled={isDhikrCompletedToday}
              className={`w-full ${isDhikrCompletedToday ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}
              data-testid="btn-dhikr-complete"
            >
              {isDhikrCompletedToday ? (
                <span className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  رددته ✓
                </span>
              ) : (
                "رددته ✔️"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Verse of the Day Widget (Enhanced) */}
      <div className="px-4 mb-6">
        <Card className="bg-card shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground">آية اليوم</h3>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTafsir(true)}
                  className="text-primary"
                  data-testid="btn-show-tafsir"
                >
                  <Info className="h-4 w-4 ml-1" />
                  تفسير
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={shareVerse}
                  disabled={isGeneratingImage}
                  className="text-primary"
                  data-testid="btn-share-verse"
                >
                  {isGeneratingImage ? (
                    <Loader2 className="h-4 w-4 animate-spin ml-1" />
                  ) : (
                    <Share2 className="h-4 w-4 ml-1" />
                  )}
                  مشاركة
                </Button>
              </div>
            </div>
            <p className="text-lg leading-relaxed font-serif text-foreground mb-2 arabic-text" data-testid="text-daily-verse">
              {dailyVerse.text}
            </p>
            <p className="text-sm text-muted-foreground text-left">📖 {dailyVerse.surah}</p>
          </CardContent>
        </Card>
      </div>

      {/* Nearest Mosque Widget */}
      <div className="px-4 mb-6">
        <Card className="bg-card shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">أقرب مسجد</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary"
                onClick={refreshMosque}
                disabled={mosqueLoading}
                data-testid="btn-refresh-mosque"
              >
                {mosqueLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>

            {mosqueLoading && !nearestMosque ? (
              <div className="text-center py-4">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                <p className="text-sm text-muted-foreground">جاري البحث...</p>
              </div>
            ) : nearestMosque ? (
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-foreground" data-testid="text-mosque-name">{nearestMosque.name}</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-mosque-distance">
                    {nearestMosque.distance < 1000 
                      ? `${nearestMosque.distance} متر` 
                      : `${(nearestMosque.distance / 1000).toFixed(1)} كم`}
                  </p>
                </div>
                <a 
                  href={getDirectionsUrl(nearestMosque.lat, nearestMosque.lng)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90" data-testid="btn-open-mosque-directions">
                    <Navigation className="h-4 w-4 ml-2" />
                    توجه الآن
                  </Button>
                </a>
              </div>
            ) : (
              <div className="text-center py-4">
                <Button variant="outline" onClick={refreshMosque} data-testid="btn-find-mosque">
                  <MapPin className="h-4 w-4 ml-2" />
                  البحث عن مسجد
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Continue Reading Quran */}
      <div className="px-4 mb-6">
        <Card className="bg-gradient-to-l from-[#5B8A51] to-[#4A7A45] text-white overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm opacity-90 mb-1">متابعة المصحف</p>
              <h3 className="text-xl font-bold mb-1">{lastRead?.name || "الفاتحة"}</h3>
              <Link href={lastRead ? `/quran/${lastRead.surah}` : "/quran/1"}>
                <Button className="mt-3 bg-white/20 hover:bg-white/30 text-white border-0" size="sm" data-testid="btn-continue-reading">
                  <BookOpen className="h-4 w-4 ml-2" />
                  متابعة
                </Button>
              </Link>
            </div>
            <div className="text-5xl opacity-20">📖</div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden Verse Card for Image Generation */}
      <div 
        ref={verseImageRef}
        className="fixed -left-[9999px] w-[400px] p-8 text-center"
        style={{ 
          backgroundColor: '#1a365d',
          fontFamily: 'Amiri, serif'
        }}
        dir="rtl"
      >
        <div className="mb-4">
          <span className="text-4xl">🌙</span>
        </div>
        <p className="text-2xl text-white leading-loose mb-6" style={{ fontFamily: 'Amiri, serif' }}>
          {dailyVerse.text}
        </p>
        <p className="text-lg text-white/80 mb-4">📖 {dailyVerse.surah}</p>
        <div className="border-t border-white/20 pt-4 mt-6">
          <p className="text-sm text-white/60">صلاة تايم</p>
        </div>
      </div>

      {/* Tafsir Dialog */}
      <Dialog open={showTafsir} onOpenChange={setShowTafsir}>
        <DialogContent className="max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center">تفسير مختصر</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-lg font-serif text-foreground arabic-text leading-relaxed">
              {dailyVerse.text}
            </p>
            <p className="text-sm text-muted-foreground">📖 {dailyVerse.surah}</p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-foreground leading-relaxed">
                {dailyVerse.tafsir}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
