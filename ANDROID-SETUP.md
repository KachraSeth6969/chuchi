# Installation Guide for Your Chuchi Love App 💕

## 📲 Quick Installation Steps

### 1. **Update Your Vercel URL**
Before building, you MUST update the website URL:

1. Open: `android-app/app/src/main/java/com/chuchi/loveapp/MainActivity.kt`
2. Find line: `private val websiteUrl = "https://your-app-name.vercel.app"`
3. Replace with your actual Vercel URL (e.g., `"https://chuchi-memories.vercel.app"`)
4. Save the file

### 2. **Build the APK**

#### Option A: One-Click Build (macOS/Linux)
```bash
cd android-app
./build.sh
```

#### Option B: Manual Build
```bash
cd android-app
./gradlew assembleDebug
```

#### Option C: Android Studio
1. Open Android Studio
2. Open the `android-app` folder
3. Build > Build Bundle(s) / APK(s) > Build APK(s)

### 3. **Install on Android Device**

#### Step 3a: Enable Installation
On your Android device:
1. **Settings** > **About Phone**
2. Tap **Build Number** 7 times (enables Developer Options)
3. **Settings** > **Security** > **Install unknown apps**
4. Enable for your file manager or browser

#### Step 3b: Transfer & Install
1. Copy `app/build/outputs/apk/debug/app-debug.apk` to your device
2. Tap the APK file on your device
3. Follow installation prompts
4. Done! The app is now installed 🎉

---

## 🔧 Customization Options

### Change App Name
Edit `app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">My Love App ❤️</string>
```

### Change App Colors
Edit `app/src/main/res/values/colors.xml` to match your theme.

### Add Custom Icon
Replace icon files in `app/src/main/res/mipmap-*` folders with your custom icons.

---

## ✨ The Magic

Once installed:
- **Any changes** you make to your Next.js app
- **Push to GitHub** → automatically deploys to Vercel
- **Open the Android app** → pull down to refresh
- **See your changes instantly!** 🚀

No need to rebuild the APK unless you change the native wrapper code.

---

## 🆘 Troubleshooting

### Blank Screen?
- Check your Vercel URL is correct and accessible
- Test the URL in your phone's browser first

### Build Errors?
- Ensure you have Android SDK installed
- Java 8+ required
- Run `./gradlew clean` then try building again

### Can't Install?
- Enable "Install unknown apps" for your file manager
- Check device storage space
- Try connecting via USB and using `adb install app-debug.apk`

---

**Perfect for**: Keeping your love memories always in your pocket! 💕