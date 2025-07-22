# 🔧 Google Services Configuration Guide

## 📍 What You Need to Set Up

### 1. Google Sign-In (Firebase Console)
Your Firebase configuration is already set up, but you need to verify these settings:

**Go to: https://console.firebase.google.com/project/flame-grilled-cafe-pos**

#### Authentication Setup:
1. Click "Authentication" → "Sign-in method"
2. Enable "Google" provider
3. Add authorized domains:
   - `localhost` (for development)
   - `flame-grilled-cafe-pos.web.app` (for production)
   - `flame-grilled-cafe-pos.firebaseapp.com` (for production)

#### Project Settings:
1. Click Settings (gear icon) → "Project settings"
2. Under "Your apps", click the web app
3. Verify these domains are in "Authorized domains":
   - `localhost`
   - `flame-grilled-cafe-pos.web.app`
   - `flame-grilled-cafe-pos.firebaseapp.com`

### 2. Google Maps & Places API (Google Cloud Console)

**Go to: https://console.cloud.google.com/**

#### Step 1: Enable APIs
1. Select your project: `flame-grilled-cafe-pos`
2. Go to "APIs & Services" → "Library"
3. Enable these APIs:
   - ✅ **Maps JavaScript API**
   - ✅ **Places API**
   - ✅ **Geocoding API**

#### Step 2: Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key
4. Click "Restrict Key" for security

#### Step 3: Restrict API Key (IMPORTANT for security)
1. **Application restrictions:**
   - Select "HTTP referrers (web sites)"
   - Add these referrers:
     - `http://localhost:*/*`
     - `https://flame-grilled-cafe-pos.web.app/*`
     - `https://flame-grilled-cafe-pos.firebaseapp.com/*`

2. **API restrictions:**
   - Select "Restrict key"
   - Select these APIs:
     - Maps JavaScript API
     - Places API
     - Geocoding API

#### Step 4: Update Your .env File
Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` in your `.env` file with your actual API key:

```env
VITE_GOOGLE_MAPS_API_KEY=AIza...your-actual-key-here
```

## 🧪 Testing Instructions

### Test Google Sign-In:
1. Run `npm run dev`
2. Go to sign-in page
3. Click "Sign in with Google"
4. Should open Google OAuth popup
5. After signing in, should redirect back to app

### Test Address Finder:
1. Go to order page
2. In address input, try:
   - **Search**: Type "Sandton City" - should show autocomplete results
   - **Current Location**: Click "Use Current Location" - should detect your location
   - **Manual Entry**: Fill in address manually

## 🚨 Common Issues & Solutions

### Google Sign-In Issues:
- **"Unauthorized domain"**: Add your domain to Firebase authorized domains
- **"Popup blocked"**: Allow popups in browser
- **"Operation not allowed"**: Enable Google provider in Firebase

### Address Finder Issues:
- **No search results**: Check if Google Places API is enabled and API key is correct
- **"API key not configured"**: Update .env file with your API key
- **Location denied**: Browser blocks location access - user needs to allow

## 💰 Pricing Information

### Google Maps Platform:
- **First $200/month**: FREE (Google gives $200 monthly credit)
- **Places Autocomplete**: $17 per 1,000 requests
- **Geocoding**: $5 per 1,000 requests
- **For small restaurant**: Usually stays within free tier

### Firebase:
- **Authentication**: Free up to 50,000 users/month
- **Firestore**: Free tier includes 50,000 reads, 20,000 writes/day

## 🔍 Verification Checklist

- [ ] Firebase Google sign-in enabled
- [ ] Authorized domains added to Firebase
- [ ] Google Cloud project selected
- [ ] Maps JavaScript API enabled
- [ ] Places API enabled  
- [ ] Geocoding API enabled
- [ ] API key created and restricted
- [ ] .env file updated with API key
- [ ] App rebuilt and deployed

## 📞 Need Help?
If you're still having issues, check the browser console (F12) for error messages and share them for specific troubleshooting.
