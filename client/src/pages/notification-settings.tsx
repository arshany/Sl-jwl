import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Bell, BellOff, Moon, Sun, BookOpen, Calendar, Star, Vibrate, Volume2, VolumeX, Music, TestTube, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import { useLocalStorage } from "@/lib/use-local-storage";
import { showNotification, requestNotificationPermission, getNotificationPermission } from "@/lib/notifications";
import { useToast } from "@/hooks/use-toast";

type NotificationMode = 'sound' | 'vibrate' | 'silent' | 'adhan';

export interface NotificationSettings {
  enabled: boolean;
  prayer: {
    enabled: boolean;
    beforeMinutes: number;
    atTime: boolean;
    afterPrayer: boolean;
    mode: NotificationMode;
    perPrayer: Record<string, NotificationMode>;
  };
  athkar: {
    enabled: boolean;
    morning: boolean;
    evening: boolean;
    endOfDay: boolean;
    mode: NotificationMode;
  };
  quran: {
    enabled: boolean;
    dailyReminder: boolean;
    mode: NotificationMode;
  };
  weekly: {
    enabled: boolean;
    friday: boolean;
    weeklyReview: boolean;
    mondayThursday: boolean;
    mode: NotificationMode;
  };
  monthly: {
    enabled: boolean;
    newHijriMonth: boolean;
    whiteDays: boolean;
    mode: NotificationMode;
  };
  yearly: {
    enabled: boolean;
    mode: NotificationMode;
  };
  occasions: {
    enabled: boolean;
    ramadan: boolean;
    eid: boolean;
    dhulHijjah: boolean;
    ashura: boolean;
    newYear: boolean;
    reminderBefore: boolean;
    mode: NotificationMode;
  };
  hijriAdjustment: number;
  defaultTime: string;
}

