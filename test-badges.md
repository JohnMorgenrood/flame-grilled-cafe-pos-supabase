# Testing Featured/Special Badges System

## What We've Built

✅ **Admin Dashboard**: Full CRUD operations for menu items with Featured/Special checkboxes
✅ **Firebase Integration**: Real-time sync between admin and customer interfaces  
✅ **Badge System**: Featured (👑) and Special (⚡) badges display on customer interface
✅ **10MB Image Upload**: Enhanced image validation and upload system

## Testing Steps

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test Admin Dashboard (http://localhost:5173/admin)
- Login with your admin credentials
- Click "Add Menu Item" 
- Fill in item details:
  - Name: "Flame Grilled Special Burger"
  - Price: 25.99
  - Category: "specials" 
  - Description: "Our signature burger with flame-grilled patty"
  - ✅ Check "Featured Item" 
  - ✅ Check "On Special"
  - Upload an image (up to 10MB)
- Click "Add Item"

### 3. Test Customer Interface (http://localhost:5173)
- Navigate to the customer menu
- Look for your new item with badges:
  - 👑 Featured badge (yellow background)
  - ⚡ Special badge (red background)

### 4. Verify Firebase Sync
- Any item added in admin should immediately appear on customer interface
- Featured/Special checkboxes from admin = badges on customer side
- Image uploads should display properly

## Badge Implementation Details

**Featured Badge**: 
```jsx
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
  <Crown className="w-3 h-3 mr-1" />
  Featured
</span>
```

**Special Badge**:
```jsx
<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
  <Zap className="w-3 h-3 mr-1" />
  Special
</span>
```

## Troubleshooting

If badges don't appear:
1. Check browser console for Firebase errors
2. Verify item has `featured: true` or `onSpecial: true` in Firebase
3. Refresh customer interface
4. Check if item category matches selected category

## Next Steps

- Test ordering system with featured/special items
- Verify cart functionality maintains item properties
- Test image upload limits (try uploading 11MB file to see validation)
- Test category filtering with featured/special items
