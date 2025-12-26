import { useState } from "react";
import { usePrayer } from "@/lib/prayer-context";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Moon, Globe, Clock, Share2, Star, ChevronLeft, X } from "lucide-react";
import { Link } from "wouter";

export default function SettingsPage() {
  const { settings, updateSettings } = usePrayer();

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
              data-testid="setting-adhan"
            />
            <SettingRow 
              icon={<Bell className="h-5 w-5 text-primary" />}
              label="منبه الأذكار"
              hasChevron
              data-testid="setting-athkar-reminder"
            />
            <SettingRow 
              icon={<Clock className="h-5 w-5 text-primary" />}
              label="العداد"
              hasChevron
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
              label="تابعنا"
              hasChevron
              data-testid="setting-follow"
            />
            <SettingRow 
              icon={<Share2 className="h-5 w-5 text-primary" />}
              label="مشاركة"
              hasChevron
              data-testid="setting-share"
            />
            <SettingRow 
              icon={<Star className="h-5 w-5 text-primary" />}
              label="قيّم صلاة تايم"
              hasChevron
              data-testid="setting-rate"
            />
          </CardContent>
        </Card>
      </div>
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
}

function SettingRow({ icon, label, value, hasChevron, toggle, checked, onToggle, ...props }: SettingRowProps & { 'data-testid'?: string }) {
  return (
    <div className="flex items-center justify-between p-4" {...props}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <span className="font-medium text-foreground">{label}</span>
      </div>
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
    </div>
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
      <path d="M6 9l6 6 6-6" />
      <path d="M6 15l6 6 6-6" />
    </svg>
  );
}
