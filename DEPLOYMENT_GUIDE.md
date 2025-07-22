# 🚀 Firebase Deployment Guide - Flamed Grilled Cafe Admin

## Quick Deploy (Recommended)

### Option 1: Use Deployment Script
```bash
# Run the automated deployment script (Windows)
deploy.bat

# Or PowerShell version
./deploy.ps1
```

### Option 2: Manual Deployment
```bash
# 1. Login to Firebase (if not already logged in)
firebase login

# 2. Build the project
npm run build

# 3. Deploy with version protection
firebase deploy --only hosting --message "PRODUCTION: Admin Dashboard with ZAR Currency - DO NOT ROLLBACK"
```

## 🔒 Rollback Prevention

### Your deployment includes these safeguards:

1. **Version Messages**: Each deployment has a clear PRODUCTION tag
2. **Timestamp Tracking**: Every deploy gets a unique timestamp  
3. **Clear Warnings**: Deployment messages explicitly say "DO NOT ROLLBACK"
4. **Build Verification**: Build process validates before deployment

### To check deployment status:
```bash
# View deployment history
firebase hosting:channel:list

# Check current live version
firebase hosting:sites:list
```

## 🌐 Live URL
Once deployed, your admin dashboard will be available at:
**https://flame-grilled-cafe-pos.web.app**

## ✅ What's Included in This Deployment

- ✅ Complete Admin Dashboard
- ✅ South African Rand (ZAR) as default currency  
- ✅ Category management with icons and image upload
- ✅ Full CRUD operations for menu items
- ✅ Order management system
- ✅ Inventory tracking
- ✅ Customer messaging
- ✅ Mobile-responsive design
- ✅ Edit functionality for all categories

## 🛡️ Firebase Console Safety

### In Firebase Console:
1. Go to **Hosting** section
2. You'll see deployment history with your version messages
3. **DO NOT click "Rollback"** on any previous versions
4. Look for deployments marked "PRODUCTION" 
5. Only use the latest deployment with your timestamp

### If You Need to Update:
- Always run `npm run build` first
- Use the deployment scripts provided
- Include clear version messages
- Never rollback to older versions

## 🚨 Emergency Recovery
If something goes wrong:
1. Don't panic - Firebase keeps all versions
2. Check the Console for the latest "PRODUCTION" deployment
3. Re-run the deployment script
4. Contact support if needed

## 📱 Testing Your Deployment
Once live, test these features:
- [ ] Admin login works
- [ ] Currency shows as "R" (South African Rand)
- [ ] Category icons display properly
- [ ] Edit buttons work for categories
- [ ] Image upload functions
- [ ] Mobile responsive design
- [ ] All menu operations work
   - PaymentModal integration
   - Payment-first logic
   - State management

3. **OrderCodeCard.jsx** ✅
   - Order verification
   - Progress tracking
   - Delivery confirmation

4. **CustomerDashboard.jsx** ✅
   - OrderCodeCard display
   - Order tracking

### 🎯 **Testing Steps:**

1. **Run**: `start-dev.bat` or `npm run dev`
2. **Browse**: Go to mobile ordering page
3. **Add**: Items to cart
4. **Order**: Click "Place Order"
5. **Pay**: Use PaymentModal (no cash option)
6. **Verify**: Get order code (FGC-XXXX)
7. **Track**: View in customer dashboard

### 📱 **Expected Behavior:**
- Cart → Payment Required → PaymentModal → Payment Success → Order Code → Tracking

### ⚠️ **No Cash on Delivery:**
Payment is REQUIRED before order processing - exactly as requested!

---

**🚀 SYSTEM STATUS: READY TO DEPLOY**

**To start testing:** Double-click `start-dev.bat` or run `npm run dev` in terminal!
