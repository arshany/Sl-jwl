import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Settings, Bookmark, Heart, ChevronLeft, Copy, Hand } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { athkarData } from "@/lib/athkar-data";
import { contextualAthkar } from "@/lib/spiritual-data";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Link } from "wouter";

type CategoryKey = keyof typeof athkarData;

const categories: { id: CategoryKey; label: string; icon: string; color: string }[] = [
  { id: 'morning', label: 'أذكار الصباح', icon: '☀️', color: 'bg-[#f4b360]/30' },
  { id: 'evening', label: 'أذكار المساء', icon: '🌙', color: 'bg-[#bedbe8]/50' },
  { id: 'prayer', label: 'أذكار الصلاة', icon: '🕌', color: 'bg-[#709046]/20' },
  { id: 'waking', label: 'أذكار بعد الصلاة', icon: '🤲', color: 'bg-[#bbac92]/30' },
  { id: 'sleep', label: 'أذكار النوم', icon: '🛏️', color: 'bg-[#bedbe8]/40' },
  { id: 'travel', label: 'أذكار السفر', icon: '✈️', color: 'bg-[#f4b360]/20' },
];

const contextCategories = Object.entries(contextualAthkar).map(([key, value]) => ({
  id: key,
  label: value.title,
  icon: value.icon,
  description: value.description,
}));

export default function AthkarPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background pb-24">
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Header */}
            <header className="flex items-center justify-between p-4 pt-6">
              <div className="flex items-center gap-2">
                <Link href="/settings">
                  <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary" data-testid="btn-athkar-settings">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary" data-testid="btn-athkar-bookmark">
                  <Bookmark className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary" data-testid="btn-athkar-favorite">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              <h1 className="text-xl font-bold text-primary" data-testid="text-athkar-title">الأذكار</h1>
            </header>

            {/* Search */}
            <div className="px-4 mb-6">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="إبحث عن ذكر"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 bg-card border-0 shadow-sm"
                  data-testid="input-athkar-search"
                />
              </div>
            </div>

            {/* Smart Tasbih Counter */}
            <div className="px-4 mb-6">
              <Link href="/tasbih">
                <Card className="bg-gradient-to-l from-primary to-primary/90 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                      📿
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">عداد التسبيح الذكي</h3>
                      <p className="text-sm opacity-80">باللمس أو هز الجوال</p>
                    </div>
                    <ChevronLeft className="h-6 w-6 opacity-70" />
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Dua by Mood */}
            <div className="px-4 mb-6">
              <Link href="/dua-mood">
                <Card className="bg-gradient-to-l from-purple-600 to-purple-700 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                      🤲
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">دعاء حسب حالتك</h3>
                      <p className="text-sm opacity-80">قلق • حزن • فرح • قرار مهم</p>
                    </div>
                    <ChevronLeft className="h-6 w-6 opacity-70" />
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Icon Categories Grid */}
            <div className="px-4 mb-6">
              <h2 className="font-bold text-foreground mb-3">أذكار اليوم</h2>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <Card 
                    key={cat.id}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-card"
                    onClick={() => setSelectedCategory(cat.id)}
                    data-testid={`card-athkar-${cat.id}`}
                  >
                    <CardContent className="p-3 text-center">
                      <div className={`w-10 h-10 mx-auto mb-2 rounded-lg ${cat.color} flex items-center justify-center text-xl`}>
                        {cat.icon}
                      </div>
                      <h3 className="font-medium text-foreground text-xs">{cat.label}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contextual Athkar */}
            <div className="px-4">
              <h2 className="font-bold text-foreground mb-3">أذكار حسب الوقت والمكان</h2>
              <div className="grid grid-cols-2 gap-3">
                {contextCategories.map((cat) => (
                  <Card 
                    key={cat.id}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-card"
                    data-testid={`card-context-${cat.id}`}
                  >
                    <CardContent className="p-3 text-center">
                      <span className="text-2xl block mb-1">{cat.icon}</span>
                      <h3 className="font-medium text-foreground text-sm">{cat.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <AthkarDetail 
            category={selectedCategory} 
            data={athkarData[selectedCategory]} 
            onBack={() => setSelectedCategory(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AthkarDetail({ category, data, onBack }: { category: string, data: typeof athkarData['morning'], onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [counter, setCounter] = useState(data[0].count);
  const { toast } = useToast();

  const currentThikr = data[currentIndex];
  
  useEffect(() => {
    setCounter(currentThikr.count);
  }, [currentIndex, currentThikr]);

  const handleTap = () => {
    if (counter > 1) {
      setCounter(c => c - 1);
      if (navigator.vibrate) navigator.vibrate(5);
    } else {
      if (currentIndex < data.length - 1) {
        setCurrentIndex(c => c + 1);
        if (navigator.vibrate) navigator.vibrate(20);
      } else {
        toast({ title: "أحسنت!", description: "لقد أتممت الأذكار" });
        onBack();
      }
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(currentThikr.text);
    toast({ description: "تم نسخ الذكر" });
  };

  const categoryLabel = categories.find(c => c.id === category)?.label || "";

  return (
    <motion.div 
      key="detail"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen"
    >
      {/* Header */}
      <header className="flex items-center p-4 pt-6 gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full" data-testid="btn-athkar-back">
          <ArrowRight className="h-6 w-6" />
        </Button>
        <h2 className="text-lg font-bold text-foreground flex-1">{categoryLabel}</h2>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-mono text-sm" data-testid="text-athkar-progress">
          {currentIndex + 1} / {data.length}
        </div>
      </header>

      {/* Thikr Card */}
      <div className="flex-1 px-4 flex flex-col">
        <Card 
          className="flex-1 bg-card shadow-lg cursor-pointer active:scale-[0.99] transition-transform mb-4"
          onClick={handleTap}
          data-testid="card-thikr"
        >
          <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
            <p className="text-xl leading-relaxed font-serif arabic-text text-foreground mb-6" data-testid="text-thikr">
              {currentThikr.text}
            </p>
            
            {/* Counter */}
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold shadow-lg" data-testid="text-counter">
              {counter}
            </div>
            <p className="text-sm text-muted-foreground mt-3">اضغط للتسبيح</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4 mb-6">
          <Button variant="outline" size="icon" className="rounded-full" onClick={copyText} data-testid="btn-copy-thikr">
            <Copy className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
