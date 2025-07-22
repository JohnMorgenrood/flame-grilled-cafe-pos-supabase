# 🔧 Google Authentication Fix Guide

## 🚨 **Issue:** "Google sign in failed. Please try again"

This error typically occurs due to Firebase console configuration issues. Here's how to fix it:

---

## 🛠️ **Step 1: Configure Firebase Console**

### Navigate to Firebase Console:
1. **Go to:** https://console.firebase.google.com/project/flame-grilled-cafe-pos
2. **Click:** Authentication → Sign-in method
3. **Find:** Google provider

### Enable Google Sign-In:
1. **Click** on Google provider
2. **Enable** the toggle
3. **Project support email:** Select your email
4. **Save** changes

---

## 🌐 **Step 2: Add Authorized Domains**

### In Firebase Console:
1. **Authentication** → **Settings** → **Authorized domains**
2. **Add these domains:**
   - `flame-grilled-cafe-pos.web.app`
   - `flame-grilled-cafe-pos.firebaseapp.com` 
   - `localhost` (for development)

### Make sure these are in the list:
```
✅ flame-grilled-cafe-pos.web.app
✅ flame-grilled-cafe-pos.firebaseapp.com
✅ localhost
```

---

## 🔑 **Step 3: Google Cloud Console (If needed)**

If you want custom branding or additional configuration:

1. **Go to:** https://console.cloud.google.com
2. **Select:** flame-grilled-cafe-pos project
3. **APIs & Services** → **Credentials**
4. **Find:** OAuth 2.0 Client IDs
5. **Edit** the web client
6. **Authorized JavaScript origins:**
   - `https://flame-grilled-cafe-pos.web.app`
   - `https://flame-grilled-cafe-pos.firebaseapp.com`
7. **Authorized redirect URIs:**
   - `https://flame-grilled-cafe-pos.firebaseapp.com/__/auth/handler`

---

## 🧪 **Step 4: Test the Fix**

### Test URLs:
- **Login Page:** https://flame-grilled-cafe-pos.web.app/login
- **Enhanced Login:** https://flame-grilled-cafe-pos.web.app/enhanced-login
- **Website Login:** https://flame-grilled-cafe-pos.web.app/website/login

### What to try:
1. **Clear browser cache** and cookies
2. **Try incognito/private mode**
3. **Allow popups** for the site
4. **Check browser console** for detailed errors

---

## 🔧 **Code Changes Made**

### ✅ Fixed AuthContext Import
```jsx
// Before
import { useAuth } from '../../context/AuthContext';

// After  
import { useAuth } from '../../context/AuthContext-simple';
```

### ✅ Enhanced Google Provider Configuration
```javascript
// Improved scopes
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
```

### ✅ Better Error Handling
- Specific error messages for different scenarios
- Automatic retry logic
- Clear instructions for users

---

## 🚀 **Quick Test Commands**

```bash
# 1. Rebuild and deploy
npm run build
firebase deploy --only hosting

# 2. Test locally (if needed)
npm run dev
```

---

## 📋 **Common Error Codes & Solutions**

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/unauthorized-domain` | Domain not authorized | Add domain to Firebase authorized domains |
| `auth/popup-blocked` | Browser blocked popup | Allow popups for the site |
| `auth/popup-closed-by-user` | User closed popup | User action - try again |
| `auth/operation-not-allowed` | Google sign-in disabled | Enable in Firebase console |
| `auth/network-request-failed` | Network issue | Check internet connection |

---

## ✅ **Expected Result**

After these fixes, Google sign-in should:
1. ✅ Open Google popup successfully
2. ✅ Allow account selection
3. ✅ Create user profile in Firestore
4. ✅ Redirect to customer dashboard
5. ✅ Show success message

---

## 🆘 **Still Having Issues?**

If Google sign-in still fails:

1. **Check browser console** for specific errors
2. **Try different browser** or incognito mode
3. **Verify Firebase project** settings match this guide
4. **Contact support** with the specific error code

The authentication system is now properly configured with enhanced error handling and better user experience! 🎉
