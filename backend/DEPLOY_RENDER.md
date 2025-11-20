# 🚀 Deploy Backend to Render - Step by Step Guide

## ✅ Prerequisites

1. A GitHub account (free)
2. A Render account (free tier available)
3. Your backend code pushed to GitHub

## 📋 Step-by-Step Instructions

### Step 1: Push Backend to GitHub (If not already done)

1. **Create a GitHub repository** (or use existing):
   - Go to [github.com](https://github.com) → New repository
   - Name it: `inner-balance-backend` (or any name you prefer)
   - **Don't initialize with README** (if you have code already)
   - Click "Create repository"

2. **Push backend folder to GitHub**:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit - Inner Balance Backend"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/inner-balance-backend.git
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub username)

### Step 2: Sign Up for Render (If not already done)

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended - easiest)
4. Authorize Render to access your GitHub account

### Step 3: Deploy Backend to Render

1. **Create New Web Service**:
   - In Render dashboard, click "New +" button
   - Select "Web Service"

2. **Connect GitHub Repository**:
   - Click "Connect account" if not already connected
   - Select your GitHub account
   - Choose the repository: `inner-balance-backend` (or your repo name)
   - Click "Connect"

3. **Configure Service**:
   - **Name**: `inner-balance-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to you (e.g., `Oregon (US West)`)
   - **Branch**: `main` (or your main branch)
   - **Root Directory**: `backend` ⚠️ **IMPORTANT**: Leave this **EMPTY** if backend is in a separate repo, or enter `backend` if it's in the root of your repo
   - **Runtime**: `Node`
   - **Build Command**: `npm install` (or leave empty)
   - **Start Command**: `npm start` ⚠️ **This is critical!**
   - **Plan**: Select **Free** (or paid if you prefer)

4. **Advanced Settings** (Optional but recommended):
   - Scroll down to "Advanced"
   - **Auto-Deploy**: `Yes` (deploys on every push to main branch)
   - **Health Check Path**: `/users` (optional - for health monitoring)

5. **Environment Variables**:
   - Render automatically sets `PORT` variable
   - No additional environment variables needed for basic setup
   - Click "Add Environment Variable" if you need custom variables

6. **Create Web Service**:
   - Click "Create Web Service" button
   - Wait 2-3 minutes for deployment to complete

### Step 4: Get Your Backend URL

1. Once deployment completes, you'll see a URL like:
   - `https://inner-balance-backend.onrender.com`
   - Or: `https://inner-balance-backend-xxxx.onrender.com`

2. **Copy this URL** - you'll need it for frontend configuration!

3. **Test Your Backend**:
   - Open the URL in browser: `https://your-backend.onrender.com/users`
   - Should see JSON data with users array
   - If you see JSON data, deployment is successful! ✅

### Step 5: Update Frontend Environment Variable

1. Go to your frontend deployment (Vercel/Netlify/Render)
2. Add/Update environment variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend.onrender.com` (your Render backend URL)
3. Redeploy frontend

## 🎯 Quick Configuration Summary

When creating Web Service on Render, use these settings:

```
Name: inner-balance-backend
Environment: Node
Region: Oregon (US West) [or closest to you]
Branch: main
Root Directory: backend [or empty if separate repo]
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

## 🔍 Troubleshooting

### Issue 1: "Build failed"
- **Check**: Make sure `package.json` exists in backend folder
- **Check**: Verify `server.js` exists
- **Check**: Ensure `db.json` exists

### Issue 2: "Service crashed"
- **Check**: Verify Start Command is `npm start`
- **Check**: Check logs in Render dashboard
- **Check**: Make sure `server.js` uses `process.env.PORT`

### Issue 3: "Cannot find module json-server"
- **Fix**: Make sure `package.json` has `json-server` in dependencies
- **Fix**: Verify `npm install` runs during build

### Issue 4: "404 Not Found" when accessing API
- **Check**: Access `/users` endpoint: `https://your-backend.onrender.com/users`
- **Check**: Make sure db.json file exists and is valid JSON

### Issue 5: "CORS Error" from frontend
- **Fix**: Already handled in `server.js` - CORS is enabled for all origins

## ✅ Verification Checklist

- [ ] Backend code pushed to GitHub
- [ ] Render account created
- [ ] Web Service created on Render
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Deployment completed successfully
- [ ] Backend URL accessible (test in browser)
- [ ] `/users` endpoint returns JSON data
- [ ] Frontend environment variable updated

## 📝 Important Notes

1. **Free Tier Limitations**:
   - Render free tier services "spin down" after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds to wake up
   - Consider upgrading for production use

2. **Root Directory**:
   - If backend is in a **separate GitHub repo**, leave Root Directory **empty**
   - If backend is in a **subfolder** of main repo, set Root Directory to `backend`

3. **Environment Variables**:
   - `PORT` is automatically set by Render (don't set it manually)
   - Your `server.js` already uses `process.env.PORT || 3001` ✅

4. **Auto-Deploy**:
   - With Auto-Deploy enabled, every push to `main` branch triggers a new deployment
   - Very convenient for continuous deployment!

## 🎉 After Deployment

Once deployed, your backend will be available at:
```
https://your-backend-name.onrender.com
```

Test endpoints:
- Users: `https://your-backend-name.onrender.com/users`
- Professors: `https://your-backend-name.onrender.com/professors`
- Clients: `https://your-backend-name.onrender.com/clients`
- Sessions: `https://your-backend-name.onrender.com/sessions`
- Content: `https://your-backend-name.onrender.com/content`
- Messages: `https://your-backend-name.onrender.com/messages`
- Gamification: `https://your-backend-name.onrender.com/gamification`

## 📞 Need Help?

- Check Render logs in dashboard for error messages
- Verify all files are in correct location
- Test backend locally first: `npm start` in backend folder

---

**Follow these steps and your backend will be live on Render! 🚀**

