export const prayerNames: Record<string, string> = {
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء'
};

export const beforePrayerMessages = [
  (prayer: string, minutes: number) => `بقي ${minutes} دقيقة على صلاة ${prayer} 🌿`,
  (prayer: string) => `استعد لـ ${prayer}… طمأنينة تسبق الأذان`,
];

export const atPrayerMessages = [
  (prayer: string) => `حان وقت صلاة ${prayer}`,
  (prayer: string) => `الله أكبر… وقت صلاة ${prayer}`,
];

export const afterPrayerMessages = [
  (prayer: string) => `تقبّل الله… لا تنس أذكار ما بعد الصلاة 🤍`,
  (prayer: string) => `دقيقتان للذكر بعد ${prayer}`,
];

export const morningAthkarMessages = [
  'أذكار الصباح… حصنك ليومك 🌅',
  'صباح الخير… ابدأ يومك بالذكر',
  'حصّن نفسك بأذكار الصباح',
];

export const eveningAthkarMessages = [
  'أذكار المساء… طمأنينة قبل النوم 🌙',
  'لا تنس أذكار المساء',
  'مساء الخير… وقت أذكار المساء',
];

export const endOfDayMessages = [
  'هل تحب تختم يومك بدعاء؟ 🤲',
  'استغفر الله قبل النوم',
  'لا تنم إلا على ذكر الله',
];

export const weeklyReviewMessages = [
  'مرّ أسبوعك… كيف كانت صلاتك؟ 🌱',
  'ثباتك في الصلاة نعمة… حافظ عليها',
  'راجع أسبوعك… واستغفر لتقصيرك',
];

export const fridayMessages = [
  'الجمعة… لا تنس سورة الكهف 📖',
  'ليلة الجمعة… أكثروا من الصلاة على النبي ﷺ',
  'ساعة استجابة اليوم… أكثر من الدعاء 🤲',
  'جمعة مباركة 🤍',
];

export const newHijriMonthMessages = [
  'دخل شهر هجري جديد… نية جديدة وبداية مباركة 🌙',
  'شهر جديد… فرصة جديدة للطاعة',
];

export const whiteDaysMessages = [
  'غدًا من الأيام البيض 🌕 فرصة صيام',
  'الأيام البيض… صيام يعدل صيام الدهر',
];

export const monthlyReminderMessages = [
  'قليل ثابت خير من كثير منقطع… وردك اليومي 📿',
  'حافظ على وردك الشهري من القرآن',
];

export const seasonalMessages = [
  'موسم خير جديد… قرّب خطوة لله 🤍',
  'اجعل لك وردًا ثابتًا من القرآن',
];

export const ramadanStartMessages = [
  'رمضان كريم 🌙 تقبّل الله طاعاتكم',
  'دخل شهر الرحمة… نية جديدة وبداية مباركة',
];

export const ramadanNightMessages = [
  'قيام الليل… ولو بركعتين 🌙',
  'ساعة استجابة قبل الفجر 🤲',
];

export const lastTenNightsMessages = [
  'دخلت العشر الأواخر… شدّ المئزر',
  'أكثروا من الدعاء والقيام',
];

export const lailatulQadrMessages = [
  'ليلة القدر… خيرٌ من ألف شهر 🌌',
  'اللهم إنك عفو تحب العفو فاعفُ عنا',
];

export const eidFitrMessages = [
  'عيدكم مبارك 🤍 تقبّل الله صيامكم',
  'لا تنس زكاة الفطر قبل الصلاة',
];

export const eidAdhaMessages = [
  'عيدكم مبارك 🤍 تقبّل الله طاعاتكم',
  'سنّة الأضحية… تقبّل الله منكم',
];

export const dhulHijjahMessages = [
  'دخلت عشر ذي الحجة… أيام عظيمة 🕋',
  'أكثروا من الذكر في هذه الأيام المباركة',
];

export const arafaDayMessages = [
  'يوم عرفة… دعاء لا يُرد 🤲',
  'صيام يوم عرفة يكفّر سنتين',
];

export const nahrDayMessages = [
  'يوم النحر… أعظم الأيام عند الله',
];

export const ashuraMessages = [
  'غدًا عاشوراء… صيام يكفّر سنة',
  'لا تنس صيام تاسوعاء مع عاشوراء',
];

export const mondayThursdayMessages = [
  'غدًا الاثنين… تُرفع الأعمال',
  'الخميس… صيام وذكر',
];

export const newHijriYearMessages = [
  'عام هجري جديد… نية جديدة 🌙',
  'كل عام وأنتم بخير',
];

export const quranReminderMessages = [
  'هل قرأت وردك اليوم؟ 📖',
  'القرآن… نور القلوب',
  'لا تهجر القرآن… اقرأ ولو آية',
];

export function getRandomMessage<T>(messages: T[]): T {
  return messages[Math.floor(Math.random() * messages.length)];
}

export interface IslamicOccasion {
  id: string;
  name: string;
  hijriMonth: number;
  hijriDay: number;
  duration?: number;
  messages: string[];
  reminderBefore?: boolean;
}

export const islamicOccasions: IslamicOccasion[] = [
  { id: 'ramadan_start', name: 'بداية رمضان', hijriMonth: 9, hijriDay: 1, messages: ramadanStartMessages, reminderBefore: true },
  { id: 'laylatul_qadr_21', name: 'ليلة 21 رمضان', hijriMonth: 9, hijriDay: 21, messages: lailatulQadrMessages },
  { id: 'laylatul_qadr_23', name: 'ليلة 23 رمضان', hijriMonth: 9, hijriDay: 23, messages: lailatulQadrMessages },
  { id: 'laylatul_qadr_25', name: 'ليلة 25 رمضان', hijriMonth: 9, hijriDay: 25, messages: lailatulQadrMessages },
  { id: 'laylatul_qadr_27', name: 'ليلة 27 رمضان', hijriMonth: 9, hijriDay: 27, messages: lailatulQadrMessages },
  { id: 'laylatul_qadr_29', name: 'ليلة 29 رمضان', hijriMonth: 9, hijriDay: 29, messages: lailatulQadrMessages },
  { id: 'eid_fitr', name: 'عيد الفطر', hijriMonth: 10, hijriDay: 1, messages: eidFitrMessages, reminderBefore: true },
  { id: 'dhul_hijjah_start', name: 'بداية عشر ذي الحجة', hijriMonth: 12, hijriDay: 1, messages: dhulHijjahMessages },
  { id: 'arafa', name: 'يوم عرفة', hijriMonth: 12, hijriDay: 9, messages: arafaDayMessages, reminderBefore: true },
  { id: 'eid_adha', name: 'عيد الأضحى', hijriMonth: 12, hijriDay: 10, messages: eidAdhaMessages, reminderBefore: true },
  { id: 'ashura', name: 'عاشوراء', hijriMonth: 1, hijriDay: 10, messages: ashuraMessages, reminderBefore: true },
  { id: 'new_hijri_year', name: 'رأس السنة الهجرية', hijriMonth: 1, hijriDay: 1, messages: newHijriYearMessages },
];
