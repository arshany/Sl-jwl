
@echo off
echo ====================================
echo دليل تثبيت Java JDK
echo ====================================
echo.

echo هذا السكريبت سيوجهك إلى موقع Oracle لتحميل Java JDK
echo.

echo الخطوات:
echo 1. سيتم فتح موقع Oracle في متصفحك
echo 2. قم بتحميل JDK 17 LTS لنظام Windows
echo 3. قم بتشغيل الملف المحمل واتبع معالج التثبيت
echo 4. بعد التثبيت، أعد تشغيل هذا السكريبت للتحقق
echo.

pause

echo.
echo جاري فتح موقع Oracle...
start https://www.oracle.com/java/technologies/downloads/

echo.
echo بعد تثبيت Java، أعد تشغيل هذا السكريبت للتحقق من التثبيت
echo.
pause

echo.
echo ====================================
echo التحقق من تثبيت Java
echo ====================================
echo.

java -version 2>nul
if %errorlevel% neq 0 (
    echo.
    echo Java غير مثبت على جهازك
    echo يرجى تثبيته أولاً ثم أعد تشغيل هذا السكريبت
    echo.
    pause
    exit /b 1
)

echo.
echo تم تثبيت Java بنجاح!
echo.

echo إصدار Java:
java -version

echo.
echo ====================================
echo الخطوات التالية
echo ====================================
echo.
echo 1. إعداد متغير البيئة JAVA_HOME:
echo    - اضغط على زر Windows وابحث عن "Environment Variables"
echo    - اختر "Edit the system environment variables"
echo    - اضغط على "Environment Variables"
echo    - في قسم "System variables"، اضغط على "New"
echo    - Variable name: JAVA_HOME
echo    - Variable value: مسار تثبيت Java (مثال: C:\Program Files\Java\jdk-25)
echo    - اضغط "OK"
echo.
echo 2. تحديث متغير PATH:
echo    - في قسم "System variables"، ابحث عن "Path" واضغط "Edit"
echo    - اضغط "New" وأضف: %%JAVA_HOME%%\bin
echo    - اضغط "OK" على جميع النوافذ
echo.
echo 3. أعد تشغيل سطر الأوامر
echo.
echo 4. تحقق من التثبيت:
echo    java -version
echo    javac -version
echo    echo %%JAVA_HOME%%
echo.
pause
