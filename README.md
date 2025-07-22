# Flammed Grilled Cafe - Restaurant Management System

A modern, full-stack restaurant management system built with React, Firebase, and Tailwind CSS. Features role-based access control, menu management, order processing, and customer ordering capabilities.

## 🚀 Features

### Public Website
- **Modern Landing Page** - Hero section with call-to-action
- **Dynamic Menu** - Filterable menu items with categories
- **About Page** - Restaurant story and team information
- **Gallery** - Image showcase with category filtering
- **Contact Form** - Contact information with form submission

### Authentication
- **Firebase Auth** - Email/password authentication
- **Role-based Access** - Admin, Cashier, and Customer roles
- **Protected Routes** - Route guards for different user types
- **Auto-role Assignment** - New users default to "customer" role

### Admin Dashboard
- **Analytics Overview** - Stats on users, orders, revenue
- **Menu Management** - Add/edit/delete menu items with image upload
- **User Management** - View and modify user roles
- **Order Analytics** - Revenue and order tracking

### Cashier Dashboard
- **Live Orders** - Real-time order management
- **Order Status Updates** - Mark orders as preparing/completed/paid
- **Payment Processing** - Mark orders as paid

### Customer Dashboard
- **Menu Browsing** - Browse and filter menu items
- **Shopping Cart** - Add items, adjust quantities
- **Order Placement** - Place orders with real-time updates
- **Order History** - View past orders and status

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Backend**: Firebase v9+ (Auth, Firestore, Storage)
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flammedgrilledcafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create Firestore Database
   - Enable Storage
   - Get your Firebase configuration

4. **Configure Firebase**
   - Update `src/firebase/firebase.js` with your Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

5. **Set up Firestore Security Rules**
   - Deploy the provided `firestore.rules` file:
   ```bash
   firebase deploy --only firestore:rules
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔐 Security Rules

The app uses the provided Firestore security rules for role-based access control:

- **Users**: Can only read/write their own user document
- **Menu**: Public read access, admin-only write access
- **Orders**: Role-based read/write permissions

## 📱 User Roles

### Customer (Default)
- Browse menu and place orders
- View order history
- Update profile

### Cashier
- View and manage live orders
- Update order status
- Mark orders as paid

### Admin
- Full system access
- Manage menu items
- Manage user roles
- View analytics

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting** (optional)
   ```bash
   firebase init hosting
   firebase deploy
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
├── context/            # React Context (Auth)
├── firebase/           # Firebase configuration
├── layouts/            # Layout components
├── pages/              # Page components
│   ├── public/         # Public pages
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Dashboard pages
├── routes/             # Route protection components
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for environment-specific configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
```

### Firestore Collections

The app uses three main collections:

1. **users** - User profiles with roles
2. **menu** - Menu items with categories and images
3. **orders** - Customer orders with status tracking

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for custom colors and themes
- Update `src/index.css` for global styles
- Component-specific styles use Tailwind classes

### Firebase Configuration
- Update security rules in `firestore.rules`
- Modify Storage rules for image uploads
- Configure Authentication providers

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support and questions, please contact [your-email@example.com]

---

**Flammed Grilled Cafe** - Where every meal is grilled to perfection! 🔥
