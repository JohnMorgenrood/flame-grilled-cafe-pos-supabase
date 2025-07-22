# 🔥 Firebase Setup Guide for Flame Grilled Cafe

## Complete Payment Gateway & Transaction System

### 📋 Firebase Configuration Steps

#### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "flame-grilled-cafe" or similar
4. Enable Google Analytics (optional)

#### 2. Enable Authentication
1. In Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password** authentication
3. Note: This allows your demo accounts to work

#### 3. Create Firestore Database
1. Go to Firestore Database → Create database
2. Start in **test mode** (we have security rules configured)
3. Choose your preferred location

#### 4. Get Firebase Configuration
1. Go to Project Settings → General
2. Scroll to "Your apps" → Web app
3. Copy the `firebaseConfig` object

#### 5. Update Configuration File
Replace the placeholder config in `src/firebase/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

#### 6. Deploy Firestore Security Rules
1. In Firebase Console → Firestore Database → Rules
2. Copy the rules from `firestore.rules` in this project
3. Click "Publish"

---

## 🎯 Payment Gateway Features

### ✅ **Real-time Transaction Processing**
- Complete Firebase integration with error handling
- Automatic receipt generation and printing
- Transaction logging for admin oversight
- Daily sales summary updates

### ✅ **Receipt System**
- Professional receipt format with business branding
- Auto-print for cash transactions
- Manual print option for card payments
- Reprinting from transaction history

### ✅ **Admin Dashboard**
- Real-time transaction monitoring
- Sales analytics with payment method breakdown
- Advanced filtering and search capabilities
- CSV export functionality

### ✅ **Database Collections**
- `orders`: Complete order records
- `receipts`: Receipt data for reprinting
- `transactions`: Admin transaction tracking
- `kitchen_orders`: Kitchen display integration
- `daily_sales`: Sales summary by date

---

## 🚀 Demo Access

### Quick Start Routes:
- **Demo Login**: `http://localhost:5173/demo`
- **POS System**: `http://localhost:5173/`
- **Mobile Ordering**: `http://localhost:5173/order`
- **Admin Panel**: `http://localhost:5173/admin`

### Demo Accounts:
```
Admin: admin@flamecafe.com / admin123
Cashier: cashier@flamecafe.com / cashier123
Customer: customer@flamecafe.com / customer123
```

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 💳 Payment Flow

### 1. **POS Transaction**
```
Add Items → Review Cart → Select Payment Method → Process Payment → Generate Receipt → Update Firebase → Clear Cart
```

### 2. **Firebase Operations**
- Order record created in `orders` collection
- Receipt data saved to `receipts` collection  
- Transaction logged in `transactions` collection
- Kitchen order sent to `kitchen_orders` collection
- Daily sales updated in `daily_sales` collection

### 3. **Error Handling**
- Firebase connection issues → Graceful fallback
- Authentication problems → Clear error messages
- Permission errors → Helpful guidance
- Network issues → Retry mechanisms

---

## 🛡️ Security Features

### Role-based Access Control:
- **Admin**: Full access to all data and operations
- **Cashier**: POS access, limited transaction viewing
- **Customer**: Personal data and order history only

### Data Protection:
- Encrypted data transmission
- Secure authentication flows
- Firestore security rules enforcement
- User session management

---

## 📊 Analytics & Reporting

### Real-time Metrics:
- Total daily sales
- Payment method breakdown (Cash vs Card)
- Transaction volume
- Peak hour analysis

### Export Capabilities:
- CSV transaction reports
- Date range filtering
- Payment method filtering
- Search functionality

---

## 🔧 Troubleshooting

### Common Issues:

1. **"Payment failed: Permission denied"**
   - Ensure Firebase rules are deployed
   - Check user authentication status
   - Verify user role in Firestore

2. **"Firebase service unavailable"**
   - Check internet connection
   - Verify Firebase configuration
   - Confirm project billing status

3. **"Demo login not working"**
   - Ensure Authentication is enabled in Firebase
   - Verify Email/Password provider is active
   - Check console for detailed errors

### Firebase Setup Verification:
```javascript
// Test Firebase connection in browser console
import { db } from './firebase/firebase';
console.log('Firebase configured:', !!db);
```

---

## 🎉 Production Deployment

### Before going live:
1. Update Firestore rules to production mode
2. Configure Firebase project billing
3. Set up custom domain
4. Enable Firebase Hosting
5. Configure environment variables
6. Test all payment flows thoroughly

### Firebase Hosting Deployment:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Firebase configuration
3. Test with demo accounts first
4. Review Firestore security rules
5. Check network connectivity

**The system includes comprehensive error handling and will fall back to demo data if Firebase is not configured properly.**
