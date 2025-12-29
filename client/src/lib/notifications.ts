import { getRandomMessage, prayerNames, beforePrayerMessages, atPrayerMessages, afterPrayerMessages, morningAthkarMessages, eveningAthkarMessages, fridayMessages, whiteDaysMessages, newHijriMonthMessages } from './notification-messages';
import { isWhiteDay, isFirstOfMonth, isFriday, getHijriDate, checkIslamicOccasion, isRamadan, isLastTenOfRamadan } from './hijri-calendar';
import { islamicOccasions } from './notification-messages';

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function showNotification(title: string, body: string, tag?: string): Promise<void> {
  const permission = await requestNotificationPermission();
  
  if (permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, {
      body,
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: tag || 'aqim-notification',
      requireInteraction: true,
      dir: 'rtl',
      lang: 'ar'
    } as NotificationOptions);
  }
}

const scheduledTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

export function schedulePrayerNotification(
  prayerName: string,
  prayerTime: Date,
  currentTime: Date = new Date()
): void {
  const delay = prayerTime.getTime() - currentTime.getTime();
  
  if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
    const arabicName = prayerNames[prayerName] || prayerName;
    const tag = `prayer-${prayerName}`;
    
    if (scheduledTimers.has(tag)) {
      clearTimeout(scheduledTimers.get(tag)!);
    }
    
    const messageFunc = getRandomMessage(atPrayerMessages);
    const message = messageFunc(arabicName);
    
    const timerId = setTimeout(() => {
      showNotification(message, 'حي على الصلاة، حي على الفلاح', tag);
      scheduledTimers.delete(tag);
    }, delay);
    
    scheduledTimers.set(tag, timerId);
  }
}

export function scheduleBeforePrayerNotification(
  prayerName: string,
  prayerTime: Date,
  minutesBefore: number,
  currentTime: Date = new Date()
): void {
  const notificationTime = new Date(prayerTime.getTime() - minutesBefore * 60 * 1000);
  const delay = notificationTime.getTime() - currentTime.getTime();
  
  if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
    const arabicName = prayerNames[prayerName] || prayerName;
    const tag = `prayer-before-${prayerName}`;
    
    if (scheduledTimers.has(tag)) {
      clearTimeout(scheduledTimers.get(tag)!);
    }
    
    const messageFunc = beforePrayerMessages[0];
    const message = messageFunc(arabicName, minutesBefore);
    
    const timerId = setTimeout(() => {
      showNotification(message, 'استعد للصلاة', tag);
      scheduledTimers.delete(tag);
    }, delay);
    
    scheduledTimers.set(tag, timerId);
  }
}

export function scheduleAfterPrayerNotification(
  prayerName: string,
  prayerTime: Date,
  currentTime: Date = new Date()
): void {
  const notificationTime = new Date(prayerTime.getTime() + 5 * 60 * 1000);
  const delay = notificationTime.getTime() - currentTime.getTime();
  
  if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
    const tag = `prayer-after-${prayerName}`;
    
    if (scheduledTimers.has(tag)) {
      clearTimeout(scheduledTimers.get(tag)!);
    }
    
    const messageFunc = getRandomMessage(afterPrayerMessages);
    const arabicName = prayerNames[prayerName] || prayerName;
    const message = messageFunc(arabicName);
    
    const timerId = setTimeout(() => {
      showNotification(message, 'أذكار ما بعد الصلاة', tag);
      scheduledTimers.delete(tag);
    }, delay);
    
    scheduledTimers.set(tag, timerId);
  }
}

