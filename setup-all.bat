
@echo off
echo ====================================
echo إعداد البيئة بالكامل
echo ====================================
echo.

echo هذا السكريبت سيقوم بإعداد جميع متغيرات البيئة المطلوبة
echo.

echo ====================================
echo 1. إعداد JAVA_HOME
echo ====================================
echo.

setx JAVA_HOME "C:\Program Files\Java\jdk-25" /M

if %errorlevel% neq 0 (
    echo.
    echo خطأ: لم يتمكن من إعداد JAVA_HOME
    echo يرجى تشغيل هذا السكريبت كمسؤول (Run as Administrator)
    echo.
    pause
    exit /b 1
)

echo تم إعداد JAVA_HOME بنجاح!
echo.

echo ====================================
echo 2. إعداد ANDROID_HOME
echo ====================================
echo.

:: محاولة العثور على Android SDK
set "ANDROID_SDK_PATH="

if exist "%LOCALAPPDATA%\Android\Sdk" (
    set "ANDROID_SDK_PATH=%LOCALAPPDATA%\Android\Sdk"
    goto :found
)

if exist "C:\Android\Sdk" (
    set "ANDROID_SDK_PATH=C:\Android\Sdk"
    goto :found
)

if exist "%USERPROFILE%\AppData\Local\Android\Sdk" (
    set "ANDROID_SDK_PATH=%USERPROFILE%\AppData\Local\Android\Sdk"
    goto :found
)

echo لم يتم العثور على Android SDK تلقائياً
echo.
echo يرجى إدخال مسار Android SDK يدوياً
echo.
set /p ANDROID_SDK_PATH="أدخل مسار Android SDK: "

:found
if not exist "%ANDROID_SDK_PATH%" (
    echo.
    echo خطأ: المسار غير صحيح: %ANDROID_SDK_PATH%
    echo.
    pause
    exit /b 1
)

echo.
echo تم العثور على Android SDK في:
echo %ANDROID_SDK_PATH%
echo.

setx ANDROID_HOME "%ANDROID_SDK_PATH%" /M

if %errorlevel% neq 0 (
    echo.
    echo خطأ: لم يتمكن من إعداد ANDROID_HOME
    echo يرجى تشغيل هذا السكريبت كمسؤول (Run as Administrator)
    echo.
    pause
    exit /b 1
)

echo تم إعداد ANDROID_HOME بنجاح!
echo.

echo ====================================
echo 3. تحديث PATH
echo ====================================
echo.

echo يرجى إضافة المسارات التالية إلى متغير PATH يدوياً:
echo.
echo %%JAVA_HOME%%in
echo %%ANDROID_HOME%%\platform-tools
echo %%ANDROID_HOME%%	ools
echo.
echo الخطوات:
echo 1. اضغط على زر Windows وابحث عن "Environment Variables"
echo 2. اختر "Edit the system environment variables"
echo 3. اضغط على "Environment Variables"
echo 4. في قسم "System variables"، ابحث عن "Path" واضغط "Edit"
echo 5. اضغط "New" وأضف: %%JAVA_HOME%%in
echo 6. اضغط "New" وأضف: %%ANDROID_HOME%%\platform-tools
echo 7. اضغط "New" وأضف: %%ANDROID_HOME%%	ools
echo 8. اضغط "OK" على جميع النوافذ
echo.

echo ====================================
echo ملاحظة مهمة
echo ====================================
echo.
echo 1. أغلق جميع نوافذ سطر الأوامر المفتوحة
echo 2. افتح سطر أوامر جديد
echo 3. شغل check-env.bat للتحقق من الإعداد
echo 4. بعد التأكد من الإعداد، شغل:
echo    npm run android:release
echo.

pause
