import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Settings, Bookmark, Heart, ChevronLeft, ChevronRight, Copy, Hand } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { athkarCategories, type AthkarCategory, type Dhikr } from "@/lib/athkar-data";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Link } from "wouter";

const mainCategories = ['morning', 'evening', 'after_prayer', 'waking', 'sleep', 'travel'];

const dailyCategories = athkarCategories.filter(c => mainCategories.includes(c.id));

const prayerCategories = athkarCategories.filter(c => 
  ['before_wudu', 'after_wudu', 'going_mosque', 'entering_mosque', 'leaving_mosque', 'adhan', 'istiftah', 'rukoo', 'rising_rukoo', 'sujood', 'between_sujood', 'tashahhud', 'salah_on_prophet', 'before_salam', 'after_prayer', 'qunut'].includes(c.id)
);

const lifeCategories = athkarCategories.filter(c => 
  ['leaving_home', 'entering_home', 'bathroom_enter', 'bathroom_exit', 'clothing', 'new_clothing', 'before_food', 'after_food', 'guest', 'sneezing', 'marriage', 'intimacy', 'baby', 'children', 'riding', 'travel', 'return_travel', 'entering_town', 'market'].includes(c.id)
);

const emotionalCategories = athkarCategories.filter(c => 
  ['worry', 'distress', 'anger', 'fear', 'doubt', 'waswas', 'difficulty', 'sin', 'debt', 'enemy', 'oppressor', 'afflicted', 'calamity'].includes(c.id)
);

const specialCategories = athkarCategories.filter(c => 
  ['istikhara', 'sick_visit', 'dying', 'dead_prayer', 'burial', 'after_burial', 'condolence', 'grave_visit', 'wind', 'thunder', 'rain', 'after_rain', 'new_moon', 'iftar', 'hajj', 'arafah', 'pain', 'evil_eye', 'slaughter', 'devils', 'dajjal', 'love', 'shirk', 'thanks', 'gathering', 'istighfar', 'tasbih', 'bad_dream'].includes(c.id)
);