export function scheduleDailyNotification(
  type: 'morning' | 'evening' | 'quran',
  hour: number,
  minute: number = 0,
  reschedule: boolean = true
): void {
  const now = new Date();
  const notificationTime = new Date();
  notificationTime.setHours(hour, minute, 0, 0);
  
  if (notificationTime <= now) {
    notificationTime.setDate(notificationTime.getDate() + 1);
  }
  
  const delay = notificationTime.getTime() - now.getTime();
  const tag = `daily-${type}`;
  
  if (scheduledTimers.has(tag)) {
    clearTimeout(scheduledTimers.get(tag)!);
  }
  
  let message: string;
  let subtitle: string;
  
  if (type === 'morning') {
    message = getRandomMessage(morningAthkarMessages);
    subtitle = 'أذكار الصباح';
  } else if (type === 'evening') {
    message = getRandomMessage(eveningAthkarMessages);
    subtitle = 'أذكار المساء';
  } else {
    message = 'حان وقت وردك القرآني اليومي';
    subtitle = 'القرآن الكريم';
  }
  
  const timerId = setTimeout(() => {
    showNotification(message, subtitle, tag);
    scheduledTimers.delete(tag);
    if (reschedule) {
      scheduleDailyNotification(type, hour, minute, true);
    }
  }, delay);
  
  scheduledTimers.set(tag, timerId);
}

export function scheduleWeeklyNotification(
  type: 'friday' | 'mondayThursday' | 'weeklyReview',
  hour: number = 12,
  reschedule: boolean = true
): void {
  const now = new Date();
  const notificationTime = new Date();
  notificationTime.setHours(hour, 0, 0, 0);
  
  const targetDays: number[] = type === 'friday' ? [5] : 
                                type === 'mondayThursday' ? [1, 4] : [0];
  
  let daysUntil = 0;
  for (let i = 0; i <= 7; i++) {
    const checkDay = (now.getDay() + i) % 7;
    if (targetDays.includes(checkDay)) {
      if (i === 0 && notificationTime <= now) continue;
      daysUntil = i;
      break;
    }
  }
  
  notificationTime.setDate(now.getDate() + daysUntil);
  const delay = notificationTime.getTime() - now.getTime();
  const tag = `weekly-${type}`;
  
  if (delay <= 0) return;
  
  if (scheduledTimers.has(tag)) {
    clearTimeout(scheduledTimers.get(tag)!);
  }
  
  let message: string;
  let subtitle: string;
  
  if (type === 'friday') {
    message = getRandomMessage(fridayMessages);
    subtitle = 'جمعة مباركة';
  } else if (type === 'mondayThursday') {
    message = 'يوم الاثنين والخميس أيام صيام مستحبة';
    subtitle = 'صيام التطوع';
  } else {
    message = 'راجع أعمالك الأسبوعية واستعد للأسبوع القادم';
    subtitle = 'المراجعة الأسبوعية';
  }
  
  const timerId = setTimeout(() => {
    showNotification(message, subtitle, tag);
    scheduledTimers.delete(tag);
    if (reschedule) {
      scheduleWeeklyNotification(type, hour, true);
    }
  }, delay);
  
  scheduledTimers.set(tag, timerId);
}

export function cancelScheduledNotifications(): void {
  scheduledTimers.forEach((timerId) => {
    clearTimeout(timerId);
  });
  scheduledTimers.clear();
}

export function checkAndShowDailyNotifications(hijriAdjustment: number = 0): void {
  const today = new Date();
  
  if (isFriday(today)) {
    const message = getRandomMessage(fridayMessages);
    showNotification(message, 'جمعة مباركة', 'friday');
  }
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (isWhiteDay(tomorrow, hijriAdjustment)) {
    const message = getRandomMessage(whiteDaysMessages);
    showNotification(message, 'الأيام البيض', 'white-days');
  }
  
  if (isFirstOfMonth(today, hijriAdjustment)) {
    const hijri = getHijriDate(today, hijriAdjustment);
    const message = getRandomMessage(newHijriMonthMessages);
    showNotification(message, `شهر ${hijri.monthName}`, 'new-month');
  }
  
  islamicOccasions.forEach(occasion => {
    if (checkIslamicOccasion(occasion.hijriMonth, occasion.hijriDay, today, hijriAdjustment)) {
      const message = getRandomMessage(occasion.messages);
      showNotification(message, occasion.name, occasion.id);
    }
    
    if (occasion.reminderBefore && checkIslamicOccasion(occasion.hijriMonth, occasion.hijriDay, tomorrow, hijriAdjustment)) {
      const message = `غداً ${occasion.name}`;
      showNotification(message, 'تذكير', `${occasion.id}-reminder`);
    }
  });
}

export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

export function canInstallPWA(): boolean {
  return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
}
