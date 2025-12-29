export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

const hijriMonthNames = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة'
];

export function getHijriDate(date: Date = new Date(), adjustment: number = 0): HijriDate {
  const adjustedDate = new Date(date);
  adjustedDate.setDate(adjustedDate.getDate() + adjustment);
  
  const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });
  
  const parts = formatter.formatToParts(adjustedDate);
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '1');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '1');
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '1446');
  
  return {
    day,
    month,
    year,
    monthName: hijriMonthNames[month - 1] || ''
  };
}

export function isWhiteDay(date: Date = new Date(), adjustment: number = 0): boolean {
  const hijri = getHijriDate(date, adjustment);
  return [13, 14, 15].includes(hijri.day);
}

export function isFirstOfMonth(date: Date = new Date(), adjustment: number = 0): boolean {
  const hijri = getHijriDate(date, adjustment);
  return hijri.day === 1;
}

export function isFriday(date: Date = new Date()): boolean {
  return date.getDay() === 5;
}

export function isThursday(date: Date = new Date()): boolean {
  return date.getDay() === 4;
}

export function isMonday(date: Date = new Date()): boolean {
  return date.getDay() === 1;
}

export function checkIslamicOccasion(
  targetMonth: number,
  targetDay: number,
  date: Date = new Date(),
  adjustment: number = 0
): boolean {
  const hijri = getHijriDate(date, adjustment);
  return hijri.month === targetMonth && hijri.day === targetDay;
}

export function isRamadan(date: Date = new Date(), adjustment: number = 0): boolean {
  const hijri = getHijriDate(date, adjustment);
  return hijri.month === 9;
}

export function isLastTenOfRamadan(date: Date = new Date(), adjustment: number = 0): boolean {
  const hijri = getHijriDate(date, adjustment);
  return hijri.month === 9 && hijri.day >= 21;
}

export function isDhulHijjah(date: Date = new Date(), adjustment: number = 0): boolean {
  const hijri = getHijriDate(date, adjustment);
  return hijri.month === 12;
}

export function isFirstTenOfDhulHijjah(date: Date = new Date(), adjustment: number = 0): boolean {
  const hijri = getHijriDate(date, adjustment);
  return hijri.month === 12 && hijri.day <= 10;
}

export function getHijriMonthName(month: number): string {
  return hijriMonthNames[month - 1] || '';
}

export function formatHijriDate(hijri: HijriDate): string {
  return `${hijri.day} ${hijri.monthName} ${hijri.year}`;
}
