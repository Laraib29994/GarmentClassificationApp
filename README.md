# Mobile Garment & Stain Classification System

A mobile application prototype developed for Maxwells Drycleaning using React Native, Expo and TypeScript.

## Requirements

Before running the project, make sure the following are installed:

- [Node.js](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Expo Go](https://expo.dev/go) on an Android or iOS device
- [Git](https://git-scm.com/) (for cloning the repository)

## How to Run the Project

### Step 1: Download the Project

Clone the GitHub repository using the following command:

```bash
git clone https://github.com/Laraib29994/GarmentClassificationApp.git
```

Alternatively, open the [GitHub repository](https://github.com/Laraib29994/GarmentClassificationApp) and select Code -> Download ZIP, then extract the folder.

### Step 2: Open in VS Code

Open the downloaded `GarmentClassificationApp` folder in Visual Studio Code.

Open a terminal using Terminal → New Terminal.

### Step 3: Install Dependencies

Run the following command:

```bash
npm install
```

This installs the required project dependencies.

### Step 4: Start the Application

Run:

```bash
npx expo start
```

A QR code will appear in the terminal.

### Step 5: Run on a Mobile Device

1. Install and open Expo Go on your phone.
2. Connect your phone and computer to the same Wi-Fi network.
3. Scan the QR code displayed in the terminal.
4. Wait for the application to load.

If the connection fails, try:

```bash
npx expo start --tunnel
```

## Running Tests

To run the Jest unit tests, execute:

```bash
npm test
```

## Note

The current application uses mock garment and stain classifications. A machine-learning model has not yet been integrated.
