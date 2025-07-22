# 🔥 Firebase Quick Setup Reference

## Essential Links & Info

### 🌐 **Firebase Console**
**https://console.firebase.google.com/**

### 📝 **Project Details to Use**
- **Project Name:** `flame-grilled-cafe-pos`
- **Project ID:** (Firebase will generate this)
- **Location:** Choose closest to you (e.g., us-central1, europe-west1)

### ⚡ **Quick Setup Checklist**
- [ ] Create Firebase project
- [ ] Enable Authentication (Email/Password)
- [ ] Create Firestore Database (test mode)
- [ ] Add Web App to project
- [ ] Copy firebaseConfig
- [ ] Update `src/firebase/firebase.js`
- [ ] Deploy Firestore rules
- [ ] Test demo login

### 🎯 **Testing URLs (After Server Starts)**
- **Demo Login:** http://localhost:5173/demo
- **POS System:** http://localhost:5173/
- **Admin Panel:** http://localhost:5173/admin
- **Mobile Ordering:** http://localhost:5173/order

### 🔑 **Demo Accounts (Auto-Created)**
```
Admin: admin@flamecafe.com / admin123
Cashier: cashier@flamecafe.com / cashier123
Customer: customer@flamecafe.com / customer123
```

### 📂 **File to Update**
**Location:** `c:\Users\VALERIE\Desktop\flammedgrilledcafe\src\firebase\firebase.js`

**Replace this section:**
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",           // ← Replace with real values
  authDomain: "your-auth-domain",   // ← from Firebase Console
  projectId: "your-project-id",     // ← 
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 🚀 **Start Development Server**
Double-click: `start-dev.bat`
Or run: `npm run dev`

---

**💡 Follow the detailed guide in `FIREBASE_PROJECT_SETUP.md` for complete step-by-step instructions!**
