import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Repeat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const athkarData = {
  morning: [
    { text: "أَصْـبَحْنا وَأَصْـبَحَ المُـلْكُ لله وَالحَمدُ لله ، لا إلهَ إلاّ اللّهُ وَحدَهُ لا شَريكَ لهُ، لهُ المُـلْكُ ولهُ الحَمْـد، وهُوَ على كلّ شَيءٍ قدير", count: 1 },
    { text: "اللّهُـمَّ إِنِّـي أَسْـأَلُـكَ خَـيْرَ هـذا الـيَوْم ، فَـتْحَهُ ، وَنَصْـرَهُ ، وَنـورَهُ وَبَـرَكَـتَهُ ، وَهُـداهُ ، وَأَعـوذُ بِـكَ مِـنْ شَـرِّ ما فـيهِ وَشَـرِّ ما بَعْـدَه", count: 1 },
    { text: "سُبْحـانَ اللهِ وَبِحَمْـدِهِ عَدَدَ خَلْـقِه ، وَرِضـا نَفْسِـه ، وَزِنَـةَ عَـرْشِـه ، وَمِـدادَ كَلِمـاتِـه", count: 3 },
  ],
  evening: [
    { text: "أَمْسَيْـنا وَأَمْسـى المـلكُ لله وَالحَمدُ لله ، لا إلهَ إلاّ اللّهُ وَحدَهُ لا شَريكَ لهُ، لهُ المُـلْكُ ولهُ الحَمْـد، وهُوَ على كلّ شَيءٍ قدير", count: 1 },
    { text: "اللّهُـمَّ بِكَ أَمْسَـينا وَبِكَ أَصْـبَحْنا، وَبِكَ نَحْـيا وَبِكَ نَمُـوتُ وَإِلَـيْكَ الْمَصِير", count: 1 },
  ],
  prayer: [
    { text: "أَسْـتَغْفِرُ الله", count: 3 },
    { text: "اللّهُـمَّ أَنْـتَ السَّلامُ ، وَمِـنْكَ السَّلام ، تَبارَكْتَ يا ذا الجَـلالِ وَالإِكْـرام", count: 1 },
    { text: "سُبْـحانَ الله", count: 33 },
    { text: "الحَمْـدُ لله", count: 33 },
    { text: "اللهُ أكْـبَر", count: 33 },
  ]
};

export default function AthkarPage() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof athkarData | null>(null);

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
            
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedCategory('morning')}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">أذكار الصباح</h3>
                  <p className="text-sm text-muted-foreground">بداية يومك بذكر الله</p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full text-primary">🌅</div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedCategory('evening')}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">أذكار المساء</h3>
                  <p className="text-sm text-muted-foreground">حصن نفسك في المساء</p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full text-primary">🌃</div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedCategory('prayer')}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">أذكار بعد الصلاة</h3>
                  <p className="text-sm text-muted-foreground">التسبيح والتهليل</p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full text-primary">🤲</div>
              </CardContent>
            </Card>
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

function AthkarDetail({ category, data, onBack }: { category: string, data: { text: string, count: number }[], onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [counter, setCounter] = useState(data[0].count);
  const [progress, setProgress] = useState(0);

  const currentThikr = data[currentIndex];
  
  const handleTap = () => {
    if (counter > 1) {
      setCounter(c => c - 1);
    } else {
      if (currentIndex < data.length - 1) {
        setCurrentIndex(c => c + 1);
        setCounter(data[currentIndex + 1].count);
        setProgress(((currentIndex + 1) / data.length) * 100);
      } else {
        // Finished
        onBack();
      }
    }
  };

  return (
    <motion.div 
      key="detail"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-[80vh]"
    >
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold mr-2">
          {category === 'morning' ? 'أذكار الصباح' : category === 'evening' ? 'أذكار المساء' : 'أذكار الصلاة'}
        </h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <Card className="w-full bg-card/50 backdrop-blur-sm border-primary/20">
          <CardContent className="p-8 text-center">
            <p className="text-2xl leading-loose font-serif text-foreground/90">
              {currentThikr.text}
            </p>
          </CardContent>
        </Card>

        <div 
          onClick={handleTap}
          className="w-40 h-40 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-transform select-none"
        >
          <span className="text-5xl font-bold font-mono">{counter}</span>
          <span className="text-xs opacity-80 mt-1">اضغط للتسبيح</span>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>{currentIndex + 1} / {data.length}</span>
          <span>التقدم</span>
        </div>
        <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex) / data.length) * 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
