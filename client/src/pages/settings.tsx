import { useState, useEffect } from "react";
import { usePrayer } from "@/lib/prayer-context";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bell, Moon, Globe, Clock, Share2, Star, ChevronLeft, X, Volume2, Vibrate, VolumeX, Check, Music, Play, Square } from "lucide-react";
import { Link } from "wouter";
import { adhanSounds, playAdhanPreview, stopAdhanPreview } from "@/lib/adhan-sounds";

type NotificationMode = 'sound' | 'vibrate' | 'silent';

const prayerNames: Record<string, string> = {
  fajr: 'الفجر',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء'
};

export default function SettingsPage() {
  const { settings, updateSettings } = usePrayer();
  const [adhanDialogOpen, setAdhanDialogOpen] = useState(false);
  const [adhanSoundDialogOpen, setAdhanSoundDialogOpen] = useState(false);
  const [athkarDialogOpen, setAthkarDialogOpen] = useState(false);
  const [counterDialogOpen, setCounterDialogOpen] = useState(false);
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const currentAdhanSound = adhanSounds.find(s => s.id === settings.defaultAdhan) || adhanSounds[0];

  useEffect(() => {
    if (!adhanSoundDialogOpen) {
      stopAdhanPreview();
      setPlayingSound(null);
    }
  }, [adhanSoundDialogOpen]);

  const handlePlaySound = (soundId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingSound === soundId) {
      stopAdhanPreview();
      setPlayingSound(null);
    } else {
      playAdhanPreview(soundId);
      setPlayingSound(soundId);
    }
  };

  const handleSelectSound = (soundId: string) => {
    stopAdhanPreview();
    setPlayingSound(null);
    updateSettings({ defaultAdhan: soundId });
    setAdhanSoundDialogOpen(false);
    setAdhanDialogOpen(true);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'صلاة تايم',
      text: 'تطبيق إسلامي شامل لمواقيت الصلاة، القبلة، القرآن والأذكار',
      url: window.location.origin
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert('تم نسخ الرابط');
    }
  };

  const updateNotification = (prayer: string, mode: NotificationMode) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [prayer]: mode
      }
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pt-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-destructive" data-testid="btn-close-settings">
            <X className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground" data-testid="text-settings-title">الإعدادات</h1>
        <div className="w-10" />
      </header>

      {/* Notifications Section */}
      <div className="px-4 mb-6">
        <h2 className="text-primary font-bold mb-3 text-center">التنبيهات</h2>
        <Card className="bg-card shadow-sm">
          <CardContent className="p-0 divide-y divide-border">
            <SettingRow 
              icon={<Bell className="h-5 w-5 text-primary" />}
              label="الآذان"
              hasChevron
              onClick={() => setAdhanDialogOpen(true)}
              data-testid="setting-adhan"
            />
            <SettingRow 
              icon={<Bell className="h-5 w-5 text-primary" />}
              label="منبه الأذكار"
              hasChevron
              onClick={() => setAthkarDialogOpen(true)}
              data-testid="setting-athkar-reminder"
            />
            <SettingRow 
              icon={<Clock className="h-5 w-5 text-primary" />}
              label="العداد"
              hasChevron
              onClick={() => setCounterDialogOpen(true)}
              data-testid="setting-counter"
            />
          </CardContent>
        </Card>
      </div>

      {/* Interface Section */}
      <div className="px-4 mb-6">
        <h2 className="text-primary font-bold mb-3 text-center">الواجهة</h2>
        <Card className="bg-card shadow-sm">
          <CardContent className="p-0 divide-y divide-border">
            <SettingRow 
              icon={<Globe className="h-5 w-5 text-primary" />}
              label="اللغة"
              value="العربية"
              data-testid="setting-language"
            />
            <SettingRow 
              icon={<Moon className="h-5 w-5 text-primary" />}
              label="الوضع الليلي"
              toggle
              checked={settings.theme === 'dark'}
              onToggle={(checked) => updateSettings({ theme: checked ? 'dark' : 'light' })}
              data-testid="setting-dark-mode"
            />
            <SettingRow 
              icon={<Clock className="h-5 w-5 text-primary" />}
              label="٢٤ ساعة"
              toggle
              checked={settings.use24Hour || false}
              onToggle={(checked) => updateSettings({ use24Hour: checked })}
              data-testid="setting-24-hour"
            />
          </CardContent>
        </Card>
      </div>

      {/* App Info Section */}
      <div className="px-4 mb-6">
        <h2 className="text-primary font-bold mb-3 text-center">صلاة تايم</h2>
        <Card className="bg-card shadow-sm">
          <CardContent className="p-0 divide-y divide-border">
            <SettingRow 
              icon={<AppVersionIcon className="h-5 w-5 text-primary" />}
              label="إصدار"
              value="1.0.0"
              data-testid="setting-version"
            />
            <SettingRow 
              icon={<Share2 className="h-5 w-5 text-primary" />}
              label="مشاركة"
              hasChevron
              onClick={handleShare}
              data-testid="setting-share"
            />
            <SettingRow 
              icon={<Star className="h-5 w-5 text-primary" />}
              label="قيّم صلاة تايم"
              hasChevron
              onClick={() => alert('شكراً لدعمك!')}
              data-testid="setting-rate"
            />
          </CardContent>
        </Card>
      </div>

      {/* Adhan Settings Dialog */}
      <Dialog open={adhanDialogOpen} onOpenChange={setAdhanDialogOpen}>
        <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center">إعدادات الآذان</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Adhan Sound Selection */}
            <div className="space-y-2">
              <p className="font-medium text-foreground">صوت الأذان</p>
              <button
                onClick={() => {
                  setAdhanDialogOpen(false);
                  setAdhanSoundDialogOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                data-testid="btn-select-adhan-sound"
              >
                <div className="flex items-center gap-3">
                  <Music className="h-5 w-5 text-primary" />
                  <div className="text-right">
                    <p className="font-medium text-foreground">{currentAdhanSound.name}</p>
                    <p className="text-xs text-muted-foreground">{currentAdhanSound.reciter}</p>
                  </div>
                </div>
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="border-t border-border pt-4">
              <p className="font-medium text-foreground mb-3">نوع التنبيه لكل صلاة</p>
              {Object.entries(prayerNames).map(([key, name]) => (
                <div key={key} className="space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground">{name}</p>
                  <div className="flex gap-2">
                    <NotificationButton
                      active={settings.notifications[key] === 'sound'}
                      onClick={() => updateNotification(key, 'sound')}
                      icon={<Volume2 className="h-4 w-4" />}
                      label="صوت"
                    />
                    <NotificationButton
                      active={settings.notifications[key] === 'vibrate'}
                      onClick={() => updateNotification(key, 'vibrate')}
                      icon={<Vibrate className="h-4 w-4" />}
                      label="اهتزاز"
                    />
                    <NotificationButton
                      active={settings.notifications[key] === 'silent'}
                      onClick={() => updateNotification(key, 'silent')}
                      icon={<VolumeX className="h-4 w-4" />}
                      label="صامت"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Adhan Sound Selection Dialog */}
      <Dialog open={adhanSoundDialogOpen} onOpenChange={setAdhanSoundDialogOpen}>
        <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center">اختر صوت الأذان</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground text-center mb-2">اضغط على زر التشغيل للاستماع</p>
          <div className="space-y-2 mt-2">
            {adhanSounds.map((sound) => (
              <div
                key={sound.id}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  settings.defaultAdhan === sound.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-muted border-border'
                }`}
                data-testid={`adhan-sound-${sound.id}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={(e) => handlePlaySound(sound.id, e)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      playingSound === sound.id 
                        ? 'bg-red-500 text-white' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                    data-testid={`btn-play-${sound.id}`}
                  >
                    {playingSound === sound.id ? (
                      <Square className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 mr-[-2px]" />
                    )}
                  </button>
                  <div className="text-right flex-1">
                    <p className="font-medium text-foreground">{sound.name}</p>
                    <p className="text-xs text-muted-foreground">{sound.reciter} - {sound.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectSound(sound.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    settings.defaultAdhan === sound.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border hover:bg-muted'
                  }`}
                  data-testid={`btn-select-${sound.id}`}
                >
                  {settings.defaultAdhan === sound.id ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      مختار
                    </span>
                  ) : (
                    'اختيار'
                  )}
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Athkar Reminder Dialog */}
      <Dialog open={athkarDialogOpen} onOpenChange={setAthkarDialogOpen}>
        <DialogContent className="max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center">منبه الأذكار</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">أذكار الصباح</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">أذكار المساء</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">أذكار النوم</span>
              <Switch />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              سيتم تذكيرك بالأذكار في أوقاتها المناسبة
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Counter Settings Dialog */}
      <Dialog open={counterDialogOpen} onOpenChange={setCounterDialogOpen}>
        <DialogContent className="max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center">إعدادات العداد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">اهتزاز عند الانتهاء</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">صوت عند الضغط</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">إعادة تعيين تلقائي</span>
              <Switch />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  hasChevron?: boolean;
  toggle?: boolean;
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
  onClick?: () => void;
}

function SettingRow({ icon, label, value, hasChevron, toggle, checked, onToggle, onClick, ...props }: SettingRowProps & { 'data-testid'?: string }) {
  const content = (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <span className="font-medium text-foreground">{label}</span>
    </div>
  );

  const actions = (
    <div className="flex items-center gap-2">
      {value && <span className="text-muted-foreground text-sm">{value}</span>}
      {toggle && (
        <Switch 
          checked={checked} 
          onCheckedChange={onToggle}
        />
      )}
      {hasChevron && <ChevronLeft className="h-5 w-5 text-muted-foreground" />}
    </div>
  );

  if (onClick) {
    return (
      <button 
        className="flex items-center justify-between p-4 w-full text-right hover:bg-muted/50 transition-colors"
        onClick={onClick}
        {...props}
      >
        {content}
        {actions}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between p-4" {...props}>
      {content}
      {actions}
    </div>
  );
}

function NotificationButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border transition-colors ${
        active 
          ? 'bg-primary text-primary-foreground border-primary' 
          : 'bg-muted border-border hover:bg-muted/80'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function AppVersionIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}
