import { usePrayer } from "@/lib/prayer-context";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { motion } from "framer-motion";
import { Settings, RefreshCw, ChevronLeft, Share2, Compass, MapPin, Navigation, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Prayer } from "adhan";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { getDirectionsUrl } from "@/lib/mosque-finder";

// Daily content data
const dailyVerses = [
  { text: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ", surah: "سورة الزمر: 53" },
  { text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ", surah: "سورة الطلاق: 2-3" },
  { text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", surah: "سورة الشرح: 6" },
  { text: "وَقُل رَّبِّ زِدْنِي عِلْمًا", surah: "سورة طه: 114" },
  { text: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", surah: "سورة البقرة: 152" }
];

const dailyHadiths = [
  { text: "قال النَّبِيِّ صَلَّى الله عَلَيْهِ وسَلَّمَ: «لَوْ كَانَ لابْنِ آدَمَ وَادِيَانِ مِنْ مَالٍ لابْتَغَى ثَالِثًا، وَلا يَمْلأُ جَوْفَ ابْنِ آدَمَ إِلاَّ التُّرَابُ، وَيَتُوبُ اللَّهُ عَلَى مَنْ تَابَ»." },
  { text: "قال رسول الله ﷺ: «الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ»." },
  { text: "قال رسول الله ﷺ: «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى»." },
  { text: "قال رسول الله ﷺ: «مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَاليَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ»." }
];

const dailyDuas = [
  { text: "اللَّهُمَّ إِنَّا نَعُوذُ بِكَ مِنْ أَنْ نُشْرِكَ بِكَ شَيْئًا نَعْلَمُهُ، وَنَسْتَغْفِرُكَ لِمَا لَا نَعْلَمُهُ." },
  { text: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي." },
  { text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى." },
  { text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ." }
];

function getDailyContent() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return {
    verse: dailyVerses[dayOfYear % dailyVerses.length],
    hadith: dailyHadiths[dayOfYear % dailyHadiths.length],
    dua: dailyDuas[dayOfYear % dailyDuas.length]
  };
}

export default function HomePage() {
  const { prayerTimes, nextPrayer, timeToNextPrayer, settings, refreshLocation, nearestMosque, mosqueLoading, refreshMosque } = usePrayer();
  const [lastRead] = useLocalStorage<{surah: number, name: string} | null>("last-read", null);
  const dailyContent = getDailyContent();
  
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

  const shareContent = async (text: string) => {
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

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

      {/* Next Prayer Widget */}
      <div className="px-4 mb-4">
        <Card className="bg-card shadow-sm overflow-hidden">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">الصلاة القادمة</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-3xl font-bold text-primary font-mono tabular-nums" data-testid="text-countdown">
                {timeToNextPrayer || "00:00:00"}
              </span>
              <span className="text-3xl font-bold text-foreground" data-testid="text-next-prayer">{nextPrayerName}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2" data-testid="text-hijri-date">{todayHijri}</p>
          </CardContent>
        </Card>
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
                <p className="text-sm text-muted-foreground">جاري البحث عن أقرب مسجد...</p>
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
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90" 
                    data-testid="btn-open-mosque-directions"
                  >
                    <Navigation className="h-4 w-4 ml-2" />
                    توجه الآن
                  </Button>
                </a>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">اضغط على تحديث لإيجاد أقرب مسجد</p>
                <Button 
                  variant="outline" 
                  onClick={refreshMosque}
                  data-testid="btn-find-mosque"
                >
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
              <p className="text-sm opacity-90 mb-1">متابعة المصحف من حيث توقفت</p>
              <h3 className="text-xl font-bold mb-1">{lastRead?.name || "الفاتحة"}</h3>
              <p className="text-sm opacity-80">الصفحة 1</p>
              <Link href={lastRead ? `/quran/${lastRead.surah}` : "/quran/1"}>
                <Button className="mt-3 bg-white/20 hover:bg-white/30 text-white border-0" size="sm" data-testid="btn-continue-reading">
                  متابعة
                </Button>
              </Link>
            </div>
            <div className="text-6xl opacity-30 font-serif">القرآن</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3 text-foreground">الأنشطة الأخيرة</h2>
        <Link href="/athkar">
          <Card className="bg-gradient-to-l from-[#3B5998] to-[#2D4373] text-white cursor-pointer hover:opacity-95 transition-opacity">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                  🌙
                </div>
                <span className="font-medium">أذكار المساء</span>
              </div>
              <ChevronLeft className="h-5 w-5 opacity-70" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Verse of the Day */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">آية اليوم</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={() => shareContent(dailyContent.verse.text)}
            data-testid="btn-share-verse"
          >
            مشاركة
          </Button>
        </div>
        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <p className="text-lg leading-relaxed font-serif text-foreground mb-2 arabic-text" data-testid="text-daily-verse">
              {dailyContent.verse.text}
            </p>
            <p className="text-sm text-muted-foreground text-left">{dailyContent.verse.surah}</p>
          </CardContent>
        </Card>
      </div>

      {/* Hadith of the Day */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">حديث اليوم</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={() => shareContent(dailyContent.hadith.text)}
            data-testid="btn-share-hadith"
          >
            مشاركة
          </Button>
        </div>
        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <p className="text-lg leading-relaxed font-serif text-foreground arabic-text" data-testid="text-daily-hadith">
              {dailyContent.hadith.text}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dua of the Day */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">دعاء اليوم</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={() => shareContent(dailyContent.dua.text)}
            data-testid="btn-share-dua"
          >
            مشاركة
          </Button>
        </div>
        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <p className="text-lg leading-relaxed font-serif text-foreground arabic-text" data-testid="text-daily-dua">
              {dailyContent.dua.text}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
