# 🚀 GitHub Repository Setup Guide

Since GitHub CLI needs a terminal restart, here's how to create your repository manually:

## Step 1: Create GitHub Repository (Manual)

1. **Go to GitHub**: Open [github.com/new](https://github.com/new)
2. **Repository Settings**:
   - Repository name: `flame-grilled-cafe-pos-supabase`
   - Description: `Flame Grilled Cafe POS System with Supabase Integration`
   - Visibility: **Public** (so Vercel can access it)
   - **DON'T** initialize with README, .gitignore, or license (we have code already)
3. **Click "Create repository"**

## Step 2: Connect Local Code to GitHub

After creating the repository, GitHub will show you commands. Run these in order:

### Set the remote origin (replace YOUR_USERNAME):
```bash
git remote add origin https://github.com/YOUR_USERNAME/flame-grilled-cafe-pos-supabase.git
```

### Push your code:
```bash
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

Once your code is on GitHub:

1. **Go to Vercel**: Open [vercel.com](https://vercel.com)
2. **Sign up/Login** (use your GitHub account for easy integration)
3. **Import Project**: 
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select your `flame-grilled-cafe-pos-supabase` repository
4. **Configure Environment Variables**:
   - `VITE_SUPABASE_URL`: `https://ihsrwgidghryxhtgkqml.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloc3J3Z2lkZ2hyeXhodGdrcW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTA1MzIsImV4cCI6MjA2ODc4NjUzMn0.ooyMOC_a7gQwa3XJx-9S7p-6kgxd3Wki_1fwQsKPgXw`
5. **Deploy**: Click "Deploy"

## Step 4: Your Live URL

After deployment (takes 2-3 minutes), you'll get a live URL like:
`https://flame-grilled-cafe-pos-supabase.vercel.app`

## Alternative: Quick Commands (After creating GitHub repo)

If you want to copy-paste the exact commands after creating the GitHub repository:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/flame-grilled-cafe-pos-supabase.git
git branch -M main  
git push -u origin main
```

Your code is already committed locally, so these commands will push everything to GitHub immediately.

## ✅ Current Status

- [x] Local git repository initialized
- [x] All files committed locally
- [x] Vercel configuration ready
- [x] Environment variables configured
- [ ] GitHub repository created (YOU NEED TO DO THIS)
- [ ] Code pushed to GitHub (AUTOMATIC AFTER ABOVE)
- [ ] Vercel deployment (AUTOMATIC AFTER GITHUB)

**Next step**: Create the GitHub repository manually at [github.com/new](https://github.com/new)
