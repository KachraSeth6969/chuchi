#!/bin/bash
# Test script for Chuchi Android app

echo "🔧 Testing Chuchi Android App"
echo "==============================="

# Check if emulator is connected
echo "📱 Checking emulator connection..."
adb devices

echo ""
echo "🚀 Installing test version..."
adb install -r app/build/outputs/apk/debug/app-debug.apk

echo ""
echo "🎯 Launching app..."
adb shell am start -n com.chuchi.loveapp/.MainActivity

echo ""
echo "✅ Chuchi app launched!"
echo ""
echo "What you should see:"
echo "1. Your Chuchi website loading with the password screen"
echo "2. If connection fails, you'll see an error page with retry options"
echo ""
echo "How to test:"
echo "1. If you see the password screen - enter 'supernova' to unlock"
echo "2. If you see an error page - click 'Test Internet' then 'Try Again'"
echo "3. Pull down to refresh if the page seems stuck"
echo ""
echo "Expected behavior:"
echo "✓ Password screen loads properly"
echo "✓ After entering password, you see the main app"
echo "✓ Background/tab switching logs you out (requires password again)"
echo "✓ Same experience as the web version at https://chuchii.vercel.app"