# Features Screen UI Description

## Visual Layout

### Screen Header
```
┌─────────────────────────────────────┐
│                                     │
│     Fonctionnalités à Venir        │
│  (Upcoming Features - title text)   │
│                                     │
│  Découvrez les nouvelles            │
│  fonctionnalités qui seront         │
│  bientôt disponibles                │
│  (subtitle text)                    │
│                                     │
└─────────────────────────────────────┘
```

### Features List Section
```
┌─────────────────────────────────────┐
│ ✨ Feature 1: Tracking Daily        │
│    Insulin Intake                   │
│                                     │
│    Allows Tracking of daily         │
│    insulin intake.                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ✨ Feature 2: Detailed Analytics    │
│                                     │
│    Provides detailed analytics      │
│    of insulin usage over time.      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ✨ Feature 3: Wearable Integration  │
│                                     │
│    Integrates with wearable         │
│    devices for real-time tracking.  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ✨ Feature 4: Medication Reminders  │
│                                     │
│    Offers medication and insulin    │
│    reminders.                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ✨ Feature 5: Doctor Summaries      │
│                                     │
│    Generates easy-to-read           │
│    summaries for doctors.           │
└─────────────────────────────────────┘
```

### Email Subscription Section
```
┌─────────────────────────────────────┐
│                                     │
│  Restez informé des nouvelles       │
│  fonctionnalités                    │
│  (Stay informed about new features) │
│                                     │
│  Entrez votre adresse email pour    │
│  recevoir des mises à jour          │
│  (Enter your email to receive       │
│  updates)                           │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ votre@email.com               │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │        S'inscrire             │ │
│  │        (Subscribe)            │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### Bottom Tab Navigation
```
┌─────────────────────────────────────┐
│  🔢      ⭐      🔧                  │
│  Calc   Fonc    Param               │
└─────────────────────────────────────┘
```

## Color Scheme
- **Background**: Light gray (#f5f5f5)
- **Cards**: White (#fff) with subtle shadow
- **Primary Color**: Green (#4CAF50) for buttons and active states
- **Text**: Dark gray (#333) for titles, medium gray (#666) for descriptions
- **Icon**: Gold star (✨) for features

## Typography
- **Title**: 28px, bold, centered
- **Subtitle**: 14px, regular, centered
- **Feature Title**: 16px, semi-bold
- **Feature Description**: 14px, regular
- **Email Section Title**: 18px, semi-bold, centered

## Interactions

### Email Input
- Tap to focus and show keyboard
- Placeholder: "votre@email.com"
- Auto-lowercase for email input
- Keyboard type: email-address

### Submit Button
- Default state: Green background with white text
- Disabled state: Gray background (when submitting)
- Text changes to "Enregistrement..." while submitting
- Tap triggers validation and save

### Validation Messages
- Empty email: "Veuillez entrer une adresse email"
- Invalid format: "Veuillez entrer une adresse email valide"
- Success: "Votre adresse email a été enregistrée avec succès!"
- Error: "Une erreur est survenue lors de l'enregistrement de votre email"

## Behavior

1. **On Load**:
   - Shows loading text if data not ready
   - Queries existing email for the client
   - Auto-fills email input if email exists

2. **On Email Change**:
   - Updates local state
   - No validation until submit

3. **On Submit**:
   - Validates email is not empty
   - Validates email format
   - Checks clientId exists
   - Disables button and shows "Enregistrement..."
   - Saves to Convex backend
   - Shows success/error alert
   - Re-enables button

4. **Keyboard Handling**:
   - ScrollView allows scrolling when keyboard is visible
   - KeyboardAvoidingView adjusts layout on iOS
   - Tap outside to dismiss keyboard

## Accessibility
- All text is selectable
- Touch targets are minimum 44x44 points
- Clear visual feedback for interactions
- Descriptive labels for screen readers
