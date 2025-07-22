# 🔐 User Role Management Guide

## 🎯 **Where Users Go After Sign-in:**

### 👤 **Customer (Default):**
- **Destination:** `/customer/dashboard`
- **What they see:** Order tracking interface with active/completed orders
- **Features:** Place orders, track delivery, reorder items, view order history

### 👨‍💼 **Admin:**
- **Destination:** `/admin/enhanced` 
- **What they see:** Restaurant management dashboard
- **Features:** Accept/reject orders, manage inventory, view analytics, add products

### 👨‍💻 **Cashier:**
- **Destination:** `/cashier`
- **What they see:** Point of Sale (POS) system
- **Features:** Process in-store orders, handle payments, manage transactions

---

## 🔧 **How to Change User Roles:**

### **Method 1: Direct Database Edit (Firebase Console)**
1. Go to: https://console.firebase.google.com/project/flame-grilled-cafe-pos/firestore
2. Navigate to **Collections** → **users**
3. Find your user document (by email)
4. Edit the **role** field:
   - `customer` (default)
   - `admin` 
   - `cashier`

### **Method 2: Admin Panel (Future Feature)**
- Admin users can change other user roles
- Role management interface in admin dashboard

---

## 🧪 **Testing Different Roles:**

### **Test Admin Access:**
1. Change your role to `admin` in Firebase Console
2. Sign out and sign in again
3. Should redirect to `/admin/enhanced`
4. See restaurant management features

### **Test Cashier Access:**
1. Change your role to `cashier` in Firebase Console  
2. Sign out and sign in again
3. Should redirect to `/cashier`
4. See POS system interface

### **Test Customer Access:**
1. Role should be `customer` (or leave blank)
2. Sign in normally
3. Should redirect to `/customer/dashboard`
4. See order tracking interface

---

## 🎯 **Current Setup:**

### **New Google Users:**
- Automatically assigned `customer` role
- Can immediately start ordering food
- Profile created in Firestore users collection

### **Role Persistence:**
- Roles are stored in Firebase Firestore
- Persist across browser sessions
- Cached in AuthContext for performance

### **Navigation Logic:**
```javascript
// Admin users → Restaurant Management
if (role === 'admin') {
  navigate('/admin/enhanced');
}

// Cashier users → POS System  
else if (role === 'cashier') {
  navigate('/cashier');
}

// Everyone else → Customer Dashboard
else {
  navigate('/customer/dashboard');
}
```

---

## 🔐 **Security Notes:**

- All admin/cashier routes are protected
- Role verification happens on both client and server
- Firebase security rules enforce role-based access
- Unauthorized users redirected to login

---

## 🚀 **Quick Role Change for Testing:**

**To test as Admin:**
1. Sign in with Google
2. Go to Firebase Console → Firestore → users → [your-user-id]
3. Change `role: "customer"` to `role: "admin"`
4. Refresh the page or sign out/in
5. You'll be redirected to admin dashboard!

The role-based navigation is now implemented and will work perfectly! 🎯
