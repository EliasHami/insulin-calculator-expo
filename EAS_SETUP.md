# EAS Update Setup for PR Previews

This guide explains how to configure EAS (Expo Application Services) to enable automatic PR preview builds.

## Prerequisites

1. An Expo account (create one at [expo.dev](https://expo.dev))
2. The EAS CLI installed globally: `npm install -g eas-cli`

## Initial Setup

### 1. Login to EAS

```bash
eas login
```

### 2. Configure your project

```bash
eas init
```

This command will:
- Create an EAS project linked to your Expo account
- Generate a unique project ID
- Update your `app.json` with the project ID

### 3. Update app.json

After running `eas init`, your `app.json` should have the `extra.eas.projectId` field populated. The workflow file currently has placeholder values that need to be replaced with your actual project ID.

### 4. Create an Expo Access Token

1. Go to [expo.dev/accounts/[your-username]/settings/access-tokens](https://expo.dev/accounts/[your-username]/settings/access-tokens)
2. Click "Create Token"
3. Name it something like "GitHub Actions"
4. Copy the generated token

### 5. Add GitHub Secret

1. Go to your GitHub repository settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `EXPO_TOKEN`
5. Value: Paste the access token from step 4
6. Click "Add secret"

## How it Works

When a PR is opened or updated:

1. The GitHub Action workflow (`.github/workflows/pr-preview.yml`) runs automatically
2. It creates an EAS Update on a channel named `pr-[number]` (e.g., `pr-42` for PR #42)
3. A QR code is generated and posted as a comment on the PR
4. Anyone can scan the QR code with Expo Go to test the changes

## Testing Locally

Before relying on the automated workflow, test EAS updates locally:

```bash
# Create an update on a test channel
eas update --branch test --message "Testing updates"

# Check update status
eas update:view --branch test
```

## Troubleshooting

### "EXPO_TOKEN not set" error

Make sure you've added the `EXPO_TOKEN` secret to your GitHub repository settings.

### "Project not configured" error

Run `eas init` to configure your project and ensure the project ID is in `app.json`.

### QR code doesn't work

1. Make sure you're using the same Expo account on your device
2. Check that the update was successfully published: `eas update:list`
3. Try the direct URL from the PR comment instead of the QR code

### Update not appearing in Expo Go

1. Ensure your app's runtime version matches between the update and the base app
2. Close and reopen Expo Go
3. Try pulling down to refresh in Expo Go

## Additional Resources

- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [Expo GitHub Actions](https://docs.expo.dev/build/building-on-ci/)
- [EAS Update Channels](https://docs.expo.dev/eas-update/how-it-works/)
