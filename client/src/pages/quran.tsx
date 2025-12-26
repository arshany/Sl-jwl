import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link, Route, Switch } from "wouter";

// Simplified list of Surahs
const surahs = [
  { number: 1, name: "الفاتحة", verses: 7, type: "Meccan" },
  { number: 2, name: "البقرة", verses: 286, type: "Medinan" },
  { number: 3, name: "آل عمران", verses: 200, type: "Medinan" },
  { number: 4, name: "النساء", verses: 176, type: "Medinan" },
  { number: 5, name: "المائدة", verses: 120, type: "Medinan" },
  { number: 6, name: "الأنعام", verses: 165, type: "Meccan" },
  { number: 7, name: "الأعراف", verses: 206, type: "Meccan" },
  { number: 8, name: "الأنفال", verses: 75, type: "Medinan" },
  { number: 9, name: "التوبة", verses: 129, type: "Medinan" },
  { number: 10, name: "يونس", verses: 109, type: "Meccan" },
  { number: 18, name: "الكهف", verses: 110, type: "Meccan" },
  { number: 36, name: "يس", verses: 83, type: "Meccan" },
  { number: 55, name: "الرحمن", verses: 78, type: "Medinan" },
  { number: 56, name: "الواقعة", verses: 96, type: "Meccan" },
  { number: 67, name: "الملك", verses: 30, type: "Meccan" },
  { number: 112, name: "الإخلاص", verses: 4, type: "Meccan" },
  { number: 113, name: "الفلق", verses: 5, type: "Meccan" },
  { number: 114, name: "الناس", verses: 6, type: "Meccan" },
];

export default function QuranRouter() {
  return (
    <Switch>
      <Route path="/quran" component={QuranIndex} />
      <Route path="/quran/:id" component={QuranReader} />
    </Switch>
  );
}

function QuranIndex() {
  const [search, setSearch] = useState("");

  const filteredSurahs = surahs.filter(s => s.name.includes(search));

  return (
    <div className="min-h-screen bg-background pb-24 pt-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-primary mb-6">القرآن الكريم</h1>
      
      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          className="pr-9" 
          placeholder="بحث عن سورة..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-3">
        {filteredSurahs.map((surah) => (
          <Link key={surah.number} href={`/quran/${surah.number}`}>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary/10 text-secondary-foreground font-bold h-10 w-10 rounded-full flex items-center justify-center text-sm border border-secondary/20">
                    {surah.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{surah.name}</h3>
                    <p className="text-xs text-muted-foreground">{surah.type === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.verses} آيات</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function QuranReader({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const surah = surahs.find(s => s.number === id);

  return (
    <div className="min-h-screen bg-[#fdfbf7] dark:bg-background pb-24 pt-6 px-4">
      <div className="text-center mb-8 border-b border-border/10 pb-4">
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">سورة {surah?.name}</h1>
        <p className="text-sm text-muted-foreground">بسم الله الرحمن الرحيم</p>
      </div>

      <div className="max-w-2xl mx-auto text-center space-y-8 px-2">
        {/* Placeholder verses logic */}
        <p className="text-2xl leading-[2.5] font-serif text-foreground/90" dir="rtl">
           {/* Simple placeholder text since we don't have the full Quran text DB */}
           {id === 1 ? (
             <>
               الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ
             </>
           ) : (
             <span className="opacity-70 italic">
               (نص السورة غير متوفر في وضع المعاينة. سيتم تحميل النص الكامل في النسخة النهائية)
               <br/>
               قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ
             </span>
           )}
        </p>
      </div>
    </div>
  );
}
