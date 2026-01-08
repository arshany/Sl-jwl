
@echo off
echo ====================================
echo التحقق من إعداد البيئة
echo ====================================
echo.

echo 1. التحقق من JAVA_HOME:
echo.
if defined JAVA_HOME (
    echo JAVA_HOME: %JAVA_HOME%
    echo.
    echo إصدار Java:
    java -version 2>&1 | findstr /i "version"
    echo.
    echo إصدار javac:
    javac -version 2>&1
) else (
    echo JAVA_HOME: غير معين
    echo.
    echo يرجى تشغيل set-java-home.bat كمسؤول
)
echo.

echo 2. التحقق من ANDROID_HOME:
echo.
if defined ANDROID_HOME (
    echo ANDROID_HOME: %ANDROID_HOME%
    echo.
    echo إصدار ADB:
    adb version 2>&1 | findstr /i "version"
) else (
    echo ANDROID_HOME: غير معين
    echo.
    echo يرجى إعداد متغير البيئة ANDROID_HOME
)
echo.

echo 3. التحقق من Node.js:
echo.
node -version 2>nul
if %errorlevel% neq 0 (
    echo Node.js: غير مثبت
) else (
    echo Node.js:
    node -version
    echo.
    echo npm:
    npm -version
)
echo.

echo ====================================
echo ملخص
echo ====================================
echo.

if defined JAVA_HOME (
    echo [✓] JAVA_HOME معين
) else (
    echo [✗] JAVA_HOME غير معين
)

if defined ANDROID_HOME (
    echo [✓] ANDROID_HOME معين
) else (
    echo [✗] ANDROID_HOME غير معين
)

node -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [✗] Node.js غير مثبت
) else (
    echo [✓] Node.js مثبت
)

echo.
echo ====================================
echo.

if defined JAVA_HOME if defined ANDROID_HOME (
    echo البيئة جاهزة لبناء تطبيق أندرويد!
    echo يمكنك تشغيل: npm run android:release
) else (
    echo يرجى إكمال إعداد البيئة أولاً
)

echo.
pause