export default function AthkarPage() {
  const [selectedCategory, setSelectedCategory] = useState<AthkarCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = searchQuery 
    ? athkarCategories.filter(c => 
        c.name.includes(searchQuery) || 
        c.items.some(item => item.text.includes(searchQuery))
      )
    : null;

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

            {searchQuery && filteredCategories ? (
              <div className="px-4">
                <h2 className="font-bold text-foreground mb-3">نتائج البحث ({filteredCategories.length})</h2>
                <div className="grid grid-cols-3 gap-3">
                  {filteredCategories.map((cat) => (
                    <Card 
                      key={cat.id}
                      className="cursor-pointer hover:shadow-md transition-shadow bg-card"
                      onClick={() => setSelectedCategory(cat)}
                      data-testid={`card-athkar-${cat.id}`}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${cat.color}30` }}>
                          {cat.icon}
                        </div>
                        <h3 className="font-medium text-foreground text-xs line-clamp-2">{cat.name}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Smart Tasbih Counter */}
                <div className="px-4 mb-6">
                  <Link href="/tasbih">
                    <Card className="bg-gradient-to-l from-[#709046] to-[#5a7338] text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
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
                    <Card className="bg-gradient-to-l from-[#f4b360] to-[#e09840] text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
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

                {/* Daily Athkar */}
                <div className="px-4 mb-6">
                  <h2 className="font-bold text-foreground mb-3">أذكار اليوم</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {dailyCategories.map((cat) => (
                      <Card 
                        key={cat.id}
                        className="cursor-pointer hover:shadow-md transition-shadow bg-card"
                        onClick={() => setSelectedCategory(cat)}
                        data-testid={`card-athkar-${cat.id}`}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${cat.color}30` }}>
                            {cat.icon}
                          </div>
                          <h3 className="font-medium text-foreground text-xs line-clamp-2">{cat.name}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Prayer Athkar */}
                <div className="px-4 mb-6">
                  <h2 className="font-bold text-foreground mb-3">أذكار الصلاة والوضوء</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {prayerCategories.slice(0, 9).map((cat) => (
                      <Card 
                        key={cat.id}
                        className="cursor-pointer hover:shadow-md transition-shadow bg-card"
                        onClick={() => setSelectedCategory(cat)}
                        data-testid={`card-athkar-${cat.id}`}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${cat.color}30` }}>
                            {cat.icon}
                          </div>
                          <h3 className="font-medium text-foreground text-xs line-clamp-2">{cat.name}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {prayerCategories.length > 9 && (
                    <ExpandableSection title="المزيد من أذكار الصلاة" categories={prayerCategories.slice(9)} onSelect={setSelectedCategory} />
                  )}
                </div>

                {/* Life Athkar */}
                <div className="px-4 mb-6">
                  <h2 className="font-bold text-foreground mb-3">أذكار الحياة اليومية</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {lifeCategories.slice(0, 9).map((cat) => (
                      <Card 
                        key={cat.id}
                        className="cursor-pointer hover:shadow-md transition-shadow bg-card"
                        onClick={() => setSelectedCategory(cat)}
                        data-testid={`card-athkar-${cat.id}`}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${cat.color}30` }}>
                            {cat.icon}
                          </div>
                          <h3 className="font-medium text-foreground text-xs line-clamp-2">{cat.name}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {lifeCategories.length > 9 && (
                    <ExpandableSection title="المزيد من أذكار الحياة" categories={lifeCategories.slice(9)} onSelect={setSelectedCategory} />
                  )}
                </div>

                {/* Emotional/Distress Athkar */}
                <div className="px-4 mb-6">
                  <h2 className="font-bold text-foreground mb-3">أذكار الهم والكرب</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {emotionalCategories.slice(0, 9).map((cat) => (
                      <Card 
                        key={cat.id}
                        className="cursor-pointer hover:shadow-md transition-shadow bg-card"
                        onClick={() => setSelectedCategory(cat)}
                        data-testid={`card-athkar-${cat.id}`}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${cat.color}30` }}>
                            {cat.icon}
                          </div>
                          <h3 className="font-medium text-foreground text-xs line-clamp-2">{cat.name}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {emotionalCategories.length > 9 && (
                    <ExpandableSection title="المزيد" categories={emotionalCategories.slice(9)} onSelect={setSelectedCategory} />
                  )}
                </div>

                {/* Special Occasions */}
                <div className="px-4 mb-6">
                  <h2 className="font-bold text-foreground mb-3">أذكار المناسبات والأحوال</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {specialCategories.slice(0, 9).map((cat) => (
                      <Card 
                        key={cat.id}
                        className="cursor-pointer hover:shadow-md transition-shadow bg-card"
                        onClick={() => setSelectedCategory(cat)}
                        data-testid={`card-athkar-${cat.id}`}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${cat.color}30` }}>
                            {cat.icon}
                          </div>
                          <h3 className="font-medium text-foreground text-xs line-clamp-2">{cat.name}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {specialCategories.length > 9 && (
                    <ExpandableSection title="المزيد من الأذكار" categories={specialCategories.slice(9)} onSelect={setSelectedCategory} />
                  )}
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <AthkarDetail 
            category={selectedCategory} 
            onBack={() => setSelectedCategory(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ExpandableSection({ title, categories, onSelect }: { title: string; categories: AthkarCategory[]; onSelect: (cat: AthkarCategory) => void }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!expanded) {
    return (
      <Button 
        variant="ghost" 
        className="w-full mt-2 text-primary"
        onClick={() => setExpanded(true)}
      >
        {title} ({categories.length})
      </Button>
    );
  }
  
  return (
    <div className="grid grid-cols-3 gap-3 mt-3">
      {categories.map((cat) => (
        <Card 
          key={cat.id}
          className="cursor-pointer hover:shadow-md transition-shadow bg-card"
          onClick={() => onSelect(cat)}
          data-testid={`card-athkar-${cat.id}`}
        >
          <CardContent className="p-3 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: `${cat.color}30` }}>
              {cat.icon}
            </div>
            <h3 className="font-medium text-foreground text-xs line-clamp-2">{cat.name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AthkarDetail({ category, onBack }: { category: AthkarCategory; onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [counter, setCounter] = useState(category.items[0]?.count || 1);
  const { toast } = useToast();

  const currentThikr = category.items[currentIndex];
  
  useEffect(() => {
    if (currentThikr) {
      setCounter(currentThikr.count);
    }
  }, [currentIndex, currentThikr]);

  const handleTap = () => {
    if (!currentThikr) return;
    
    if (counter > 1) {
      setCounter(c => c - 1);
      if (navigator.vibrate) navigator.vibrate(5);
    } else {
      if (currentIndex < category.items.length - 1) {
        setCurrentIndex(c => c + 1);
        if (navigator.vibrate) navigator.vibrate(20);
      } else {
        toast({ title: "أحسنت!", description: "لقد أتممت الأذكار" });
        onBack();
      }
    }
  };

  const copyText = () => {
    if (currentThikr) {
      navigator.clipboard.writeText(currentThikr.text);
      toast({ description: "تم نسخ الذكر" });
    }
  };

  if (!currentThikr) {
    return (
      <div className="p-4 text-center">
        <p>لا توجد أذكار في هذه الفئة</p>
        <Button onClick={onBack} className="mt-4">العودة</Button>
      </div>
    );
  }

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
        <h2 className="text-lg font-bold text-foreground flex-1 line-clamp-1">{category.name}</h2>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-mono text-sm" data-testid="text-athkar-progress">
          {currentIndex + 1} / {category.items.length}
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
            <p className="text-xl leading-relaxed font-serif arabic-text text-foreground mb-4" data-testid="text-thikr">
              {currentThikr.text}
            </p>
            
            {currentThikr.source && (
              <p className="text-xs text-muted-foreground mb-4">📚 {currentThikr.source}</p>
            )}
            
            {/* Counter */}
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold shadow-lg" data-testid="text-counter">
              {counter}
            </div>
            <p className="text-sm text-muted-foreground mt-3">اضغط للتسبيح</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4 mb-4">
          <Button variant="outline" size="icon" className="rounded-full" onClick={copyText} data-testid="btn-copy-thikr">
            <Copy className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Arrows */}
        {category.items.length > 1 && (
          <div className="flex items-center justify-between px-4 pb-6">
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full w-14 h-14 shadow-md"
              onClick={() => {
                if (currentIndex < category.items.length - 1) {
                  setCurrentIndex(c => c + 1);
                }
              }}
              disabled={currentIndex >= category.items.length - 1}
              data-testid="btn-next-thikr"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="flex flex-col items-center">
              <div className="flex gap-1">
                {category.items.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {currentIndex + 1} من {category.items.length}
              </p>
            </div>

            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full w-14 h-14 shadow-md"
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex(c => c - 1);
                }
              }}
              disabled={currentIndex <= 0}
              data-testid="btn-prev-thikr"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
