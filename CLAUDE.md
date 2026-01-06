# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mobile insulin calculator app built with React Native Expo and Convex backend for data persistence.

**Purpose**: Calculate insulin bolus doses based on:
- Carbohydrates (grams)
- Meal coefficient (insulin units per 10g carbs)
- Current blood glucose (mg/dL)
- Target blood glucose (mg/dL)
- Insulin sensitivity (mg/dL per unit)
- Time since last injection and units administered

**Output**: Meal bolus, correction bolus, and total bolus recommendation.

## Development Commands

```bash
npm start          # Start Expo dev server
npm run android    # Start on Android emulator
npm run ios        # Start on iOS simulator (macOS only)
npm run web        # Start in web browser
npx convex dev     # Start Convex dev server (run alongside expo)
```

## Architecture

### Frontend (Expo/React Native)
- Entry point: `App.js`
- Config: `app.json` (Expo configuration)

### Backend (Convex)
- Convex stores calculation results with timestamp and client ID
- Client ID generated and stored in AsyncStorage/localStorage for user identification across sessions

### Data Flow
1. User inputs meal/glucose data in form fields
2. Calculate button triggers bolus computation
3. Results displayed and persisted to Convex with client ID and timestamp
4. Historical results retrievable by client ID

## Key Dependencies

- `expo`: ~54.0.30
- `react`: 19.1.0
- `react-native`: 0.81.5
- Convex (to be added for backend)
