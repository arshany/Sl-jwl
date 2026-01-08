
@echo off
echo ====================================
echo بناء تطبيق أندرويد APK (إصدار نهائي)
echo ====================================
echo.

echo [1/3] بناء المشروع...
call npm run build
if %errorlevel% neq 0 (
    echo خطأ في بناء المشروع
    pause
    exit /b 1
)

echo.
echo [2/3] مزامنة ملفات الويب مع مشروع أندرويد...
call npx cap sync android
if %errorlevel% neq 0 (
    echo خطأ في مزامنة الملفات
    pause
    exit /b 1
)

echo.
echo [3/3] بناء APK (إصدار نهائي)...
cd android
call gradlew assembleRelease
if %errorlevel% neq 0 (
    echo خطأ في بناء APK
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
echo ====================================
echo تم بناء APK النهائي بنجاح!
echo الملف موجود في: android\app\build\outputs\apk\release\app-release-unsigned.apk
echo ====================================
echo.
echo ملاحظة: هذا الإصدار غير موقّع. للتوقيع، استخدم:
echo jarsigner -keystore your-key.keystore android\app\build\outputs\apk\release\app-release-unsigned.apk your-alias
echo.
pause
