import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Share2, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { athkarData } from "@/lib/athkar-data";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/lib/use-local-storage";

type CategoryKey = keyof typeof athkarData;

const categories: { id: CategoryKey; label: string; icon: string; desc: string }[] = [
  { id: 'morning', label: 'أذكار الصباح', icon: '🌅', desc: 'بداية يومك بذكر الله' },
  { id: 'evening', label: 'أذكار المساء', icon: '🌃', desc: 'حصن نفسك في المساء' },
  { id: 'prayer', label: 'أذكار الصلاة', icon: '🤲', desc: 'التسبيح والتهليل' },
  { id: 'sleep', label: 'أذكار النوم', icon: '🛌', desc: 'قبل النوم' },
  { id: 'waking', label: 'أذكار الاستيقاظ', icon: '☀️', desc: 'عند الاستيقاظ' },
  { id: 'travel', label: 'أذكار السفر', icon: '✈️', desc: 'دعاء السفر' },
];

export default function AthkarPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);

  return (
    <div className="min-h-screen bg-background pb-24 pt-10 px-4">
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h1 className="text-2xl font-bold mb-6 text-primary">الأذكار</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <Card 
                  key={cat.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors border-l-4 border-l-primary/0 hover:border-l-primary"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <span>{cat.icon}</span> {cat.label}
                      </h3>
                      <p className="text-sm text-muted-foreground mr-8">{cat.desc}</p>
                    </div>
                    <ArrowLeft className="h-5 w-5 text-muted-foreground/30" />
                  </CardContent>
                </Card>
              ))}
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
  const [progress, setProgress] = useLocalStorage<Record<string, number>>(`athkar-progress-${new Date().toDateString()}`, {});

  const currentThikr = data[currentIndex];
  
  // Update counter when index changes
  useEffect(() => {
    setCounter(currentThikr.count);
  }, [currentIndex, currentThikr]);

  const handleTap = () => {
    if (counter > 1) {
      setCounter(c => c - 1);
      // Haptic feedback if available
      if (navigator.vibrate) navigator.vibrate(5);
    } else {
      if (currentIndex < data.length - 1) {
        // Mark progress
        setProgress(prev => ({ ...prev, [category]: (prev[category] || 0) + 1 }));
        
        setCurrentIndex(c => c + 1);
        if (navigator.vibrate) navigator.vibrate(20);
      } else {
        // Finished category
        setProgress(prev => ({ ...prev, [category]: (prev[category] || 0) + 1 }));
        toast({ title: "أحسنت!", description: "لقد أتممت الأذكار" });
        onBack();
      }
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(currentThikr.text);
    toast({ description: "تم نسخ الذكر" });
  };

  return (
    <motion.div 
      key="detail"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-[85vh]"
    >
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowRight className="h-6 w-6" /> {/* RTL arrow */}
        </Button>
        <h2 className="text-xl font-bold mr-2">
          {categories.find(c => c.id === category)?.label}
        </h2>
        <div className="mr-auto text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-mono">
          {currentIndex + 1} / {data.length}
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        <Card className="flex-1 bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm overflow-auto">
          <CardContent className="p-6 text-center flex flex-col justify-center h-full min-h-[300px]">
            <p className="text-2xl md:text-3xl leading-[2] md:leading-[2.2] font-serif text-foreground/90 font-medium">
              {currentThikr.text}
            </p>
            {currentThikr.source && (
              <p className="text-sm text-muted-foreground mt-6 font-light">
                {currentThikr.source}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 py-2">
          <Button variant="outline" size="sm" onClick={copyText} className="gap-2">
            <Copy className="h-4 w-4" /> نسخ
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" /> مشاركة
          </Button>
        </div>

        {/* Counter Area */}
        <div className="pb-8 pt-4 flex flex-col items-center">
            <div 
            onClick={handleTap}
            className="relative w-28 h-28 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center cursor-pointer shadow-xl active:scale-95 transition-transform select-none ring-4 ring-primary/20 hover:ring-primary/40"
            >
                <div className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white animate-spin duration-3000" style={{ animationDuration: '10s' }} />
                <span className="text-4xl font-bold font-mono z-10">{counter}</span>
                <span className="text-[10px] opacity-80 mt-1 z-10">اضغط</span>
            </div>
        </div>
      </div>
    </motion.div>
  );
}
