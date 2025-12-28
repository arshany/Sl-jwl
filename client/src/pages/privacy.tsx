import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Mail, Globe } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="flex items-center p-4 pt-6 gap-2">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="rounded-full" data-testid="btn-privacy-back">
            <ArrowRight className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground flex-1">سياسة الخصوصية</h1>
        <Shield className="h-6 w-6 text-primary" />
      </header>

      <div className="px-4 space-y-6">
        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-primary mb-3">سياسة الخصوصية لتطبيق «أقم»</h2>
            <p className="text-foreground leading-relaxed">
              نحن في تطبيق أقم نولي خصوصية المستخدم أهمية قصوى، ونلتزم بحماية بياناتك واحترامها.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-xl">🚫</span>
              المعلومات التي لا نجمعها
            </h3>
            <ul className="space-y-2 text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>لا نقوم بجمع أي بيانات شخصية.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>لا نطلب إنشاء حساب.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>لا نقوم بتتبع المستخدمين.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>لا نبيع أو نشارك أي بيانات مع أطراف خارجية.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-xl">📱</span>
              المعلومات التي يتم استخدامها محليًا
            </h3>
            <p className="text-foreground mb-3">
              قد يستخدم التطبيق بعض المعلومات محليًا على جهازك فقط، مثل:
            </p>
            <ul className="space-y-2 text-foreground mb-4">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>الموقع الجغرافي (لتحديد مواقيت الصلاة والقبلة).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>إعدادات التطبيق (طريقة الحساب، التنبيهات، الوضع الليلي).</span>
              </li>
            </ul>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                ⚠️ هذه المعلومات لا يتم رفعها أو تخزينها على أي خادم، وتبقى داخل جهاز المستخدم فقط.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-xl">🔔</span>
              الإشعارات
            </h3>
            <p className="text-foreground mb-2">
              يستخدم التطبيق الإشعارات فقط لغرض:
            </p>
            <ul className="space-y-2 text-foreground mb-3">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>التنبيه بمواقيت الصلاة</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>التذكير بالأذكار (إن فعّلها المستخدم)</span>
              </li>
            </ul>
            <p className="text-muted-foreground text-sm">
              ولا يتم استخدامها لأي أغراض إعلانية.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-xl">🔒</span>
              أمان البيانات
            </h3>
            <p className="text-foreground">
              نلتزم باستخدام أفضل الممارسات التقنية لضمان أمان واستقرار التطبيق.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-xl">📝</span>
              التغييرات على السياسة
            </h3>
            <p className="text-foreground">
              قد نقوم بتحديث سياسة الخصوصية عند الحاجة، وسيتم نشر أي تعديل داخل التطبيق أو صفحة المتجر.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-xl">📧</span>
              التواصل
            </h3>
            <p className="text-foreground mb-4">
              في حال وجود أي استفسار بخصوص الخصوصية، يمكن التواصل معنا عبر:
            </p>
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
      </div>
    </div>
  );
}
