#!/bin/bash

# Chuchi Love App - Quick Build Script
# This script builds the APK for your love app

echo "🏗️  Building Chuchi Love App..."
echo "================================"

# Check if we're in the right directory
if [ ! -f "settings.gradle" ]; then
    echo "❌ Error: Please run this script from the android-app directory"
    echo "Usage: cd android-app && ./build.sh"
    exit 1
fi

# Check if gradlew is executable
if [ ! -x "./gradlew" ]; then
    echo "🔧 Making gradlew executable..."
    chmod +x ./gradlew
fi

echo "📦 Building debug APK..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful! 🎉"
    echo ""
    echo "📱 Your APK is ready at:"
    echo "   app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Copy the APK to your Android device"
    echo "   2. Enable 'Install unknown apps' in settings"
    echo "   3. Tap the APK file to install"
    echo ""
    echo "💕 Your love app is ready to install!"
else
    echo ""
    echo "❌ Build failed. Please check the error messages above."
    echo ""
    echo "🔧 Common fixes:"
    echo "   - Make sure Android SDK is installed"
    echo "   - Check Java version (requires Java 8+)"
    echo "   - Update your Vercel URL in MainActivity.kt"
fi