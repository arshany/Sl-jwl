import { useState } from "react";
import { usePrayer } from "@/lib/prayer-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Moon, Sun, Volume2, Bell, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const adhanSounds = [
    { id: 'makkah', name: 'أذان مكة المكرمة' },
    { id: 'madina', name: 'أذان المدينة المنورة' },
    { id: 'egypt', name: 'الأذان المصري' },
    { id: 'alaqsa', name: 'أذان المسجد الأقصى' },
    { id: 'beep', name: 'تنبيه قصير (Beep)' },
];

export default function SettingsPage() {
  const { settings, updateSettings, refreshLocation, loading, locationError } = usePrayer();
  const [cityInput, setCityInput] = useState(settings.city);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCitySearch = () => {
    if (cityInput) {
      updateSettings({ city: cityInput });
      if (cityInput.includes("الرياض")) updateSettings({ latitude: 24.7136, longitude: 46.6753 });
      else if (cityInput.includes("دبي")) updateSettings({ latitude: 25.2048, longitude: 55.2708 });
      else if (cityInput.includes("القاهرة")) updateSettings({ latitude: 30.0444, longitude: 31.2357 });
      toast({ description: "تم تحديث الموقع" });
    }
  };
  
  const togglePreview = (soundId: string) => {
      if (playingPreview === soundId) {
          setPlayingPreview(null);
          // Stop audio logic here
      } else {
          setPlayingPreview(soundId);
          // Play audio logic here
          // Since we don't have real files, we just simulate
          setTimeout(() => setPlayingPreview(null), 3000); 
      }
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-primary mb-6">الإعدادات</h1>

      {/* Notifications & Sound */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            الأصوات والتنبيهات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
             {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((prayer) => (
                 <div key={prayer} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                     <span className="font-medium text-sm w-16">
                         {prayer === 'fajr' ? 'الفجر' : prayer === 'dhuhr' ? 'الظهر' : prayer === 'asr' ? 'العصر' : prayer === 'maghrib' ? 'المغرب' : 'العشاء'}
                     </span>
                     <div className="flex items-center gap-2">
                        <Select 
                            value={settings.notifications[prayer as keyof typeof settings.notifications]} 
                            onValueChange={(val: any) => updateSettings({ 
                                notifications: { ...settings.notifications, [prayer]: val }
                            })}
                        >
                            <SelectTrigger className="w-[100px] h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sound">أذان كامل</SelectItem>
                                <SelectItem value="vibrate">اهتزاز</SelectItem>
                                <SelectItem value="silent">صامت</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                 </div>
             ))}

             <div className="pt-4 mt-2 border-t border-border">
                <Label className="mb-2 block text-sm">صوت الأذان الافتراضي</Label>
                <div className="space-y-2">
                    {adhanSounds.map(sound => (
                        <div key={sound.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 cursor-pointer" onClick={() => updateSettings({ defaultAdhan: sound.id })}>
                            <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${settings.defaultAdhan === sound.id ? 'border-primary' : 'border-muted'}`}>
                                    {settings.defaultAdhan === sound.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                                <span className="text-sm">{sound.name}</span>
                            </div>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); togglePreview(sound.id); }}>
                                {playingPreview === sound.id ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                            </Button>
                        </div>
                    ))}
                </div>
             </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            الموقع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="اسم المدينة"
              className="text-right"
            />
            <Button onClick={handleCitySearch} variant="secondary">بحث</Button>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full gap-2" 
            onClick={refreshLocation}
            disabled={loading}
          >
            <MapPin className="h-4 w-4" />
            {loading ? "جاري التحديد..." : "استخدام موقعي الحالي"}
          </Button>
        </CardContent>
      </Card>

      {/* Calculation Method */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ActivityIcon className="h-5 w-5 text-primary" />
            طريقة الحساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>الجهة المحسوبة</Label>
            <Select 
              value={settings.method} 
              onValueChange={(val: any) => updateSettings({ method: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الطريقة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UmmAlQura">أم القرى (السعودية)</SelectItem>
                <SelectItem value="Egyptian">الهيئة المصرية العامة للمساحة</SelectItem>
                <SelectItem value="MuslimWorldLeague">رابطة العالم الإسلامي</SelectItem>
                <SelectItem value="Dubai">دائرة الشؤون الإسلامية (دبي)</SelectItem>
                <SelectItem value="Kuwait">وزارة الأوقاف (الكويت)</SelectItem>
                <SelectItem value="Karachi">جامعة العلوم الإسلامية (كراتشي)</SelectItem>
                <SelectItem value="NorthAmerica">أمريكا الشمالية (ISNA)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>مذهب العصر</Label>
            <Select 
              value={settings.asrMadhab} 
              onValueChange={(val: any) => updateSettings({ asrMadhab: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shafi">الجمهور (شافعي، مالكي، حنبلي)</SelectItem>
                <SelectItem value="Hanafi">حنفي</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-2 border-t border-border">
             <Label className="mb-2 block text-sm">تصحيح الأوقات (دقائق)</Label>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">الفجر</span>
                    <Input type="number" className="h-8 text-center" placeholder="0" 
                        value={settings.adjustments?.fajr || 0}
                        onChange={(e) => updateSettings({ adjustments: { ...settings.adjustments, fajr: parseInt(e.target.value) || 0 } })}
                    />
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">العشاء</span>
                    <Input type="number" className="h-8 text-center" placeholder="0" 
                        value={settings.adjustments?.isha || 0}
                        onChange={(e) => updateSettings({ adjustments: { ...settings.adjustments, isha: parseInt(e.target.value) || 0 } })}
                    />
                </div>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            المظهر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              {settings.theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              الوضع الليلي
            </Label>
            <Switch 
              checked={settings.theme === 'dark'}
              onCheckedChange={(checked) => updateSettings({ theme: checked ? 'dark' : 'light' })}
            />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

function ActivityIcon(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    )
}
