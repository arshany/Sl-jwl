import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Bookmark, BookOpen, ArrowLeft, ArrowRight, Eye, EyeOff, Timer, Target, X } from "lucide-react";
import { Link } from "wouter";
import { surahMetadata } from "@/lib/quran-data";
import { getSurahText } from "@/lib/quran-loader";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface KhatmaProgress {
  plan: 7 | 14 | 30;
  startDate: string;
  pagesRead: number;
  lastReadDate: string;
}

export default function QuranIndex() {
  const [search, setSearch] = useState("");
  const [lastRead] = useLocalStorage<{surah: number, name: string} | null>("last-read", null);
  const [khatmaProgress, setKhatmaProgress] = useLocalStorage<KhatmaProgress | null>("khatma-progress", null);
  const [showKhatmaDialog, setShowKhatmaDialog] = useState(false);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);

  console.log("QuranIndex rendered, surahMetadata count:", surahMetadata.length);

  const filteredSurahs = useMemo(() => {
    if (!search.trim()) return surahMetadata;
    
    return surahMetadata.filter(s => 
        s.name.includes(search) || 
        s.number.toString().includes(search) ||
        s.english.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  console.log("Filtered surahs count:", filteredSurahs.length);

  useEffect(() => {
    if (lastRead && !showContinuePrompt) {
      const lastVisit = localStorage.getItem('last-quran-visit');
      const now = Date.now();
      if (!lastVisit || now - parseInt(lastVisit) > 3600000) {
        setShowContinuePrompt(true);
      }
      localStorage.setItem('last-quran-visit', now.toString());
    }
  }, [lastRead]);

  const startKhatma = (plan: 7 | 14 | 30) => {
    setKhatmaProgress({
      plan,
      startDate: new Date().toISOString(),
      pagesRead: 0,
      lastReadDate: new Date().toISOString(),
    });
    setShowKhatmaDialog(false);
  };

  const khatmaPlans = { 7: 86, 14: 43, 30: 20 };
  const totalPages = 604;
  const khatmaPercentage = khatmaProgress ? Math.min((khatmaProgress.pagesRead / totalPages) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-background pb-24 pt-10 px-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">القرآن الكريم</h1>
        <Badge variant="secondary" className="text-sm">{surahMetadata.length} سورة</Badge>
      </div>

      <AnimatePresence>
        {showContinuePrompt && lastRead && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-l from-primary to-primary/90 text-white rounded-xl p-4 mb-6 relative"
          >
            <button 
              onClick={() => setShowContinuePrompt(false)}
              className="absolute top-2 left-2 text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-sm opacity-90 mb-1">💭 آخر موضع توقفت عنده</p>
            <h3 className="text-lg font-bold mb-2">سورة {lastRead.name}</h3>
            <p className="text-sm opacity-80 mb-3">تحب تكمل قراءتك؟</p>
            <Link href={`/quran/${lastRead.surah}`}>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-0" size="sm">
                <BookOpen className="h-4 w-4 ml-2" />
                متابعة
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!showContinuePrompt && lastRead && (
         <Link href={`/quran/${lastRead.surah}`} className="block">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex justify-between items-center cursor-pointer mb-6 hover:bg-primary/10 transition-colors">
                <div>
                    <p className="text-xs text-primary font-bold mb-1">تابِع قراءتك</p>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        سورة {lastRead.name}
                    </h3>
                </div>
                <Button size="sm" variant="secondary">تابع</Button>
            </div>
         </Link>
      )}

      <Card className="bg-gradient-to-l from-[#709046] to-[#5a7338] text-white overflow-hidden mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <h3 className="font-bold">تحدي الختمة</h3>
            </div>
            {khatmaProgress && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setKhatmaProgress(null)}
              >
                إلغاء
              </Button>
            )}
          </div>
          
          {khatmaProgress ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm opacity-90">
                <span>خطة {khatmaProgress.plan} يوم</span>
                <span>{Math.round(khatmaPercentage)}%</span>
              </div>
              <Progress value={khatmaPercentage} className="h-2 bg-white/20" />
              <p className="text-xs opacity-80">
                {khatmaProgress.pagesRead} من {totalPages} صفحة • {khatmaPlans[khatmaProgress.plan]} صفحة يومياً
              </p>
              <Button 
                className="w-full bg-white/20 hover:bg-white/30 border-0"
                onClick={() => setKhatmaProgress({
                  ...khatmaProgress,
                  pagesRead: Math.min(khatmaProgress.pagesRead + khatmaPlans[khatmaProgress.plan], totalPages),
                  lastReadDate: new Date().toISOString()
                })}
              >
                ✓ أتممت وردي اليوم
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm opacity-80 mb-3">ابدأ تحدي ختم القرآن بدون ضغط</p>
              <div className="flex gap-2">
                {([7, 14, 30] as const).map(plan => (
                  <Button
                    key={plan}
                    onClick={() => startKhatma(plan)}
                    className="flex-1 bg-white/20 hover:bg-white/30 border-0 text-white"
                    size="sm"
                  >
                    {plan} يوم
                  </Button>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          className="pr-9" 
          placeholder="بحث باسم السورة أو رقمها..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="input-search-surah"
        />
        {search && (
          <div className="absolute left-3 top-3 text-xs text-muted-foreground">
            {filteredSurahs.length} نتيجة
          </div>
        )}
      </div>

      <div className="grid gap-3" data-testid="surah-list">
        {filteredSurahs.length > 0 ? (
          filteredSurahs.map((surah) => (
            <Link key={surah.number} href={`/quran/${surah.number}`} className="block">
              <Card className="cursor-pointer hover:bg-accent/50 transition-colors hover:shadow-md" data-testid={`card-surah-${surah.number}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center h-12 w-12 shrink-0">
                       <div className="absolute inset-0 border-2 border-primary/20 rounded-full rotate-45" />
                       <span className="font-bold text-sm text-primary">{surah.number}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{surah.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {surah.type === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.verses} آيات
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground font-serif tracking-widest opacity-50 hidden sm:block">
                      {surah.english}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>لا توجد نتائج للبحث عن "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function QuranReader({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const surah = surahMetadata.find(s => s.number === id);
  const text = getSurahText(id);
  const [lastRead, setLastRead] = useLocalStorage<{surah: number, name: string} | null>("last-read", null);
  const [khushooMode, setKhushooMode] = useState(false);
  const [readingTimer, setReadingTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  if (surah && (!lastRead || lastRead.surah !== id)) {
      setLastRead({ surah: id, name: surah.name });
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setReadingTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    setTimerActive(true);
    return () => setTimerActive(false);
  }, [id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!surah) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">السورة غير موجودة</h1>
          <Link href="/quran"><Button variant="outline">العودة للفهرس</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 pt-6 px-4 transition-all duration-500 ${
      khushooMode 
        ? 'bg-[#1a1a2e] dark:bg-black' 
        : 'bg-[#fdfbf7] dark:bg-zinc-950'
    }`}>
      <AnimatePresence>
        {!khushooMode && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between mb-8 border-b border-border/10 pb-4"
          >
            <Link href="/quran">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-2xl font-serif font-bold text-primary">سورة {surah.name}</h1>
              <p className="text-xs text-muted-foreground">
                السورة رقم {surah.number} • {surah.type === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.verses} آيات
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setKhushooMode(true)}
                data-testid="button-khushoo"
              >
                <Eye className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-bookmark">
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {khushooMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 left-4 right-4 flex justify-between items-center z-50"
        >
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setKhushooMode(false)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <EyeOff className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <Timer className="h-4 w-4" />
            {formatTime(readingTimer)}
          </div>
        </motion.div>
      )}

      <div className={`max-w-2xl mx-auto text-center space-y-8 px-2 transition-all duration-500 ${
        khushooMode ? 'pt-16' : ''
      }`}>
        {text ? (
            <>
                {id !== 1 && id !== 9 && (
                  <div className={`font-serif mb-6 transition-all duration-500 ${
                    khushooMode 
                      ? 'text-2xl text-white/70' 
                      : 'text-xl text-foreground/70'
                  }`}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                )}
                <p 
                  className={`leading-[2.6] md:leading-[2.8] font-serif text-justify transition-all duration-500 ${
                    khushooMode 
                      ? 'text-3xl md:text-4xl text-white/90 leading-[3]' 
                      : 'text-2xl md:text-3xl text-foreground/90'
                  }`} 
                  dir="rtl" 
                  data-testid="text-surah-content"
                >
                    {text}
                </p>
            </>
        ) : (
            <div className="py-20 text-center space-y-4">
                <div className="text-6xl mb-4">📖</div>
                <h2 className={`text-xl font-bold ${khushooMode ? 'text-white' : 'text-foreground'}`}>
                  نص السورة غير متوفر حالياً
                </h2>
                <p className={khushooMode ? 'text-white/60' : 'text-muted-foreground'}>
                  تم توفير النص الكامل لسور: الفاتحة (1)، وسور جزء عم (78-114).
                  <br />
                  باقي السور ستكون متاحة قريباً بإذن الله.
                </p>
                <div className="pt-4">
                  <Link href="/quran">
                    <Button variant="outline">العودة للفهرس</Button>
                  </Link>
                </div>
            </div>
        )}
      </div>
      
      <AnimatePresence>
        {!khushooMode && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-24 left-0 right-0 px-6 flex justify-between pointer-events-none gap-4"
          >
            {id > 1 && (
              <Link href={`/quran/${id - 1}`}>
                <Button className="pointer-events-auto rounded-full shadow-lg h-12 w-12" size="icon" variant="secondary" data-testid="button-prev-surah">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <div className="flex-1" />
            {id < 114 && (
              <Link href={`/quran/${id + 1}`}>
                <Button className="pointer-events-auto rounded-full shadow-lg h-12 w-12" size="icon" variant="secondary" data-testid="button-next-surah">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
