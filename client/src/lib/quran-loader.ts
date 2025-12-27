import quranData from '@/data/quran/full-quran.json';

interface Verse {
  id: number;
  text: string;
}

interface Surah {
  id: number;
  name: string;
  transliteration: string;
  type: string;
  total_verses: number;
  verses: Verse[];
}

const quran = quranData as Surah[];

export function getSurahText(surahNumber: number): string | null {
  const surah = quran.find(s => s.id === surahNumber);
  if (!surah) return null;
  
  return surah.verses.map((v, i) => `${v.text} ۝${toArabicNumber(v.id)}`).join(' ');
}

export function getSurahVerses(surahNumber: number): Verse[] | null {
  const surah = quran.find(s => s.id === surahNumber);
  if (!surah) return null;
  return surah.verses;
}

export function getSurah(surahNumber: number): Surah | null {
  return quran.find(s => s.id === surahNumber) || null;
}

export function getAllSurahs(): Surah[] {
  return quran;
}

function toArabicNumber(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => arabicDigits[parseInt(d)]).join('');
}

export { quran, type Surah, type Verse };
