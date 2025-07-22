# 🔧 Fix Firebase Configuration

## Step 1: Get Your Firebase Configuration

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**: `flame-grilled-cafe-pos`
3. **Click the gear icon** → **Project settings**
4. **Scroll down to "Your apps"**
5. **Click "Web app" icon** (</>) or **"Add app"** if none exists
6. **App nickname**: `Flame Grilled Cafe POS`
7. **Check "Also set up Firebase Hosting"**
8. **Click "Register app"**
9. **Copy the firebaseConfig object**

## Step 2: Update Your Configuration

Replace the content in `src/firebase/firebase.js` with your actual config:

```javascript
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIza...",                    // Your actual API key
  authDomain: "flame-grilled-cafe-pos.firebaseapp.com",
  projectId: "flame-grilled-cafe-pos",
  storageBucket: "flame-grilled-cafe-pos.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

## Step 3: Re-deploy

After updating the configuration:

```bash
npm run build
firebase deploy
```

## 🚨 Important: 

Without the correct Firebase configuration, your app cannot connect to:
- Authentication system
- Firestore database  
- Storage services
- Real-time features

## Quick Fix Commands:

```bash
# 1. Connect to your Firebase project
firebase use flame-grilled-cafe-pos

# 2. Build the project
npm run build

# 3. Deploy to hosting
firebase deploy --only hosting
```

---

**Once you update the Firebase config, your POS system will be fully functional!**
