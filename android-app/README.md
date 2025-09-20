# Chuchi Love App 💕

A simple Android WebView wrapper for your beautiful love app hosted on Vercel.

## 🎯 What This Does

This Android app is a native wrapper around your Next.js love app that:
- Displays your Vercel-hosted website in a native Android WebView
- Automatically reflects any changes you push to GitHub → Vercel
- Can be sideloaded as an APK on any Android device
- Provides a native app experience while keeping your web development workflow

## 📱 Features

- **Full WebView Integration**: Complete access to your photos, videos, and music
- **Native Feel**: App icon, splash screen, and Android navigation
- **Auto-Updates**: Any changes to your Vercel site appear instantly
- **Offline-Ready**: Basic caching for better performance
- **Pull-to-Refresh**: Swipe down to refresh content
- **Media Support**: Full support for images, videos, and audio playback
- **Responsive**: Maintains your mobile-friendly design

## 🛠️ Setup Instructions

### Prerequisites
- Android Studio installed on your computer
- Java 8+ installed
- Your Vercel app URL

### Step 1: Update Your Vercel URL
1. Open `app/src/main/java/com/chuchi/loveapp/MainActivity.kt`
2. Replace `"https://your-app-name.vercel.app"` with your actual Vercel URL
3. Save the file

### Step 2: Build the APK

#### Option A: Using Android Studio (Recommended)
1. Open Android Studio
2. Click "Open an existing project"
3. Navigate to and select the `android-app` folder
4. Wait for Gradle sync to complete
5. Go to `Build > Build Bundle(s) / APK(s) > Build APK(s)`
6. Once built, click "Show in Finder/Explorer" to locate the APK

#### Option B: Using Command Line
```bash
cd android-app
./gradlew assembleDebug
```
The APK will be created at: `app/build/outputs/apk/debug/app-debug.apk`

### Step 3: Install on Android Device

#### Enable Developer Options:
1. Go to Settings > About Phone
2. Tap "Build Number" 7 times
3. Go back to Settings > Developer Options
4. Enable "USB Debugging" and "Install unknown apps"

#### Install via USB:
1. Connect your Android device to computer
2. Copy the APK to your device
3. On your device, navigate to the APK file
4. Tap to install (you may need to allow installation from unknown sources)

#### Install via File Transfer:
1. Copy the APK file to your device (via USB, cloud storage, etc.)
2. Use a file manager app to locate and tap the APK
3. Follow installation prompts

## 🔧 Customization

### Change App Name
Edit `app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Your App Name ❤️</string>
```

### Change Colors
Edit `app/src/main/res/values/colors.xml` to match your brand colors.

### Add Custom App Icon
Replace the default icons in:
- `app/src/main/res/mipmap-hdpi/ic_launcher.png`
- `app/src/main/res/mipmap-mdpi/ic_launcher.png`
- `app/src/main/res/mipmap-xhdpi/ic_launcher.png`
- `app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
- `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

## 🚀 Development Workflow

1. **Make changes** to your Next.js app
2. **Push to GitHub** - your changes deploy automatically to Vercel
3. **Open the Android app** - pull down to refresh and see your changes instantly!
4. **No need to rebuild** the APK unless you modify the native wrapper

## 🔍 Troubleshooting

### App shows blank/white screen
- Check your Vercel URL is correct and accessible
- Ensure your website loads properly in a mobile browser
- Check Android device has internet connection

### Videos/Audio not playing
- Ensure your media files are properly hosted on Vercel
- Check WebView settings in MainActivity.kt
- Verify media permissions in AndroidManifest.xml

### App not installing
- Enable "Install unknown apps" for your file manager
- Check if device has enough storage space
- Try installing via ADB: `adb install app-debug.apk`

## 📁 Project Structure

```
android-app/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml          # App permissions & config
│   │   ├── java/com/chuchi/loveapp/
│   │   │   └── MainActivity.kt          # Main WebView logic
│   │   └── res/
│   │       ├── layout/
│   │       │   └── activity_main.xml    # UI layout
│   │       ├── values/
│   │       │   ├── colors.xml           # App colors
│   │       │   ├── strings.xml          # App name & text
│   │       │   └── themes.xml           # App theme
│   │       └── mipmap-*/               # App icons
│   └── build.gradle                     # App dependencies
├── build.gradle                         # Project config
└── settings.gradle                      # Project settings
```

## 💡 Tips

- **Test first**: Always test your Vercel site on mobile browsers before building the APK
- **Network handling**: The app gracefully handles network errors and provides refresh options
- **Performance**: WebView caching is enabled for faster loading
- **Updates**: Your content updates automatically - only rebuild APK for native changes

## 🎉 You're Done!

Your love app is now available as a native Android app! Every time you update your website, the changes will appear instantly in the app. Perfect for keeping your memories always up-to-date! 💕

---

*Built with ❤️ for Chuchi*