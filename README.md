# UniLab

UniLab is an Expo and React Native kiosk-oriented application built for large-screen use in landscape mode. The project includes:

- a ticket-request flow for service selection
- Android kiosk support through a custom native `lock-task` module
- Expo Router based navigation
- local Android builds through Gradle
- cloud Android builds through EAS

This README is intended to be a complete onboarding and build guide for macOS, Linux, and Windows.

## Table of Contents

- [Project Summary](#project-summary)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Platform Support](#platform-support)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Quick Start](#quick-start)
- [Development Workflows](#development-workflows)
- [macOS Setup](#macos-setup)
- [Linux Setup](#linux-setup)
- [Windows Setup](#windows-setup)
- [Run the Project](#run-the-project)
- [Local Android Builds](#local-android-builds)
- [iOS Builds](#ios-builds)
- [Web Build](#web-build)
- [EAS Cloud Builds](#eas-cloud-builds)
- [Kiosk Mode and Device Owner Setup](#kiosk-mode-and-device-owner-setup)
- [Quality Checks](#quality-checks)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)

## Project Summary

This repository is configured as an Expo app with native Android support enabled through prebuild output in the `android/` directory.

The application is primarily designed for Android kiosk deployments. A custom local module named `lock-task` exposes Android Lock Task Mode. On iOS and web, that native module is not available, and the code intentionally falls back without crashing. That means the app can still run outside Android, but kiosk locking behavior is Android-only.

## Tech Stack

- Expo SDK 54
- React 19
- React Native 0.81
- TypeScript
- Expo Router
- Expo Secure Store
- Expo Navigation Bar
- Custom Expo module: `modules/lock-task`
- EAS Build for Android preview and production profiles

## Repository Structure

Key directories:

- `app/`: Expo Router entry points and route layout files
- `features/`: feature-based application code
- `components/`: shared UI components
- `context/`: application-wide React context providers
- `modules/lock-task/`: custom Android native module for kiosk mode
- `plugins/`: Expo config plugin that injects Android Device Admin configuration
- `android/`: generated and tracked Android native project
- `assets/`: icons, images, and splash assets

## Platform Support

| Target | Status | Notes |
| --- | --- | --- |
| Android | Fully supported | Primary target platform. Kiosk mode is implemented here. |
| iOS | Partially supported | App can run, but Android kiosk features are not available. |
| Web | Partially supported | Basic Expo web support exists, but kiosk-specific behavior does not. |
| macOS host | Supported for development | Android, web, and iOS simulator workflows are available. |
| Linux host | Supported for development | Android and web workflows are supported. iOS builds are not local. |
| Windows host | Supported for development | Android and web workflows are supported. iOS builds are not local. |

## Prerequisites

Recommended versions:

- Node.js 20 LTS
- npm 10+
- Java 17
- Android Studio with Android SDK installed
- Git

Optional but recommended:

- `adb` available on your shell `PATH`
- Expo CLI through `npx`
- EAS CLI for cloud builds

Check your versions:

```bash
node -v
npm -v
java -version
adb version
```

Install EAS CLI if you plan to create cloud builds:

```bash
npm install -g eas-cli
```

## Environment Variables

This project uses Expo public environment variables. Start from `.env.example` and create a local `.env` file.

Important: `.env` must never be committed.

Create it with:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Available variables:

| Variable | Required | Description |
| --- | --- | --- |
| `EXPO_PUBLIC_API_BASE_URL` | Usually yes | Base URL for the backend API, for example `http://server:8000` or `http://server:8000/api`. |
| `EXPO_PUBLIC_API_TICKETS_PATH` | No | Ticket endpoint path. Default is `/api/tickets`. |
| `EXPO_PUBLIC_API_KEY` | Optional | API key sent as `X-API-KEY` in the ticket request. |
| `EXPO_PUBLIC_API_TIMEOUT_MS` | No | Request timeout in milliseconds. Defaults to `10000` in code if missing or invalid. |
| `EXPO_PUBLIC_TICKET_API_URL` | Optional | Full explicit ticket endpoint URL. When set, it overrides base URL plus path composition. |

Behavior notes:

- If `EXPO_PUBLIC_TICKET_API_URL` is set, it is used directly.
- If it is not set, the app builds the endpoint from `EXPO_PUBLIC_API_BASE_URL` and `EXPO_PUBLIC_API_TICKETS_PATH`.
- The ticket request sends only `{ "service_type": "<nome do atendimento>" }` in the JSON body and includes `X-API-KEY` when `EXPO_PUBLIC_API_KEY` is configured.
- If no API base URL is configured, the app falls back to a simulated success response for the ticket request flow.

## Quick Start

1. Clone the repository.
2. Install dependencies.
3. Create `.env` from `.env.example`.
4. Start the Expo development server.
5. Run on Android, iOS simulator, or web depending on your machine.

Commands:

```bash
git clone <your-repository-url>
cd m-unilab
npm install
cp .env.example .env
npx expo start
```

## Development Workflows

Available npm scripts:

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
npm run reset-project
```

What each script does:

- `npm run start`: starts the Expo development server
- `npm run android`: runs `expo run:android`
- `npm run ios`: runs `expo run:ios`
- `npm run web`: starts the web target
- `npm run lint`: runs Expo ESLint configuration
- `npm run reset-project`: resets the sample structure generated by Expo

## macOS Setup

macOS is the best local development environment for this repository because it supports Android, web, and iOS simulator workflows.

### 1. Install Homebrew

If you do not already have Homebrew:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js and Watchman

```bash
brew install node watchman
```

### 3. Install Java 17

```bash
brew install --cask temurin@17
```

If needed, set `JAVA_HOME`:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
```

Persist those lines in your shell profile such as `~/.zshrc`.

### 4. Install Android Studio

Install Android Studio and then install:

- Android SDK Platform
- Android SDK Command-line Tools
- Android SDK Build-Tools
- Android Emulator
- one emulator image, preferably a recent Google APIs image

### 5. Configure Android SDK variables

Add the following to `~/.zshrc` or `~/.bashrc`:

```bash
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
export PATH="$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/emulator:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH"
```

Reload your shell:

```bash
source ~/.zshrc
```

### 6. Install CocoaPods for iOS work

If you want local iOS simulator builds:

```bash
sudo gem install cocoapods
```

## Linux Setup

Linux supports Android and web development well, but local iOS builds are not available.

The exact package manager varies by distribution. The commands below show Ubuntu or Debian examples.

### 1. Install required packages

```bash
sudo apt update
sudo apt install -y curl git unzip zip openjdk-17-jdk
```

Install Node.js 20 using NodeSource or your preferred version manager.

Example with NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Install Android Studio

Download Android Studio from the official Android developer site or install through your distribution package system if available.

Install these SDK components inside Android Studio:

- Android SDK Platform
- Android SDK Build-Tools
- Android SDK Command-line Tools
- Android Emulator

### 3. Configure environment variables

Add this to `~/.bashrc` or `~/.zshrc`:

```bash
export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
export PATH="$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/emulator:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH"
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
```

Reload your shell:

```bash
source ~/.bashrc
```

### 4. KVM acceleration for emulator

For acceptable emulator performance on Linux, enable KVM virtualization and ensure your user has the correct permissions.

## Windows Setup

Windows supports Android and web development. Local iOS builds are not available.

PowerShell is recommended for the commands below.

### 1. Install Node.js

Install Node.js 20 LTS from the official Node.js website.

Verify:

```powershell
node -v
npm -v
```

### 2. Install Java 17

Install Temurin 17 or another JDK 17 distribution.

Verify:

```powershell
java -version
```

### 3. Install Android Studio

Install Android Studio and the following SDK components:

- Android SDK Platform
- Android SDK Build-Tools
- Android SDK Command-line Tools
- Android Emulator

### 4. Configure environment variables

Set these variables in the Windows Environment Variables UI:

- `ANDROID_SDK_ROOT` = `%LOCALAPPDATA%\\Android\\Sdk`
- add `%ANDROID_SDK_ROOT%\\platform-tools`
- add `%ANDROID_SDK_ROOT%\\emulator`
- add `%ANDROID_SDK_ROOT%\\cmdline-tools\\latest\\bin`

If Java is not already on `PATH`, add the JDK 17 `bin` directory too.

### 5. Recommended shell policy note

If PowerShell blocks local scripts, you may need:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## Run the Project

### Install dependencies

Use npm because the repository is already locked with `package-lock.json`.

```bash
npm install
```

For CI or deterministic installs:

```bash
npm ci
```

### Start Expo

```bash
npx expo start
```

Useful variants:

```bash
npx expo start --clear
npx expo start --web
```

### Run on Android

If you have an emulator open or a device connected:

```bash
npm run android
```

You can also use:

```bash
npx expo run:android
```

### Run on iOS simulator

Only available locally on macOS:

```bash
npm run ios
```

### Run on web

```bash
npm run web
```

## Local Android Builds

The repository already contains the `android/` project, so you can build using Gradle directly.

### Debug APK

macOS and Linux:

```bash
cd android
./gradlew assembleDebug
```

Windows:

```powershell
cd android
.\\gradlew.bat assembleDebug
```

Output usually ends up under:

- `android/app/build/outputs/apk/debug/`

### Release APK

macOS and Linux:

```bash
cd android
./gradlew assembleRelease
```

Windows:

```powershell
cd android
.\\gradlew.bat assembleRelease
```

### Release App Bundle

macOS and Linux:

```bash
cd android
./gradlew bundleRelease
```

Windows:

```powershell
cd android
.\\gradlew.bat bundleRelease
```

Output usually ends up under:

- `android/app/build/outputs/apk/release/`
- `android/app/build/outputs/bundle/release/`

### Important signing note

The current `android/app/build.gradle` is configured to sign both debug and release builds with the debug keystore:

```gradle
release {
    signingConfig signingConfigs.debug
}
```

That is acceptable for local testing only.

Before shipping a production APK or AAB, replace the release signing configuration with a real keystore and secure credentials.

## iOS Builds

### Local iOS builds

Local iOS builds require:

- macOS
- Xcode
- CocoaPods

Then run:

```bash
npm install
npx expo run:ios
```

### Functional limitation on iOS

The app can run on iOS, but the custom `lock-task` module has no iOS native implementation. Kiosk locking behavior is therefore unavailable on iOS.

### Cloud iOS builds

There is currently no iOS profile in `eas.json`. If you need iOS cloud builds later, add an iOS EAS build profile and validate the app behavior without Android kiosk features.

## Web Build

Run local web development:

```bash
npm run web
```

Create a static export:

```bash
npx expo export --platform web
```

The project is configured with:

- `web.output = "static"`

## EAS Cloud Builds

This repository already contains `eas.json` with two Android profiles:

- `preview`: builds an APK
- `production`: builds an Android App Bundle

### Login

```bash
eas login
```

### Preview build

```bash
eas build --platform android --profile preview
```

### Production build

```bash
eas build --platform android --profile production
```

### EAS requirements

- valid Expo account
- project linked to EAS
- Android credentials configured in Expo

This project already contains an EAS project ID in `app.json`.

## Kiosk Mode and Device Owner Setup

The custom Android module exposes two functions:

- `startLockTask()`
- `stopLockTask()`

The repository also includes an Expo config plugin that injects a `DeviceAdminReceiver` into the Android manifest and writes `res/xml/device_admin.xml` during Android prebuild.

### Important limitation

Android Lock Task Mode works best when the app is configured as device owner on a dedicated device.

### Device owner setup command

For test devices prepared for kiosk usage, the native receiver documents this command:

```bash
adb shell dpm set-device-owner com.screenblocker/expo.modules.locktask.KioskAdminReceiver
```

Important notes:

- this usually requires a freshly provisioned device
- it should be done only on dedicated test or deployment hardware
- behavior varies by Android version and OEM restrictions

### Verify ADB connection

```bash
adb devices
```

## Quality Checks

Run lint:

```bash
npm run lint
```

If you want to verify native Android compilation locally:

macOS and Linux:

```bash
cd android
./gradlew assembleDebug
```

Windows:

```powershell
cd android
.\\gradlew.bat assembleDebug
```

## Troubleshooting

### `adb` not found

Your Android SDK `platform-tools` directory is not on `PATH`.

### `JAVA_HOME` issues

Make sure Java 17 is installed and the correct JDK is being used.

### Gradle build fails after dependency changes

Try:

```bash
cd android
./gradlew clean
```

On Windows:

```powershell
cd android
.\\gradlew.bat clean
```

Then rebuild.

### Metro cache problems

```bash
npx expo start --clear
```

### Android emulator is not detected

- start the emulator from Android Studio first
- verify with `adb devices`
- then rerun `npm run android`

### iOS build fails on non-macOS hosts

That is expected. Local iOS compilation requires macOS.

## Security Notes

- Never commit `.env`.
- Use `.env.example` as the public template.
- Rotate API keys immediately if a real secret is ever committed.
- Do not ship release builds signed with the debug keystore.