const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  prayer: {
    enabled: true,
    beforeMinutes: 10,
    atTime: true,
    afterPrayer: false,
    mode: 'sound',
    perPrayer: {
      fajr: 'sound',
      dhuhr: 'sound',
      asr: 'sound',
      maghrib: 'sound',
      isha: 'sound'
    }
  },
  athkar: {
    enabled: true,
    morning: true,
    evening: true,
    endOfDay: false,
    mode: 'sound'
  },
  quran: {
    enabled: false,
    dailyReminder: false,
    mode: 'sound'
  },
  weekly: {
    enabled: true,
    friday: true,
    weeklyReview: false,
    mondayThursday: false,
    mode: 'sound'
  },
  monthly: {
    enabled: true,
    newHijriMonth: true,
    whiteDays: true,
    mode: 'sound'
  },
  yearly: {
    enabled: true,
    mode: 'sound'
  },
  occasions: {
    enabled: true,
    ramadan: true,
    eid: true,
    dhulHijjah: true,
    ashura: true,
    newYear: true,
    reminderBefore: true,
    mode: 'sound'
  },
  hijriAdjustment: 0,
  defaultTime: '21:00'
};

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useLocalStorage<NotificationSettings>('notification-settings', defaultNotificationSettings);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const updateSettings = (updates: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleTestNotification = async () => {
    const permission = getNotificationPermission();
    if (permission !== 'granted') {
      const newPermission = await requestNotificationPermission();
      if (newPermission !== 'granted') {
        toast({ description: 'يرجى السماح بالإشعارات أولاً', variant: 'destructive' });
        return;
      }
    }
    
    setTimeout(() => {
      showNotification('اختبار التنبيه', 'التنبيهات تعمل بشكل صحيح ✅', 'test');
      toast({ description: 'تم إرسال تنبيه تجريبي' });
    }, 2000);
  };

  const ModeSelector = ({ value, onChange, showAdhan = false }: { value: NotificationMode; onChange: (mode: NotificationMode) => void; showAdhan?: boolean }) => (
    <div className="flex gap-2 flex-wrap">
      <ModeButton active={value === 'sound'} onClick={() => onChange('sound')} icon={<Volume2 className="h-4 w-4" />} label="صوت" />
      <ModeButton active={value === 'vibrate'} onClick={() => onChange('vibrate')} icon={<Vibrate className="h-4 w-4" />} label="اهتزاز" />
      <ModeButton active={value === 'silent'} onClick={() => onChange('silent')} icon={<VolumeX className="h-4 w-4" />} label="صامت" />
      {showAdhan && <ModeButton active={value === 'adhan'} onClick={() => onChange('adhan')} icon={<Music className="h-4 w-4" />} label="أذان" />}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="flex items-center p-4 pt-6 gap-2">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="rounded-full" data-testid="btn-notification-settings-back">
            <ArrowRight className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground flex-1">إعدادات التنبيهات</h1>
        <Bell className="h-6 w-6 text-primary" />
      </header>

      <div className="px-4 space-y-4">
        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.enabled ? <Bell className="h-5 w-5 text-primary" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
                <div>
                  <p className="font-bold text-foreground">تفعيل التنبيهات</p>
                  <p className="text-xs text-muted-foreground">تشغيل/إيقاف جميع التنبيهات</p>
                </div>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(enabled) => updateSettings({ enabled })}
                data-testid="switch-notifications-enabled"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-l from-[#709046] to-[#5a7338] text-white shadow-lg">
          <CardContent className="p-4">
            <button onClick={handleTestNotification} className="w-full flex items-center justify-center gap-3" data-testid="btn-test-notification">
              <TestTube className="h-5 w-5" />
              <span className="font-bold">اختبار التنبيه</span>
            </button>
            <p className="text-xs text-center mt-2 opacity-80">سيظهر تنبيه تجريبي خلال ثانيتين</p>
          </CardContent>
        </Card>

        <NotificationSection
          title="تنبيهات الصلاة"
          icon={<Moon className="h-5 w-5" />}
          enabled={settings.enabled && settings.prayer.enabled}
          onToggle={(enabled) => updateSettings({ prayer: { ...settings.prayer, enabled } })}
          expanded={expandedSections['prayer']}
          onExpand={() => toggleSection('prayer')}
          disabled={!settings.enabled}
        >
          <div className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">تنبيه قبل الصلاة</span>
                <select
                  value={settings.prayer.beforeMinutes}
                  onChange={(e) => updateSettings({ prayer: { ...settings.prayer, beforeMinutes: parseInt(e.target.value) } })}
                  className="bg-muted rounded-lg px-3 py-1 text-sm"
                >
                  <option value={0}>إيقاف</option>
                  <option value={5}>5 دقائق</option>
                  <option value={10}>10 دقائق</option>
                  <option value={15}>15 دقيقة</option>
                  <option value={30}>30 دقيقة</option>
                </select>
              </div>
              <ToggleRow label="تنبيه وقت الأذان" checked={settings.prayer.atTime} onChange={(atTime) => updateSettings({ prayer: { ...settings.prayer, atTime } })} />
              <ToggleRow label="تنبيه بعد الصلاة (للأذكار)" checked={settings.prayer.afterPrayer} onChange={(afterPrayer) => updateSettings({ prayer: { ...settings.prayer, afterPrayer } })} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">نوع التنبيه</p>
              <ModeSelector value={settings.prayer.mode} onChange={(mode) => updateSettings({ prayer: { ...settings.prayer, mode } })} showAdhan />
            </div>
          </div>
        </NotificationSection>

        <NotificationSection
          title="تنبيهات الأذكار"
          icon={<Sun className="h-5 w-5" />}
          enabled={settings.enabled && settings.athkar.enabled}
          onToggle={(enabled) => updateSettings({ athkar: { ...settings.athkar, enabled } })}
          expanded={expandedSections['athkar']}
          onExpand={() => toggleSection('athkar')}
          disabled={!settings.enabled}
        >
          <div className="space-y-3 pt-4">
            <ToggleRow label="أذكار الصباح" checked={settings.athkar.morning} onChange={(morning) => updateSettings({ athkar: { ...settings.athkar, morning } })} />
            <ToggleRow label="أذكار المساء" checked={settings.athkar.evening} onChange={(evening) => updateSettings({ athkar: { ...settings.athkar, evening } })} />
            <ToggleRow label="تذكير آخر اليوم" checked={settings.athkar.endOfDay} onChange={(endOfDay) => updateSettings({ athkar: { ...settings.athkar, endOfDay } })} />
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">نوع التنبيه</p>
              <ModeSelector value={settings.athkar.mode} onChange={(mode) => updateSettings({ athkar: { ...settings.athkar, mode } })} />
            </div>
          </div>
        </NotificationSection>

        <NotificationSection
          title="تنبيهات القرآن"
          icon={<BookOpen className="h-5 w-5" />}
          enabled={settings.enabled && settings.quran.enabled}
          onToggle={(enabled) => updateSettings({ quran: { ...settings.quran, enabled } })}
          expanded={expandedSections['quran']}
          onExpand={() => toggleSection('quran')}
          disabled={!settings.enabled}
        >
          <div className="space-y-3 pt-4">
            <ToggleRow label="تذكير يومي بالقراءة" checked={settings.quran.dailyReminder} onChange={(dailyReminder) => updateSettings({ quran: { ...settings.quran, dailyReminder } })} />
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">نوع التنبيه</p>
              <ModeSelector value={settings.quran.mode} onChange={(mode) => updateSettings({ quran: { ...settings.quran, mode } })} />
            </div>
          </div>
        </NotificationSection>

        <NotificationSection
          title="تنبيهات أسبوعية"
          icon={<Calendar className="h-5 w-5" />}
          enabled={settings.enabled && settings.weekly.enabled}
          onToggle={(enabled) => updateSettings({ weekly: { ...settings.weekly, enabled } })}
          expanded={expandedSections['weekly']}
          onExpand={() => toggleSection('weekly')}
          disabled={!settings.enabled}
        >
          <div className="space-y-3 pt-4">
            <ToggleRow label="تذكير الجمعة (سورة الكهف)" checked={settings.weekly.friday} onChange={(friday) => updateSettings({ weekly: { ...settings.weekly, friday } })} />
            <ToggleRow label="مراجعة أسبوعية" checked={settings.weekly.weeklyReview} onChange={(weeklyReview) => updateSettings({ weekly: { ...settings.weekly, weeklyReview } })} />
            <ToggleRow label="الاثنين والخميس (الصيام)" checked={settings.weekly.mondayThursday} onChange={(mondayThursday) => updateSettings({ weekly: { ...settings.weekly, mondayThursday } })} />
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">نوع التنبيه</p>
              <ModeSelector value={settings.weekly.mode} onChange={(mode) => updateSettings({ weekly: { ...settings.weekly, mode } })} />
            </div>
          </div>
        </NotificationSection>

        <NotificationSection
          title="تنبيهات شهرية"
          icon={<Calendar className="h-5 w-5" />}
          enabled={settings.enabled && settings.monthly.enabled}
          onToggle={(enabled) => updateSettings({ monthly: { ...settings.monthly, enabled } })}
          expanded={expandedSections['monthly']}
          onExpand={() => toggleSection('monthly')}
          disabled={!settings.enabled}
        >
          <div className="space-y-3 pt-4">
            <ToggleRow label="بداية الشهر الهجري" checked={settings.monthly.newHijriMonth} onChange={(newHijriMonth) => updateSettings({ monthly: { ...settings.monthly, newHijriMonth } })} />
            <ToggleRow label="الأيام البيض (13-14-15)" checked={settings.monthly.whiteDays} onChange={(whiteDays) => updateSettings({ monthly: { ...settings.monthly, whiteDays } })} />
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">نوع التنبيه</p>
              <ModeSelector value={settings.monthly.mode} onChange={(mode) => updateSettings({ monthly: { ...settings.monthly, mode } })} />
            </div>
          </div>
        </NotificationSection>

        <NotificationSection
          title="المناسبات الدينية"
          icon={<Star className="h-5 w-5" />}
          enabled={settings.enabled && settings.occasions.enabled}
          onToggle={(enabled) => updateSettings({ occasions: { ...settings.occasions, enabled } })}
          expanded={expandedSections['occasions']}
          onExpand={() => toggleSection('occasions')}
          disabled={!settings.enabled}
        >
          <div className="space-y-3 pt-4">
            <ToggleRow label="رمضان وليلة القدر" checked={settings.occasions.ramadan} onChange={(ramadan) => updateSettings({ occasions: { ...settings.occasions, ramadan } })} />
            <ToggleRow label="عيد الفطر والأضحى" checked={settings.occasions.eid} onChange={(eid) => updateSettings({ occasions: { ...settings.occasions, eid } })} />
            <ToggleRow label="عشر ذي الحجة ويوم عرفة" checked={settings.occasions.dhulHijjah} onChange={(dhulHijjah) => updateSettings({ occasions: { ...settings.occasions, dhulHijjah } })} />
            <ToggleRow label="عاشوراء" checked={settings.occasions.ashura} onChange={(ashura) => updateSettings({ occasions: { ...settings.occasions, ashura } })} />
            <ToggleRow label="رأس السنة الهجرية" checked={settings.occasions.newYear} onChange={(newYear) => updateSettings({ occasions: { ...settings.occasions, newYear } })} />
            <ToggleRow label="تذكير قبل المناسبة بيوم" checked={settings.occasions.reminderBefore} onChange={(reminderBefore) => updateSettings({ occasions: { ...settings.occasions, reminderBefore } })} />
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">نوع التنبيه</p>
              <ModeSelector value={settings.occasions.mode} onChange={(mode) => updateSettings({ occasions: { ...settings.occasions, mode } })} />
            </div>
          </div>
        </NotificationSection>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-bold text-foreground">إعدادات إضافية</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm">تعديل التقويم الهجري</span>
              <select
                value={settings.hijriAdjustment}
                onChange={(e) => updateSettings({ hijriAdjustment: parseInt(e.target.value) })}
                className="bg-muted rounded-lg px-3 py-1 text-sm"
              >
                <option value={-2}>-2 يوم</option>
                <option value={-1}>-1 يوم</option>
                <option value={0}>بدون تعديل</option>
                <option value={1}>+1 يوم</option>
                <option value={2}>+2 يوم</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">وقت التنبيهات الافتراضي</span>
              <input
                type="time"
                value={settings.defaultTime}
                onChange={(e) => updateSettings({ defaultTime: e.target.value })}
                className="bg-muted rounded-lg px-3 py-1 text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NotificationSection({ 
  title, 
  icon, 
  enabled, 
  onToggle, 
  expanded, 
  onExpand, 
  children,
  disabled 
}: { 
  title: string; 
  icon: React.ReactNode; 
  enabled: boolean; 
  onToggle: (enabled: boolean) => void;
  expanded: boolean;
  onExpand: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Card className={`bg-card shadow-sm ${disabled ? 'opacity-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onExpand} 
            className="flex items-center gap-3 flex-1"
            disabled={disabled}
          >
            <div className={`${enabled ? 'text-primary' : 'text-muted-foreground'}`}>
              {icon}
            </div>
            <span className="font-medium text-foreground">{title}</span>
            {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            disabled={disabled}
          />
        </div>
        {expanded && enabled && !disabled && children}
      </CardContent>
    </Card>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-foreground">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ModeButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export { defaultNotificationSettings };
