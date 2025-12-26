import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Compass as CompassIcon } from "lucide-react";
import { usePrayer } from "@/lib/prayer-context";
import { Coordinates, Qibla } from "adhan";

export default function QiblaPage() {
  const { settings } = usePrayer();
  const [heading, setHeading] = useState<number | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState(0);

  useEffect(() => {
    // Calculate Qibla direction based on current location
    if (settings.latitude && settings.longitude) {
      const coords = new Coordinates(settings.latitude, settings.longitude);
      const qibla = Qibla(coords);
      setQiblaDirection(qibla);
    }
  }, [settings.latitude, settings.longitude]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // alpha is the compass direction (0-360)
      if (event.alpha) {
        // iOS requires webkitCompassHeading, standard is alpha
        const compass = (event as any).webkitCompassHeading || Math.abs(event.alpha - 360);
        setHeading(compass);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  // Simple rotation style
  const needleRotation = heading !== null ? qiblaDirection - heading : qiblaDirection;

  return (
    <div className="min-h-screen bg-background pb-24 pt-10 px-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-primary mb-12">اتجاه القبلة</h1>

      <div className="relative w-72 h-72 rounded-full border-4 border-muted flex items-center justify-center shadow-xl bg-card">
        {/* Compass markings */}
        <div className="absolute top-2 text-muted-foreground font-bold">N</div>
        <div className="absolute bottom-2 text-muted-foreground font-bold">S</div>
        <div className="absolute right-4 text-muted-foreground font-bold">E</div>
        <div className="absolute left-4 text-muted-foreground font-bold">W</div>

        {/* The rotating needle/dial */}
        <div 
           className="w-full h-full absolute transition-transform duration-500 ease-out"
           style={{ transform: `rotate(${needleRotation}deg)` }}
        >
             {/* Kaaba Icon / Direction Indicator */}
             <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                 <div className="w-12 h-12 bg-black rounded-sm border-2 border-gold mb-2 shadow-lg relative">
                    <div className="absolute top-2 w-full h-1 bg-yellow-500"></div>
                 </div>
                 <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-primary"></div>
             </div>
        </div>
        
        <div className="z-10 bg-background rounded-full p-4 border shadow-inner">
            <CompassIcon className="h-8 w-8 text-muted-foreground opacity-20" />
        </div>
      </div>

      <div className="mt-12 text-center space-y-2">
        <h2 className="text-xl font-bold">{Math.round(qiblaDirection)}° من الشمال</h2>
        <p className="text-sm text-muted-foreground">
             {heading === null 
               ? "يرجى تحريك الهاتف لمعايرة البوصلة" 
               : "قم بتدوير الهاتف حتى يشير السهم إلى الكعبة"}
        </p>
        <p className="text-xs text-muted-foreground/50 mt-4">
            تأكد من تفعيل الموقع والسماح بالوصول للمستشعرات
        </p>
      </div>
    </div>
  );
}
