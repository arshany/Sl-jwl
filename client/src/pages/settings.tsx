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
import { MapPin, Moon, Sun, Volume2, Bell } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings, refreshLocation, loading, locationError } = usePrayer();
  const [cityInput, setCityInput] = useState(settings.city);

  const handleCitySearch = () => {
    // In a real app, this would geocode. For now, we simulate.
    if (cityInput) {
      updateSettings({ city: cityInput });
      // Here we would ideally fetch coords for the city. 
      // For mockup, we can't easily geocode without API key.
      // We will just update the name and maybe set dummy coords if "Riyadh" etc.
      if (cityInput.includes("الرياض")) updateSettings({ latitude: 24.7136, longitude: 46.6753 });
      else if (cityInput.includes("دبي")) updateSettings({ latitude: 25.2048, longitude: 55.2708 });
      else if (cityInput.includes("القاهرة")) updateSettings({ latitude: 30.0444, longitude: 31.2357 });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-primary mb-6">الإعدادات</h1>

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
          
          {locationError && <p className="text-xs text-destructive">{locationError}</p>}
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
