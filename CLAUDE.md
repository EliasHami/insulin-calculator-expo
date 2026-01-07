# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mobile insulin calculator app built with React Native Expo and Convex backend for data persistence.

**Purpose**: Calculate insulin bolus doses based on:
- Carbohydrates (grams)
- Meal coefficient (insulin units per 10g carbs)
- Current blood glucose (mg/dL)
- Target blood glucose (mg/dL)
- Insulin sensitivity (g/L per unit)
- Time since last injection and units administered

**Output**: Meal bolus, correction bolus (with IOB adjustment), and total bolus recommendation.

## Development Commands

```bash
npm start          # Start Expo dev server
npm run android    # Start on Android emulator
npm run ios        # Start on iOS simulator (macOS only)
npm run web        # Start in web browser
npx convex dev     # Start Convex dev server (run alongside Expo)
```

## Architecture

### Frontend (Expo/React Native)
- Entry point: `App.js` - Main calculator component with form inputs and results display
- Config: `app.json` (Expo configuration)
- Styling: Inline StyleSheet with card-based sections

### Backend (Convex Self-Hosted)
- `convex/schema.ts` - Database schema defining `calculations` table
- `convex/calculations.ts` - Mutations and queries (save, getByClient)
- Self-hosted on Coolify: `http://backend-sg80owk4ss8soow8w48ck0o8.72.61.194.79.sslip.io`

### Data Flow
1. User inputs meal/glucose data in form fields
2. Calculate button triggers bolus computation:
   - Meal bolus = (carbs / 10) × meal coefficient
   - Correction bolus = (current glucose - target) / 100 / sensitivity (converts mg/dL to g/L)
   - IOB = remaining insulin from last injection (4h linear decay)
   - Total = meal + correction - IOB
3. Results displayed and persisted to Convex with client ID and timestamp
4. Client ID stored in AsyncStorage for user identification across sessions

## Key Dependencies

- `expo`: ~54.0.30
- `react`: 19.1.0
- `react-native`: 0.81.5
- `convex`: Backend and real-time sync
- `@react-native-async-storage/async-storage`: Client ID persistence

## Environment Variables

Copy `.env.example` to `.env.local` and set:
- `CONVEX_SELF_HOSTED_URL`: Self-hosted Convex backend URL
- `CONVEX_SELF_HOSTED_ADMIN_KEY`: Admin key generated on the server
- `EXPO_PUBLIC_CONVEX_URL`: Same as `CONVEX_SELF_HOSTED_URL` (used by Expo app)

## Deploying Convex Functions

To deploy schema and functions to the self-hosted Convex backend:

```bash
# One-time deployment
npx convex dev --once

# Or watch mode for development
npx convex dev
```

Requirements:
- `CONVEX_SELF_HOSTED_URL` and `CONVEX_SELF_HOSTED_ADMIN_KEY` must be set in `.env.local`
- Admin key is generated on the server with: `docker compose exec backend ./generate_admin_key.sh`