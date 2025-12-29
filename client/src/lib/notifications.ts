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
    const prayerNames: Record<string, string> = {
      fajr: 'الفجر',
      sunrise: 'الشروق',
      dhuhr: 'الظهر',
      asr: 'العصر',
      maghrib: 'المغرب',
      isha: 'العشاء'
    };
    
    const arabicName = prayerNames[prayerName] || prayerName;
    const tag = `prayer-${prayerName}`;
    
    if (scheduledTimers.has(tag)) {
      clearTimeout(scheduledTimers.get(tag)!);
    }
    
    const timerId = setTimeout(() => {
      showNotification(
        `حان وقت صلاة ${arabicName}`,
        'حي على الصلاة، حي على الفلاح',
        tag
      );
      scheduledTimers.delete(tag);
    }, delay);
    
    scheduledTimers.set(tag, timerId);
  }
}

export function cancelScheduledNotifications(): void {
  scheduledTimers.forEach((timerId) => {
    clearTimeout(timerId);
  });
  scheduledTimers.clear();
}

export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

export function canInstallPWA(): boolean {
  return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
}
