
@echo off
echo ====================================
echo إنشاء ملف Keystore لتوقيع التطبيق
echo ====================================
echo.

if "%1"=="" (
    set /p KEYSTORE_NAME="أدخل اسم ملف keystore (مثال: my-key.keystore): "
) else (
    set KEYSTORE_NAME=%1
)

if "%2"=="" (
    set /p ALIAS="أدخل الاسم المستعار (alias) (مثال: my-alias): "
) else (
    set ALIAS=%2
)

echo.
echo سيتم إنشاء ملف keystore بالاسم: %KEYSTORE_NAME%
echo مع الاسم المستعار: %ALIAS%
echo.
echo سيتم طلب منك إدخال كلمة مرور ومعلومات أخرى
echo.

keytool -genkey -v -keystore "%KEYSTORE_NAME%" -alias "%ALIAS%" -keyalg RSA -keysize 2048 -validity 10000

if %errorlevel% neq 0 (
    echo خطأ في إنشاء ملف keystore
    pause
    exit /b 1
)

echo.
echo ====================================
echo تم إنشاء ملف keystore بنجاح!
echo الملف: %KEYSTORE_NAME%
echo الاسم المستعار: %ALIAS%
echo ====================================
echo.
echo ملاحظات مهمة:
echo 1. احتفظ بملف keystore في مكان آمن
echo 2. لا تفقد كلمة المرور
echo 3. ستحتاج إلى هذا الملف لتوقيع أي تحديثات مستقبلية للتطبيق
echo.
pause
