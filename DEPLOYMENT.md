# Deployment Instructions for New Features

## New Files Created
1. `convex/featureEmails.ts` - Backend mutations and queries for email storage
2. `screens/FeaturesScreen.js` - New screen showing features list and email input

## Modified Files
1. `convex/schema.ts` - Added `featureEmails` table
2. `App.js` - Added Features tab to navigation

## Required Deployment Steps

### 1. Deploy Convex Schema and Functions
After pulling these changes, you must deploy the updated schema and new functions to your Convex backend:

```bash
# Make sure you have .env.local configured with:
# CONVEX_SELF_HOSTED_URL=your_backend_url
# CONVEX_SELF_HOSTED_ADMIN_KEY=your_admin_key
# EXPO_PUBLIC_CONVEX_URL=your_backend_url

# Deploy the schema and functions
npx convex dev --once

# Or for continuous development
npx convex dev
```

### 2. Test the Application
```bash
# Start Expo dev server
npm start

# Then open in your preferred platform:
npm run android  # For Android
npm run ios      # For iOS (macOS only)
npm run web      # For web browser
```

### 3. Verify Functionality
1. Open the app and navigate to the "Fonctionnalités" tab (star icon)
2. Verify the 5 feature cards are displayed
3. Enter an email address in the input field
4. Tap "S'inscrire" to submit
5. Verify success message appears
6. Close and reopen the app - email should persist

## What Was Implemented

### Features List
The screen displays 5 upcoming features:
1. **Feature 1**: Allows Tracking of daily insulin intake
2. **Feature 2**: Provides detailed analytics of insulin usage over time
3. **Feature 3**: Integrates with wearable devices for real-time tracking
4. **Feature 4**: Offers medication and insulin reminders
5. **Feature 5**: Generates easy-to-read summaries for doctors

### Email Collection
- Email input field with validation
- Data is saved to Convex `featureEmails` table
- Includes clientId for user tracking
- Email persists across app sessions
- Updates existing email if user changes it

### UI/UX Features
- Clean card-based design matching existing app style
- French language interface
- Email validation with user-friendly error messages
- Success confirmation on submission
- Keyboard-aware scrolling
- Loading states during submission

## Database Schema
The new `featureEmails` table includes:
- `email` (string): User's email address
- `clientId` (string): Unique identifier for the user
- `timestamp` (number): When the email was saved/updated
- Indexes: `by_email` and `by_client` for efficient queries
