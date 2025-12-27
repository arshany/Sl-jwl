import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { duaByMood, DuaMoodKey } from "@/lib/spiritual-data";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const moodKeys = Object.keys(duaByMood) as DuaMoodKey[];

export default function DuaMoodPage() {
  const [selectedMood, setSelectedMood] = useState<DuaMoodKey | null>(null);
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);
  const { toast } = useToast();

  const handleMoodSelect = (mood: DuaMoodKey) => {
    setSelectedMood(mood);
    setCurrentDuaIndex(0);
  };

  const copyDua = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "تم نسخ الدعاء" });
  };

  const shareDua = async (text: string, source: string) => {
    const fullText = `${text}\n\n📖 ${source}\n\n🤲 من تطبيق صلاة تايم`;
    if (navigator.share) {
      try {
        await navigator.share({ text: fullText });
      } catch {}
    } else {
      navigator.clipboard.writeText(fullText);
      toast({ description: "تم نسخ الدعاء" });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AnimatePresence mode="wait">
        {!selectedMood ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <header className="flex items-center p-4 pt-6 gap-2">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full" data-testid="btn-dua-back">
                  <ArrowRight className="h-6 w-6" />
                </Button>
              </Link>
              <h2 className="text-lg font-bold text-foreground flex-1">دعاء حسب حالتك</h2>
            </header>

            <div className="px-4 mb-4">
              <p className="text-muted-foreground text-center mb-6">
                كيف حالك اليوم؟ اختر ما يناسبك
              </p>
            </div>

            <div className="px-4 grid grid-cols-2 gap-4">
              {moodKeys.map((key) => {
                const mood = duaByMood[key];
                return (
                  <Card
                    key={key}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleMoodSelect(key)}
                    data-testid={`card-mood-${key}`}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`w-14 h-14 mx-auto mb-3 rounded-xl ${mood.color} flex items-center justify-center text-3xl`}>
                        {mood.icon}
                      </div>
                      <h3 className="font-medium text-foreground">{mood.title}</h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col min-h-screen"
          >
            <header className="flex items-center p-4 pt-6 gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedMood(null)} 
                className="rounded-full"
                data-testid="btn-dua-detail-back"
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
              <div className={`w-8 h-8 rounded-lg ${duaByMood[selectedMood].color} flex items-center justify-center text-lg`}>
                {duaByMood[selectedMood].icon}
              </div>
              <h2 className="text-lg font-bold text-foreground flex-1">
                {duaByMood[selectedMood].title}
              </h2>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-mono text-sm">
                {currentDuaIndex + 1} / {duaByMood[selectedMood].duas.length}
              </div>
            </header>

            <div className="flex-1 px-4 flex flex-col">
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {duaByMood[selectedMood].duas.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentDuaIndex(idx)}
                    className={`flex-shrink-0 w-10 h-10 rounded-full transition-all ${
                      currentDuaIndex === idx 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <Card className="flex-1 bg-card shadow-lg">
                <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentDuaIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="w-full"
                    >
                      <p className="text-xl leading-relaxed font-serif arabic-text text-foreground mb-6" data-testid="text-dua">
                        {duaByMood[selectedMood].duas[currentDuaIndex].text}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        📖 {duaByMood[selectedMood].duas[currentDuaIndex].source}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4 mt-4 mb-6">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => copyDua(duaByMood[selectedMood].duas[currentDuaIndex].text)}
                  data-testid="btn-copy-dua"
                >
                  <Copy className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => shareDua(
                    duaByMood[selectedMood].duas[currentDuaIndex].text,
                    duaByMood[selectedMood].duas[currentDuaIndex].source
                  )}
                  data-testid="btn-share-dua"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex justify-between mb-6">
                <Button
                  variant="ghost"
                  disabled={currentDuaIndex === 0}
                  onClick={() => setCurrentDuaIndex(c => c - 1)}
                >
                  السابق
                </Button>
                <Button
                  variant="ghost"
                  disabled={currentDuaIndex === duaByMood[selectedMood].duas.length - 1}
                  onClick={() => setCurrentDuaIndex(c => c + 1)}
                >
                  التالي
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
