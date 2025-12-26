export interface AdhanSound {
  id: string;
  name: string;
  reciter: string;
  location: string;
  url: string;
}

export const adhanSounds: AdhanSound[] = [
  { 
    id: 'makkah', 
    name: 'أذان الحرم المكي', 
    reciter: 'علي ملا', 
    location: 'مكة المكرمة',
    url: 'https://www.islamcan.com/audio/adhan/azan1.mp3'
  },
  { 
    id: 'madinah', 
    name: 'أذان المسجد النبوي', 
    reciter: 'عبدالمجيد السريحي', 
    location: 'المدينة المنورة',
    url: 'https://www.islamcan.com/audio/adhan/azan2.mp3'
  },
  { 
    id: 'alaqsa', 
    name: 'أذان المسجد الأقصى', 
    reciter: 'محمد رشاد الشريف', 
    location: 'القدس',
    url: 'https://www.islamcan.com/audio/adhan/azan3.mp3'
  },
  { 
    id: 'egypt', 
    name: 'أذان مصر', 
    reciter: 'محمد رفعت', 
    location: 'مصر',
    url: 'https://www.islamcan.com/audio/adhan/azan4.mp3'
  },
  { 
    id: 'mishary', 
    name: 'أذان مشاري العفاسي', 
    reciter: 'مشاري راشد العفاسي', 
    location: 'الكويت',
    url: 'https://www.islamcan.com/audio/adhan/azan5.mp3'
  },
  { 
    id: 'sudais', 
    name: 'أذان السديس', 
    reciter: 'عبدالرحمن السديس', 
    location: 'مكة المكرمة',
    url: 'https://www.islamcan.com/audio/adhan/azan6.mp3'
  },
  { 
    id: 'dubai', 
    name: 'أذان دبي', 
    reciter: 'أحمد النعينعي', 
    location: 'الإمارات',
    url: 'https://www.islamcan.com/audio/adhan/azan7.mp3'
  },
  { 
    id: 'turkey', 
    name: 'أذان تركيا', 
    reciter: 'الأذان التركي', 
    location: 'تركيا',
    url: 'https://www.islamcan.com/audio/adhan/azan8.mp3'
  },
];

let currentAudio: HTMLAudioElement | null = null;

export function playAdhanPreview(soundId: string): void {
  stopAdhanPreview();
  
  const sound = adhanSounds.find(s => s.id === soundId);
  if (!sound) return;
  
  currentAudio = new Audio(sound.url);
  currentAudio.volume = 0.7;
  currentAudio.play().catch(err => {
    console.error('Error playing audio:', err);
  });
  
  setTimeout(() => {
    stopAdhanPreview();
  }, 15000);
}

export function stopAdhanPreview(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export function isPlaying(): boolean {
  return currentAudio !== null && !currentAudio.paused;
}
