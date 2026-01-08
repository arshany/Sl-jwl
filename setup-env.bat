
@echo off
echo ====================================
echo إعداد متغيرات البيئة
echo ====================================
echo.

echo هذا السكريبت سيساعدك في إعداد متغيرات البيئة المطلوبة
echo.
echo ملاحظة: هذا السكريبت يعرض التعليمات فقط
echo يجب عليك إعداد المتغيرات يدوياً من إعدادات النظام
echo.
pause

echo.
echo ====================================
echo 1. إعداد JAVA_HOME
echo ====================================
echo.
echo الخطوات:
echo 1. تأكد من تثبيت Java JDK من: https://www.oracle.com/java/technologies/downloads/
echo 2. ابحث عن مسار تثبيت Java (عادة في: C:\Program Files\Java\jdk-17)
echo 3. افتح إعدادات النظام:
echo    - اضغط على زر Windows وابحث عن "Environment Variables"
echo    - اختر "Edit the system environment variables"
echo    - اضغط على "Environment Variables"
echo 4. في قسم "System variables"، اضغط على "New"
echo    - Variable name: JAVA_HOME
echo    - Variable value: مسار تثبيت Java (مثال: C:\Program Files\Java\jdk-17)
echo 5. أضف إلى PATH:
echo    - في قسم "System variables"، ابحث عن "Path" واضغط "Edit"
echo    - اضغط "New" وأضف: %%JAVA_HOME%%\bin
echo 6. أعد تشغيل سطر الأوامر
echo 7. تحقق من التثبيت:
echo    java -version
echo    javac -version
echo    echo %%JAVA_HOME%%
echo.

echo ====================================
echo 2. إعداد ANDROID_HOME
echo ====================================
echo.
echo الخطوات:
echo 1. افتح Android Studio
echo 2. اذهب إلى File ^> Settings ^> Appearance ^& Behavior ^> System Settings ^> Android SDK
echo 3. انسخ مسار Android SDK (عادة في: C:\Users\[username]\AppData\Local\Android\Sdk)
echo 4. افتح إعدادات النظام:
echo    - اضغط على زر Windows وابحث عن "Environment Variables"
echo    - اختر "Edit the system environment variables"
echo    - اضغط على "Environment Variables"
echo 5. في قسم "System variables"، اضغط على "New"
echo    - Variable name: ANDROID_HOME
echo    - Variable value: مسار Android SDK
echo 6. أضف إلى PATH:
echo    - في قسم "System variables"، ابحث عن "Path" واضغط "Edit"
echo    - اضغط "New" وأضف: %%ANDROID_HOME%%\platform-tools
echo    - اضغط "New" وأضف: %%ANDROID_HOME%%\tools
echo 7. أعد تشغيل سطر الأوامر
echo 8. تحقق من التثبيت:
echo    echo %%ANDROID_HOME%%
echo    adb version
echo.

echo ====================================
echo التحقق من التثبيت الحالي
echo ====================================
echo.

echo JAVA_HOME:
echo %JAVA_HOME%
echo.

echo ANDROID_HOME:
echo %ANDROID_HOME%
echo.

echo إصدار Java:
java -version 2>&1
echo.

echo إصدار ADB:
adb version 2>&1
echo.

echo ====================================
echo انتهى
echo ====================================
echo.
echo بعد إعداد المتغيرات، أعد تشغيل سطر الأوامر وشغل:
echo npm run android:release
echo.
pause
