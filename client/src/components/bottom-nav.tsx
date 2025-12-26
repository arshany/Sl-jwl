import { Link, useLocation } from "wouter";
import { Home, Compass, BookOpen, Settings, CalendarDays, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "الرئيسية" },
    { href: "/quran", icon: BookOpen, label: "القرآن" },
    { href: "/athkar", icon: Activity, label: "الأذكار" }, // Activity icon as placeholder for Athkar/Tasbih
    { href: "/qibla", icon: Compass, label: "القبلة" },
    { href: "/settings", icon: Settings, label: "الإعدادات" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <item.icon className={cn("h-6 w-6", isActive && "fill-current/20")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
