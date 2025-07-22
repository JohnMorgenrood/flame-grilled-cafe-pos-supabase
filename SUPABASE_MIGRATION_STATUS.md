# Supabase Migration Helper for Flame Grilled Cafe POS

## Quick Setup Checklist

### ✅ Repository Setup
- [x] Repository cloned
- [x] Dependencies installed 
- [x] Supabase client added
- [x] Configuration files created

### 📝 Next Steps (YOU NEED TO DO THESE):

1. **Get your Supabase API Key**
   - Go to: https://supabase.com/dashboard
   - Select your project: https://ihsrwgidghryxhtgkqml.supabase.co
   - Navigate to: Settings > API
   - Copy the "anon public" key
   - Update the `.env` file with your actual key

2. **Set up Database Tables**
   - Go to your Supabase dashboard
   - Open the SQL Editor
   - Copy and run the SQL from `SUPABASE_SETUP.md`

3. **Configure Authentication (Optional)**
   - Enable Google/Facebook OAuth in Supabase dashboard
   - Go to Authentication > Providers

4. **Set up Storage**
   - Create "menu-images" bucket in Supabase Storage
   - Set appropriate policies (see SUPABASE_SETUP.md)

### 🚀 Start Development

Once you've completed the above steps:

```bash
npm run dev
```

Or use the batch file:
```bash
./start-supabase-dev.bat
```

### 🔧 Current Configuration

- **Supabase URL**: `https://ihsrwgidghryxhtgkqml.supabase.co`
- **API Key**: ⚠️ **YOU NEED TO ADD THIS TO .env FILE**
- **Environment**: Development
- **Framework**: React + Vite
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth

### 📋 Migration Status

- [x] Supabase client installed
- [x] Configuration files created
- [x] Firebase config updated to use Supabase
- [ ] Database schema applied (YOU NEED TO DO THIS)
- [ ] API key configured (YOU NEED TO DO THIS)
- [ ] Authentication providers enabled (OPTIONAL)

### ⚠️ Important Notes

1. **NEVER commit your `.env` file** - it contains sensitive API keys
2. **Test authentication flows** after setting up
3. **Update any Firebase-specific code** as you encounter it
4. **Check SUPABASE_SETUP.md** for detailed database schema

### 🐛 Troubleshooting

If you encounter issues:
1. Check that your API key is correct in `.env`
2. Verify database tables are created
3. Check browser console for detailed errors
4. Ensure Supabase project URL is correct

### 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
- Project Setup Guide: `SUPABASE_SETUP.md`
