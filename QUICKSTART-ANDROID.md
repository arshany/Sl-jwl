
# البدء السريع - بناء تطبيق أندرويد APK

## الطريقة السريعة (النسخة التجريبية)

### الخطوة 1: بناء التطبيق
انقر نقراً مزدوجاً على `build-android.bat`

أو من سطر الأوامر:
```bash
npm run android:debug
```

### الخطوة 2: العثور على ملف APK
بعد انتهاء البناء، ستجد الملف في:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

### الخطوة 3: تثبيت التطبيق على الهاتف
1. انقل ملف APK إلى هاتفك الأندرويد
2. افتح الملف من مدير الملفات
3. اضغط "تثبيت"

## الطريقة المتقدمة (النسخة النهائية للنشر)

### الخطوة 1: إنشاء ملف Keystore
انقر نقراً مزدوجاً على `create-keystore.bat`

أو من سطر الأوامر:
```bash
keytool -genkey -v -keystore my-key.keystore -alias my-alias -keyalg RSA -keysize 2048 -validity 10000
```

### الخطوة 2: بناء الإصدار النهائي
انقر نقراً مزدوجاً على `build-android-release.bat`

أو من سطر الأوامر:
```bash
npm run android:release
```

### الخطوة 3: توقيع التطبيق
من سطر الأوامر:
```bash
sign-app.bat my-key.keystore my-alias
```

### الخطوة 4: تحسين APK (اختياري)
```bash
zipalign -v 4 android\app\build\outputs\apk\release\app-release-unsigned.apk android\app\build\outputs\apk\release\app-release.apk
```

## أوامر npm المتاحة

```bash
# بناء ومزامنة
npm run android:build

# فتح في Android Studio
npm run android:open

# بناء نسخة Debug
npm run android:debug

# بناء نسخة Release
npm run android:release
```

## ملاحظات مهمة

1. **للاختبار**: استخدم `build-android.bat` أو `npm run android:debug`
2. **للنشر**: استخدم `build-android-release.bat` أو `npm run android:release`
3. **Keystore**: احتفظ به في مكان آمن ولا تفقد كلمة المرور
4. **التحديثات**: ستحتاج إلى نفس ملف keystore لتوقيع أي تحديثات مستقبلية

## إعداد متغيرات البيئة

### JAVA_HOME

1. تأكد من تثبيت Java JDK من: https://www.oracle.com/java/technologies/downloads/
2. ابحث عن مسار تثبيت Java (عادة في: C:\\Program Files\\Java\\jdk-17)
3. افتح إعدادات النظام:
   - اضغط على زر Windows وابحث عن "Environment Variables"
   - اختر "Edit the system environment variables"
   - اضغط على "Environment Variables"
4. في قسم "System variables"، اضغط على "New"
   - Variable name: `JAVA_HOME`
   - Variable value: مسار تثبيت Java (مثال: `C:\\Program Files\\Java\\jdk-17`)
5. أضف إلى PATH:
   - في قسم "System variables"، ابحث عن "Path" واضغط "Edit"
   - اضغط "New" وأضف: `%JAVA_HOME%\\bin`
6. أعد تشغيل سطر الأوامر
7. تحقق من التثبيت:
   ```bash
   java -version
   javac -version
   echo %JAVA_HOME%
   ```

### ANDROID_HOME

1. افتح Android Studio
2. اذهب إلى File > Settings > Appearance & Behavior > System Settings > Android SDK
3. انسخ مسار Android SDK (عادة في: C:\\Users\\[username]\\AppData\\Local\\Android\\Sdk)
4. افتح إعدادات النظام:
   - اضغط على زر Windows وابحث عن "Environment Variables"
   - اختر "Edit the system environment variables"
   - اضغط على "Environment Variables"
5. في قسم "System variables"، اضغط على "New"
   - Variable name: `ANDROID_HOME`
   - Variable value: مسار Android SDK
6. أضف إلى PATH:
   - في قسم "System variables"، ابحث عن "Path" واضغط "Edit"
   - اضغط "New" وأضف: `%ANDROID_HOME%\\platform-tools`
   - اضغط "New" وأضف: `%ANDROID_HOME%\\tools`
7. أعد تشغيل سطر الأوامر
8. تحقق من التثبيت:
   ```bash
   echo %ANDROID_HOME%
   adb version
   ```

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

## الدليل الشامل

للحصول على دليل مفصل، راجع `README-ANDROID.md`
