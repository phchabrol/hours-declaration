# Google Authentication Setup Guide

This guide will help you set up Google OAuth authentication for your Hours Declaration app.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "Hours Declaration")
4. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity Services"
3. Click on it and click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External (or Internal if using Google Workspace)
   - App name: "Hours Declaration"
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"
   - Scopes: Click "Save and Continue" (default is fine)
   - Test users: Add your email if needed
   - Click "Save and Continue"

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: "Hours Declaration Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for local development)
     - `https://your-app.onrender.com` (your Render URL)
   - Authorized redirect URIs:
     - `http://localhost:5173` (for local development)
     - `https://your-app.onrender.com` (your Render URL)
   - Click "Create"

5. **Copy the Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)

## Step 4: Configure Environment Variables

### For Local Development

Create a `.env` file in the root of your project:

```bash
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

Replace `your-client-id-here` with the Client ID you copied.

### For Render Deployment

1. Go to your Render dashboard
2. Select your `hours-declaration` service
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add:
   - Key: `VITE_GOOGLE_CLIENT_ID`
   - Value: Your Google Client ID
6. Click "Save Changes"
7. Render will automatically redeploy

## Step 5: Test

1. Start your local dev server: `npm run dev`
2. Go to the login page
3. You should see a "Sign in with Google" button
4. Click it and test the authentication flow

## Troubleshooting

### "Google Client ID not configured" warning
- Make sure you created a `.env` file with `VITE_GOOGLE_CLIENT_ID`
- Restart your dev server after creating/updating `.env`
- Check that the variable name is exactly `VITE_GOOGLE_CLIENT_ID`

### "Error 400: redirect_uri_mismatch"
- Make sure your authorized redirect URIs in Google Console match exactly:
  - For local: `http://localhost:5173`
  - For production: Your exact Render URL
- URLs are case-sensitive and must match exactly

### Button doesn't appear
- Check browser console for errors
- Make sure Google Identity Services script loaded (check Network tab)
- Verify your Client ID is correct

### Authentication works locally but not on Render
- Make sure you added the environment variable in Render dashboard
- Make sure your Render URL is in authorized JavaScript origins
- Redeploy after adding environment variables

## Security Notes

- Never commit your `.env` file to Git (it's in `.gitignore`)
- Keep your Client ID secret (though it's less sensitive than Client Secret)
- Use different Client IDs for development and production if needed
- Regularly review authorized origins in Google Console

## Multiple Environments

If you want separate Client IDs for dev and production:

1. Create two OAuth clients in Google Console
2. Use different environment variables:
   - Local: `.env.local` with `VITE_GOOGLE_CLIENT_ID`
   - Render: Set in dashboard as `VITE_GOOGLE_CLIENT_ID`

The app will automatically use the correct one based on the environment.

