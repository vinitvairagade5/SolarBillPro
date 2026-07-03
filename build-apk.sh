#!/bin/bash
set -e

echo "=== 1. Syncing Web Assets to Android Platform ==="
npx cap sync

echo "=== 2. Compiling Android APK using Docker Android SDK ==="
# Ensure Gradle wrapper is executable
docker run --rm -v "$(pwd):/build" -w /build/android ghcr.io/cirruslabs/android-sdk:35 chmod +x gradlew

# Compile debug APK
docker run --rm -v "$(pwd):/build" -w /build/android ghcr.io/cirruslabs/android-sdk:35 ./gradlew assembleDebug

echo "============================================="
echo "🎉 APK Build Successful!"
echo "Your Android APK is ready at:"
echo "android/app/build/outputs/apk/debug/app-debug.apk"
echo "============================================="
