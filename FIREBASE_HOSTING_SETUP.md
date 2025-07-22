# Firebase Hosting & Domain Setup Guide

## 🚀 Deploy Your POS System to Firebase Hosting

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Firebase in Your Project
```bash
firebase init
```

**When prompted, select:**
- ✅ Firestore: Configure security rules and indexes files
- ✅ Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys

**Configuration answers:**
- Use existing project: **flame-grilled-cafe-pos** (your project)
- Firestore rules file: **firestore.rules** (already exists)
- Firestore indexes file: **firestore.indexes.json** (already created)
- Public directory: **dist**
- Single-page app: **Yes**
- GitHub deploys: **No** (for now)

### Step 4: Build Your Project
```bash
npm run build
```

### Step 5: Deploy to Firebase
```bash
firebase deploy
```

## 🌐 Your Free Firebase Domain

After deployment, you'll get a free domain like:
- `https://flame-grilled-cafe-pos.web.app`
- `https://flame-grilled-cafe-pos.firebaseapp.com`

## 🔗 Custom Domain (Optional)

If you want to add your own custom domain:

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., myrestaurant.com)
4. Follow the DNS verification steps
5. Add the required DNS records to your domain provider

## 📱 Quick Deploy Commands

**For future updates:**
```bash
npm run build && firebase deploy
```

**Deploy only hosting:**
```bash
firebase deploy --only hosting
```

**Deploy only firestore rules:**
```bash
firebase deploy --only firestore:rules
```

## 🛡️ Security Settings

Your app will automatically use:
- HTTPS encryption
- Firebase Authentication
- Firestore security rules
- Content delivery network (CDN)

## 📊 Analytics & Performance

Firebase automatically provides:
- Page load analytics
- User engagement metrics
- Performance monitoring
- Error tracking

---

## 🚨 Important Notes

1. **Build before deploy**: Always run `npm run build` first
2. **Firebase config**: Make sure your `src/firebase/firebase.js` has the correct config
3. **Environment**: The deployed app will use your Firebase project's live database
4. **Security**: Your Firestore rules are automatically deployed

## 📞 Support

If you need help:
1. Check Firebase Console for deployment status
2. View logs: `firebase functions:log`
3. Debug locally: `firebase serve`
