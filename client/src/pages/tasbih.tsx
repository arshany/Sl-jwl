import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, Volume2, VolumeX, Vibrate } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Link } from "wouter";

const tasbihat = [
  { text: "سُبْحَانَ اللَّهِ", target: 33, color: "from-emerald-500 to-emerald-600" },
  { text: "الْحَمْدُ لِلَّهِ", target: 33, color: "from-amber-500 to-amber-600" },
  { text: "اللَّهُ أَكْبَرُ", target: 34, color: "from-blue-500 to-blue-600" },
  { text: "لَا إِلَٰهَ إِلَّا اللَّهُ", target: 100, color: "from-purple-500 to-purple-600" },
  { text: "أَسْتَغْفِرُ اللَّهَ", target: 100, color: "from-teal-500 to-teal-600" },
  { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", target: 100, color: "from-rose-500 to-rose-600" },
];

export default function TasbihPage() {
  const [selectedTasbih, setSelectedTasbih] = useState(0);
  const [count, setCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useLocalStorage('tasbih-sound', false);
  const [vibrateEnabled, setVibrateEnabled] = useLocalStorage('tasbih-vibrate', true);
  const [lastCount, setLastCount] = useLocalStorage<{tasbih: number, count: number}>('tasbih-last-count', {tasbih: 0, count: 0});
  const [showComplete, setShowComplete] = useState(false);

  const currentTasbih = tasbihat[selectedTasbih];

  useEffect(() => {
    if (lastCount.tasbih === selectedTasbih && lastCount.count > 0) {
      setCount(lastCount.count);
    } else {
      setCount(0);
    }
  }, [selectedTasbih]);

  const playClickSound = useCallback(() => {
    if (soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQwALq3j5pVtHQBGrN3djWYZAD2kyNZ/XxQANZy+x3RYEAA=');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  }, [soundEnabled]);

  const handleCount = useCallback(() => {
    const newCount = count + 1;
    setCount(newCount);
    setLastCount({ tasbih: selectedTasbih, count: newCount });
    
    if (vibrateEnabled && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    playClickSound();
    
    if (newCount >= currentTasbih.target) {
      setShowComplete(true);
      if (vibrateEnabled && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      setTimeout(() => setShowComplete(false), 2000);
    }
  }, [count, currentTasbih.target, vibrateEnabled, playClickSound, selectedTasbih, setLastCount]);

  useEffect(() => {
    const handleShake = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (acc && (Math.abs(acc.x || 0) > 15 || Math.abs(acc.y || 0) > 15 || Math.abs(acc.z || 0) > 15)) {
        handleCount();
      }
    };

    if (typeof DeviceMotionEvent !== 'undefined') {
      window.addEventListener('devicemotion', handleShake);
      return () => window.removeEventListener('devicemotion', handleShake);
    }
  }, [handleCount]);

  const resetCount = () => {
    setCount(0);
    setLastCount({ tasbih: selectedTasbih, count: 0 });
  };

  const progress = Math.min((count / currentTasbih.target) * 100, 100);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="flex items-center p-4 pt-6 gap-2">
        <Link href="/athkar">
          <Button variant="ghost" size="icon" className="rounded-full" data-testid="btn-tasbih-back">
            <ArrowRight className="h-6 w-6" />
          </Button>
        </Link>
        <h2 className="text-lg font-bold text-foreground flex-1">عداد التسبيح</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setVibrateEnabled(!vibrateEnabled)}
          className={vibrateEnabled ? 'text-primary' : 'text-muted-foreground'}
          data-testid="btn-toggle-vibrate"
        >
          <Vibrate className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={soundEnabled ? 'text-primary' : 'text-muted-foreground'}
          data-testid="btn-toggle-sound"
        >
          {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </header>

      <div className="px-4 mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tasbihat.map((t, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedTasbih(idx)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTasbih === idx 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
            data-testid={`btn-tasbih-${idx}`}
          >
            {t.text.split(' ')[0]}...
          </button>
        ))}
      </div>

      <div className="px-4 flex flex-col items-center">
        <motion.div
          className={`w-64 h-64 rounded-full bg-gradient-to-br ${currentTasbih.color} shadow-2xl flex items-center justify-center cursor-pointer active:scale-95 transition-transform relative overflow-hidden`}
          onClick={handleCount}
          whileTap={{ scale: 0.95 }}
          data-testid="btn-tasbih-counter"
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white/20 transition-all duration-300"
            style={{ height: `${progress}%` }}
          />
          <div className="relative z-10 text-center text-white">
            <motion.span 
              key={count}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-bold block"
            >
              {count}
            </motion.span>
            <span className="text-sm opacity-80">/ {currentTasbih.target}</span>
          </div>
          
          <AnimatePresence>
            {showComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 bg-white/30 flex items-center justify-center"
              >
                <span className="text-4xl">✨</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-2xl font-serif mt-8 text-foreground arabic-text text-center" data-testid="text-current-tasbih">
          {currentTasbih.text}
        </p>

        <p className="text-sm text-muted-foreground mt-2">
          اضغط أو هز الجوال للتسبيح
        </p>

        <Button 
          variant="outline" 
          className="mt-6 gap-2"
          onClick={resetCount}
          data-testid="btn-reset-count"
        >
          <RotateCcw className="h-4 w-4" />
          إعادة العد
        </Button>

        {lastCount.count > 0 && lastCount.tasbih === selectedTasbih && (
          <p className="text-xs text-muted-foreground mt-4">
            آخر عدّ محفوظ: {lastCount.count}
          </p>
        )}
      </div>
    </div>
  );
}
