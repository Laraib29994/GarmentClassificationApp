# Mobile Garment & Stain Classification System

A mobile application prototype developed for **Maxwells Drycleaning** using React Native, Expo and TypeScript.

The application allows users to capture garment and stain images, select a fabric type, and view classification results, cleaning recommendations and estimated dry-cleaning prices.

## Features

- Capture or upload garment and stain images.
- Select the garment's fabric type.
- View garment and stain classification results.
- Receive cleaning recommendations.
- Check whether professional dry-cleaning is recommended.
- View estimated cleaning prices.
- Reset and start a new analysis.

## Option 1: Install the APK (Recommended)

The easiest way to run the application is to install the provided APK file on an **Android device**.

https://github.com/Laraib29994/GarmentClassificationApp/releases/tag/MobileDevelopment

1. Download the APK file provided with the project.
2. Open the downloaded APK file on your Android phone.
3. Allow installation from this source if prompted.
4. Install and open the application.

**Note:** The APK is for Android devices only. No coding software or additional setup is required.

## Option 2: Run the Source Code

### Requirements

- [Node.js](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Expo Go](https://expo.dev/go)
- [Git](https://git-scm.com/) (optional)

### Step 1: Download the Project

Clone the repository:

```bash
git clone https://github.com/Laraib29994/GarmentClassificationApp.git
```

Alternatively, download the ZIP file from the [GitHub repository](https://github.com/Laraib29994/GarmentClassificationApp) and extract it.

### Step 2: Install Dependencies

Open the project folder in Visual Studio Code, open a terminal and run:

```bash
npm install
```

### Step 3: Start the Application

Run:

```bash
npx expo start
```

Scan the QR code using Expo Go on your mobile device.

Ensure your phone and computer are connected to the same Wi-Fi network.

If the connection fails, run:

```bash
npx expo start --tunnel
```

**Note:** Running through Expo Go requires compatible project dependencies. A development build may be necessary for unsupported native modules.

## Running Tests

To run the Jest unit tests:

```bash
npm test
```

## Technologies Used

- React Native
- Expo
- TypeScript
- Expo Router
- React Context API
- Jest

## Current Limitations

The current prototype uses mock garment and stain classification results. A trained machine-learning model has not yet been integrated.

Cleaning recommendations are rule-based, and displayed prices are estimates.

## GitHub Repository

https://github.com/Laraib29994/GarmentClassificationApp
