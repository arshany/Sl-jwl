import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Mail, Globe, Building2, Check } from "lucide-react";
import { Link } from "wouter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="flex items-center p-4 pt-6 gap-2">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="rounded-full" data-testid="btn-about-back">
            <ArrowRight className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground flex-1">حول التطبيق</h1>
      </header>

      <div className="px-4 space-y-6">
        <Card className="bg-gradient-to-l from-[#709046] to-[#5a7338] text-white shadow-lg overflow-hidden">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
              🕌
            </div>
            <h2 className="text-2xl font-bold mb-2">أقم</h2>
            <p className="text-lg opacity-90">الصلاة في وقتها</p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <p className="text-foreground leading-relaxed text-center">
              أقم هو تطبيق إسلامي أنيق يهدف إلى مساعدتك على المحافظة على الصلاة والذكر بأسلوب هادئ وبسيط، دون إزعاج أو تعقيد.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-bold text-foreground mb-4 text-center">مميزات التطبيق</h3>
            <div className="grid grid-cols-2 gap-3">
              <FeatureItem icon="🕌" text="مواقيت صلاة دقيقة حسب موقعك" />
              <FeatureItem icon="🔔" text="تنبيهات أذان قابلة للتخصيص" />
              <FeatureItem icon="🧭" text="تحديد اتجاه القبلة" />
              <FeatureItem icon="📖" text="المصحف الشريف مع متابعة القراءة" />
              <FeatureItem icon="📿" text="أذكار الصباح والمساء والصلاة" />
              <FeatureItem icon="🌙" text="وضع ليلي مريح للعين" />
              <FeatureItem icon="🧩" text="ويدجت ذكية للصفحة الرئيسية" />
              <FeatureItem icon="⚙️" text="إعدادات مرنة وسهلة" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <p className="text-foreground leading-relaxed text-center italic">
              تم تصميم التطبيق بعناية ليكون رفيقك اليومي في العبادة، مع تركيز على الخشوع والطمأنينة.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-6 w-6 text-primary" />
              <h3 className="font-bold text-foreground">عن الجهة المطوّرة</h3>
            </div>
            <p className="text-foreground leading-relaxed mb-4">
              تطبيق أقم هو أحد منتجات <strong>شركة ميتا فيجن – Meta Vision</strong> المتخصصة في تطوير الحلول الرقمية والتطبيقات الذكية.
            </p>
            <p className="text-muted-foreground text-sm">
              نهدف من خلال هذا التطبيق إلى تقديم تجربة روحانية راقية تخدم المستخدم وتحترم خصوصيته.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-bold text-foreground mb-3 text-center">ملاحظة مهمة</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-foreground">التطبيق مجاني</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-foreground">لا يحتوي على إعلانات</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-foreground">لا يجمع بيانات</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-foreground">لا يطلب تسجيل دخول</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-bold text-foreground mb-4">تواصل معنا</h3>
            <div className="space-y-3">
              <a 
                href="mailto:info@meta-vision.net" 
                className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-foreground">info@meta-vision.net</span>
              </a>
              <a 
                href="https://www.meta-vision.net" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <Globe className="h-5 w-5 text-primary" />
                <span className="text-foreground">www.meta-vision.net</span>
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-muted-foreground text-sm py-4">
          <p>الإصدار 1.0.0</p>
          <p className="mt-1">© 2024 Meta Vision</p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-foreground">{text}</span>
    </div>
  );
}
