import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Bookmark, BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useRoute } from "wouter";
import { surahMetadata, juzAmmaText } from "@/lib/quran-data";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Button } from "@/components/ui/button";

export default function QuranPage() {
  const [, params] = useRoute("/quran/:id");
  
  if (params?.id) {
    return <QuranReader id={parseInt(params.id)} />;
  }
  
  return <QuranIndex />;
}

function QuranIndex() {
  const [search, setSearch] = useState("");
  const [lastRead] = useLocalStorage<{surah: number, name: string} | null>("last-read", null);

  const filteredSurahs = useMemo(() => {
    return surahMetadata.filter(s => 
        s.name.includes(search) || 
        s.number.toString().includes(search) ||
        s.english.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-background pb-24 pt-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-primary mb-6">القرآن الكريم</h1>
      
      {lastRead && (
         <Link href={`/quran/${lastRead.surah}`} className="block">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex justify-between items-center cursor-pointer mb-6">
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

      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          className="pr-9" 
          placeholder="بحث باسم السورة..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="input-search-surah"
        />
      </div>

      <div className="grid gap-3">
        {filteredSurahs.map((surah) => (
          <Link key={surah.number} href={`/quran/${surah.number}`} className="block">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors" data-testid={`card-surah-${surah.number}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center justify-center h-10 w-10">
                     <div className="absolute inset-0 border-2 border-secondary/30 rounded-full rotate-45" />
                     <span className="font-bold text-sm">{surah.number}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{surah.name}</h3>
                    <p className="text-xs text-muted-foreground">{surah.type === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.verses} آيات</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-serif tracking-widest opacity-50">
                    {surah.english}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function QuranReader({ id }: { id: number }) {
  const surah = surahMetadata.find(s => s.number === id);
  const text = juzAmmaText[id];
  const [lastRead, setLastRead] = useLocalStorage<{surah: number, name: string} | null>("last-read", null);

  if (surah && (!lastRead || lastRead.surah !== id)) {
      setLastRead({ surah: id, name: surah.name });
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] dark:bg-zinc-950 pb-24 pt-6 px-4">
       <div className="flex items-center justify-between mb-8 border-b border-border/10 pb-4">
         <Link href="/quran">
            <Button variant="ghost" size="icon" data-testid="button-back"><ArrowRight className="h-5 w-5" /></Button>
         </Link>
         <div className="text-center">
            <h1 className="text-2xl font-serif font-bold text-primary">سورة {surah?.name}</h1>
            <p className="text-xs text-muted-foreground">{surah?.type === 'Meccan' ? 'مكية' : 'مدنية'} • {surah?.verses} آيات</p>
         </div>
         <Button variant="ghost" size="icon" data-testid="button-bookmark"><Bookmark className="h-5 w-5" /></Button>
      </div>

      <div className="max-w-2xl mx-auto text-center space-y-8 px-2">
        {text ? (
            <>
                {id !== 1 && id !== 9 && (
                  <div className="font-serif text-xl mb-6 text-foreground/70">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                )}
                <p className="text-2xl md:text-3xl leading-[2.6] md:leading-[2.8] font-serif text-foreground/90 text-justify" dir="rtl" data-testid="text-surah-content">
                    {text}
                </p>
            </>
        ) : (
            <div className="py-20 text-center space-y-4">
                <p className="text-muted-foreground italic">
                  نص هذه السورة غير متوفر حالياً في وضع عدم الاتصال.
                  <br />
                  تم توفير سور جزء عم فقط كنماذج.
                </p>
            </div>
        )}
      </div>
      
      <div className="fixed bottom-24 left-0 right-0 px-6 flex justify-between pointer-events-none">
         {id < 114 && (
             <Link href={`/quran/${id + 1}`}>
                <Button className="pointer-events-auto rounded-full shadow-lg h-12 w-12" size="icon" variant="secondary" data-testid="button-next-surah">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
             </Link>
         )}
         <div className="flex-1" />
         {id > 1 && (
             <Link href={`/quran/${id - 1}`}>
                <Button className="pointer-events-auto rounded-full shadow-lg h-12 w-12" size="icon" variant="secondary" data-testid="button-prev-surah">
                    <ArrowRight className="h-5 w-5" />
                </Button>
             </Link>
         )}
      </div>
    </div>
  );
}
