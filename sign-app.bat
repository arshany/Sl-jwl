
@echo off
echo ====================================
echo توقيع تطبيق أندرويد APK
echo ====================================
echo.

if not exist "android\app\build\outputs\apk\release\app-release-unsigned.apk" (
    echo خطأ: لم يتم العثور على ملف APK غير الموقع
    echo يرجى بناء الإصدار النهائي أولاً باستخدام build-android-release.bat
    pause
    exit /b 1
)

if "%1"=="" (
    echo الاستخدام: sign-app.bat [keystore-file] [alias]
    echo مثال: sign-app.bat my-key.keystore my-alias
    pause
    exit /b 1
)

set KEYSTORE=%1
set ALIAS=%2

if not exist "%KEYSTORE%" (
    echo خطأ: لم يتم العثور على ملف keystore: %KEYSTORE%
    pause
    exit /b 1
)

echo.
echo توقيع التطبيق باستخدام: %KEYSTORE%
echo.

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "%KEYSTORE%" "android\app\build\outputs\apk\release\app-release-unsigned.apk" "%ALIAS%"

if %errorlevel% neq 0 (
    echo خطأ في توقيع التطبيق
    pause
    exit /b 1
)

echo.
echo ====================================
echo تم توقيع التطبيق بنجاح!
echo الملف الموقع: android\app\build\outputs\apk\release\app-release-unsigned.apk
echo ====================================
pause
