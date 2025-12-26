import React, { createContext, useContext, useEffect, useState } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes, Prayer, Madhab } from 'adhan';
import { useLocalStorage } from './use-local-storage';

type CalculationMethodName = 'MuslimWorldLeague' | 'Egyptian' | 'Karachi' | 'UmmAlQura' | 'Dubai' | 'MoonsightingCommittee' | 'NorthAmerica' | 'Kuwait' | 'Qatar' | 'Singapore' | 'Tehran' | 'Turkey';

interface AppSettings {
  latitude: number;
  longitude: number;
  city: string; 
  method: CalculationMethodName;
  asrMadhab: 'Shafi' | 'Hanafi';
  notifications: Record<string, 'sound' | 'vibrate' | 'silent'>;
  theme: 'light' | 'dark';
  defaultAdhan: string;
  adjustments: { fajr: number; isha: number }; // In minutes
}

interface PrayerContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  prayerTimes: PrayerTimes | null;
  nextPrayer: string;
  timeToNextPrayer: string;
  locationError: string | null;
  loading: boolean;
  refreshLocation: () => void;
}

const defaultSettings: AppSettings = {
  latitude: 21.4225, // Mecca
  longitude: 39.8262,
  city: 'Makkah',
  method: 'UmmAlQura',
  asrMadhab: 'Shafi',
  notifications: {
    fajr: 'sound',
    dhuhr: 'sound',
    asr: 'sound',
    maghrib: 'sound',
    isha: 'sound',
  },
  theme: 'light',
  defaultAdhan: 'makkah',
  adjustments: { fajr: 0, isha: 0 },
};

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

export function PrayerProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useLocalStorage<AppSettings>('prayer-app-settings', defaultSettings);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string>('none');
  const [timeToNextPrayer, setTimeToNextPrayer] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (settings.city === 'Makkah' && settings.latitude === 21.4225) {
      refreshLocation();
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    if (!settings.latitude || !settings.longitude) return;

    const coordinates = new Coordinates(settings.latitude, settings.longitude);
    const date = new Date();
    
    let params;
    // Map string to CalculationMethod function
    const methodMap: Record<string, () => any> = {
      'MuslimWorldLeague': CalculationMethod.MuslimWorldLeague,
      'Egyptian': CalculationMethod.Egyptian,
      'Karachi': CalculationMethod.Karachi,
      'UmmAlQura': CalculationMethod.UmmAlQura,
      'Dubai': CalculationMethod.Dubai,
      'MoonsightingCommittee': CalculationMethod.MoonsightingCommittee,
      'NorthAmerica': CalculationMethod.NorthAmerica,
      'Kuwait': CalculationMethod.Kuwait,
      'Qatar': CalculationMethod.Qatar,
      'Singapore': CalculationMethod.Singapore,
      'Tehran': CalculationMethod.Tehran,
      'Turkey': CalculationMethod.Turkey,
    };

    params = (methodMap[settings.method] || CalculationMethod.UmmAlQura)();

    if (settings.asrMadhab === 'Hanafi') {
      params.madhab = Madhab.Hanafi;
    } else {
      params.madhab = Madhab.Shafi;
    }
    
    if (settings.adjustments) {
        params.adjustments.fajr = settings.adjustments.fajr || 0;
        params.adjustments.isha = settings.adjustments.isha || 0;
    }

    try {
      const times = new PrayerTimes(coordinates, date, params);
      setPrayerTimes(times);
      
      const next = times.nextPrayer();
      setNextPrayer(next);
      
    } catch (e) {
      console.error("Error calculating times", e);
    }
  }, [settings.latitude, settings.longitude, settings.method, settings.asrMadhab, settings.adjustments]);

  useEffect(() => {
    if (!prayerTimes) return;

    const interval = setInterval(() => {
      const now = new Date();
      let targetDate: Date | null = null;
      let next = prayerTimes.nextPrayer();

      if (next === Prayer.None) {
         setNextPrayer('none');
         setTimeToNextPrayer('--:--:--');
         return;
      }
      
      setNextPrayer(next);
      
      switch(next) {
        case Prayer.Fajr: targetDate = prayerTimes.fajr; break;
        case Prayer.Sunrise: targetDate = prayerTimes.sunrise; break;
        case Prayer.Dhuhr: targetDate = prayerTimes.dhuhr; break;
        case Prayer.Asr: targetDate = prayerTimes.asr; break;
        case Prayer.Maghrib: targetDate = prayerTimes.maghrib; break;
        case Prayer.Isha: targetDate = prayerTimes.isha; break;
      }

      if (targetDate) {
        const diff = targetDate.getTime() - now.getTime();
        if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeToNextPrayer(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
             setTimeToNextPrayer('00:00:00');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes]);


  const refreshLocation = () => {
    setLoading(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('المتصفح لا يدعم تحديد الموقع');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSettings(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: 'موقعي الحالي' 
        }));
        setLoading(false);
      },
      (error) => {
        setLocationError('فشل تحديد الموقع. يرجى إدخال المدينة يدوياً.');
        setLoading(false);
      }
    );
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <PrayerContext.Provider value={{
      settings,
      updateSettings,
      prayerTimes,
      nextPrayer,
      timeToNextPrayer,
      locationError,
      loading,
      refreshLocation
    }}>
      {children}
    </PrayerContext.Provider>
  );
}

export function usePrayer() {
  const context = useContext(PrayerContext);
  if (context === undefined) {
    throw new Error('usePrayer must be used within a PrayerProvider');
  }
  return context;
}
