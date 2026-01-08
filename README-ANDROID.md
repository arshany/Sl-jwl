
# دليل تحويل المشروع إلى تطبيق أندرويد APK

## نظرة عامة
هذا الدليل يشرح كيفية تحويل مشروع "أقم" إلى تطبيق أندرويد APK باستخدام Capacitor.

## المتطلبات المسبقة
1. **Node.js** - الإصدار 18 أو أحدث
2. **Java Development Kit (JDK)** - الإصدار 17 أو أحدث
3. **Android Studio** - أحدث إصدار
4. **Android SDK** - مع SDK Platform Tools

## إعداد البيئة

### تثبيت المتطلبات
1. قم بتثبيت Node.js من: https://nodejs.org/
2. قم بتثبيت JDK من: https://www.oracle.com/java/technologies/downloads/
3. قم بتثبيت Android Studio من: https://developer.android.com/studio

### إعداد متغيرات البيئة
أضف المتغيرات التالية إلى متغيرات البيئة:
- `JAVA_HOME` - مسار تثبيت JDK
- `ANDROID_HOME` - مسار Android SDK
- أضف `%ANDROID_HOME\platform-tools` و `%ANDROID_HOME\tools` إلى PATH

## بناء التطبيق

### للنسخة التجريبية (Debug)
1. انقر نقراً مزدوجاً على `build-android.bat`
2. انتظر انتهاء البناء
3. ستجد الملف في: `android\app\build\outputs\apk\debug\app-debug.apk`

### للنسخة النهائية (Release)
1. إنشاء ملف Keystore:
   ```
   create-keystore.bat
   ```
2. بناء الإصدار النهائي:
   ```
   build-android-release.bat
   ```
3. توقيع التطبيق:
   ```
   sign-app.bat my-key.keystore my-alias
   ```
4. تحسين APK (اختياري):
   ```bash
   zipalign -v 4 android\app\build\outputs\apk\release\app-release-unsigned.apk android\app\build\outputs\apk\release\app-release.apk
   ```

## تثبيت التطبيق على الهاتف

### عبر USB
1. فعّل خيار "USB Debugging" في إعدادات المطور على الهاتف
2. وصّل الهاتف بالكمبيوتر
3. شغّل الأمر:
   ```bash
   adb install android\app\build\outputs\apk\debug\app-debug.apk
   ```

### عبر ملف APK
1. انقل ملف APK إلى الهاتف
2. افتح الملف من مدير الملفات
3. اضغط "تثبيت"

## نشر التطبيق على Google Play Store

1. قم بإنشاء حساب مطور على Google Play Console
2. ادفع رسوم التسجيل (25$)
3. أنشئ تطبيق جديد في Play Console
4. املأ معلومات التطبيق
5. ارفع ملف APK الموقع
6. أكمل متطلبات النشر
7. اضغط "نشر"

## استكشاف الأخطاء

### خطأ: "ANDROID_HOME not set"
- تأكد من إضافة متغير البيئة `ANDROID_HOME`
- أعد تشغيل سطر الأوامر بعد إضافة المتغير

### خطأ: "JAVA_HOME not set"
- تأكد من إضافة متغير البيئة `JAVA_HOME`
- تأكد من تثبيت JDK

### خطأ في البناء
- تأكد من تثبيت جميع المتطلبات المسبقة
- تأكد من اتصال الإنترنت لتحميل التبعيات
- حذف مجلد `android` وأعد بناءه باستخدام `npx cap add android`

## ملاحظات مهمة

1. **Keystore**: احتفظ بملف keystore في مكان آمن ولا تفقد كلمة المرور
2. **التحديثات**: ستحتاج إلى نفس ملف keystore لتوقيع أي تحديثات مستقبلية
3. **الأمان**: لا تقم أبداً بتضمين ملف keystore في مستودع الكود
4. **الاختبار**: اختبر التطبيق جيداً قبل نشره على Play Store

## الدعم
إذا واجهت أي مشاكل، راجع:
- وثائق Capacitor: https://capacitorjs.com/docs
- وثائق Android Studio: https://developer.android.com/studio
