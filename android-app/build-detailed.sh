#!/bin/bash

# Comprehensive Build Script for Chuchi Love App
echo "🏗️  Building Chuchi Love App..."
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "settings.gradle" ]; then
    echo "❌ Error: Please run this script from the android-app directory"
    echo "Usage: cd android-app && ./build-detailed.sh"
    exit 1
fi

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ] && [ ! -d "$HOME/Library/Android/sdk" ] && [ ! -d "/Applications/Android Studio.app" ]; then
    echo "⚠️  Android SDK not found. Please install Android Studio first:"
    echo "   https://developer.android.com/studio"
    echo ""
    echo "🎯 Recommended: Use Android Studio to build instead:"
    echo "   1. Open Android Studio"
    echo "   2. Open this project folder"
    echo "   3. Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Set ANDROID_HOME if not set
if [ -z "$ANDROID_HOME" ]; then
    if [ -d "$HOME/Library/Android/sdk" ]; then
        export ANDROID_HOME="$HOME/Library/Android/sdk"
        echo "📱 Using Android SDK at: $ANDROID_HOME"
    fi
fi

# Check if gradlew is executable
if [ ! -x "./gradlew" ]; then
    echo "🔧 Making gradlew executable..."
    chmod +x ./gradlew
fi

# Check for gradle wrapper jar
if [ ! -f "gradle/wrapper/gradle-wrapper.jar" ]; then
    echo "📦 Downloading Gradle wrapper..."
    curl -L https://github.com/gradle/gradle/raw/v8.2.0/gradle/wrapper/gradle-wrapper.jar -o gradle/wrapper/gradle-wrapper.jar
    if [ $? -ne 0 ]; then
        echo "❌ Failed to download Gradle wrapper"
        echo "🎯 Please use Android Studio instead"
        exit 1
    fi
fi

echo "🔨 Starting build process..."
echo "This may take 2-5 minutes on first build..."
echo ""

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Build the APK
echo "📦 Building debug APK..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful! 🎉"
    echo "================================"
    echo ""
    echo "📱 Your APK is ready at:"
    echo "   $(pwd)/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "📁 Opening build folder..."
    open app/build/outputs/apk/debug/
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Copy app-debug.apk to your Android device"
    echo "   2. Enable 'Install unknown apps' in Android settings"
    echo "   3. Tap the APK file to install"
    echo "   4. Look for 'Chuchi ❤️' in your app drawer"
    echo ""
    echo "💕 Your love app is ready to install!"
    echo ""
    echo "🔄 To update the app content:"
    echo "   → Just update your website at chuchii.vercel.app"
    echo "   → Pull down in the app to refresh"
    echo "   → No need to rebuild the APK!"
else
    echo ""
    echo "❌ Build failed!"
    echo "================================"
    echo ""
    echo "🔧 Try these solutions:"
    echo ""
    echo "1. 🎯 Use Android Studio (Recommended):"
    echo "   → Download: https://developer.android.com/studio"
    echo "   → Open this project folder in Android Studio"
    echo "   → Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo ""
    echo "2. 🛠️ Check your setup:"
    echo "   → Ensure Java 8+ is installed"
    echo "   → Install Android Studio for SDK"
    echo "   → Check internet connection"
    echo ""
    echo "3. 📞 Common issues:"
    echo "   → 'Command not found' → Install Android Studio"
    echo "   → 'Permission denied' → Run: chmod +x ./gradlew"
    echo "   → 'SDK not found' → Set ANDROID_HOME or use Android Studio"
    echo ""
    exit 1
fi