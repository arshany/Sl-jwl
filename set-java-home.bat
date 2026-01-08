
@echo off
echo ====================================
echo إعداد متغير البيئة JAVA_HOME
echo ====================================
echo.

setx JAVA_HOME "C:\Program Files\Java\jdk-25" /M

if %errorlevel% neq 0 (
    echo.
    echo خطأ: لم يتمكن من إعداد متغير البيئة
    echo يرجى تشغيل هذا السكريبت كمسؤول (Run as Administrator)
    echo.
    pause
    exit /b 1
)

echo.
echo تم إعداد متغير البيئة JAVA_HOME بنجاح!
echo.
echo القيمة: C:\Program Files\Java\jdk-25
echo.

echo ====================================
echo ملاحظة مهمة
echo ====================================
echo.
echo 1. أغلق جميع نوافذ سطر الأوامر المفتوحة
echo 2. افتح سطر أوامر جديد
echo 3. تحقق من التثبيت:
echo    java -version
echo    javac -version
echo    echo %%JAVA_HOME%%
echo.

pause
