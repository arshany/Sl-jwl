
# تعليمات بناء تطبيق أندرويد APK

## المتطلبات المسبقة
1. Node.js و npm
2. Java Development Kit (JDK) 17 أو أحدث
3. Android Studio

## خطوات البناء

### 1. بناء المشروع
```bash
npm run build
```

### 2. مزامنة ملفات الويب مع مشروع أندرويد
```bash
npx cap sync android
```

### 3. فتح المشروع في Android Studio
```bash
npx cap open android
```

### 4. بناء APK من Android Studio
- في Android Studio، اختر Build > Build Bundle(s) / APK(s) > Build APK(s)
- سيتم إنشاء الملف في المسار: `android/app/build/outputs/apk/debug/app-debug.apk`

### أو بناء APK مباشرة من سطر الأوامر
```bash
cd android
./gradlew assembleDebug
```

## ملاحظات
- تأكد من تثبيت Android SDK و JDK قبل البناء
- للإصدار النهائي، استخدم `assembleRelease` بدلاً من `assembleDebug`
- قد تحتاج إلى توقيع التطبيق للإصدار النهائي
