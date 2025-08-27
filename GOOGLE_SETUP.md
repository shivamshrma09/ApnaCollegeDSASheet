# Google OAuth Setup Instructions

## Current Issue
The error "The given origin is not allowed for the given client ID" means your local development URL is not authorized in Google Console.

## Fix Steps:

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Select your project or create a new one

### 2. Enable Google+ API
- Go to "APIs & Services" > "Library"
- Search for "Google+ API" and enable it

### 3. Configure OAuth Consent Screen
- Go to "APIs & Services" > "OAuth consent screen"
- Choose "External" user type
- Fill required fields:
  - App name: "DSA Sheet"
  - User support email: your email
  - Developer contact: your email

### 4. Add Authorized Origins
- Go to "APIs & Services" > "Credentials"
- Click on your OAuth 2.0 Client ID: `650760834469-56i14787333t7i8lnh7ooo4t98g9a4q9.apps.googleusercontent.com`
- Under "Authorized JavaScript origins", add:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
  - `http://localhost:3000`

### 5. Add Authorized Redirect URIs (if needed)
- Under "Authorized redirect URIs", add:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`

### 6. Save Changes
- Click "Save" button
- Changes may take 5-10 minutes to propagate

## Test
After setup, your Google Sign-In will work with:
- Real Google account selection popup
- Proper Gmail account integration
- No dummy data

## Client ID
Your current Client ID: `650760834469-56i14787333t7i8lnh7ooo4t98g9a4q9.apps.googleusercontent.com`