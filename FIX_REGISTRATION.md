# 🔧 Fix Registration Issue on Deployed Site

## ❌ Problem

Registration is failing on https://mini-project-inner-balance.vercel.app/register because the **backend URL is not configured**.

## ✅ Solution

### Step 1: Deploy Backend (If Not Done)

1. **Deploy backend to Railway or Render**:
   - Go to [railway.app](https://railway.app) or [render.com](https://render.com)
   - Deploy your `server.js` file
   - Copy the backend URL (e.g., `https://inner-balance-backend.railway.app`)

### Step 2: Set Environment Variable in Vercel

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in
   - Click on your project: `mini-project-inner-balance`

2. **Go to Settings**:
   - Click "Settings" tab
   - Click "Environment Variables" in the left sidebar

3. **Add Environment Variable**:
   - Click "Add New"
   - **Key**: `REACT_APP_API_URL`
   - **Value**: Your backend URL (e.g., `https://inner-balance-backend.railway.app`)
   - **Environment**: Select all (Production, Preview, Development)
   - Click "Save"

4. **Redeploy**:
   - Go to "Deployments" tab
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy"
   - Or push a new commit to trigger automatic redeploy

### Step 3: Verify Backend is Working

Test your backend URL in browser:
```
https://your-backend.railway.app/users
```

Should return JSON data with users array.

---

## 🔍 Check Current Configuration

### Check Environment Variable in Vercel:

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Look for `REACT_APP_API_URL`
3. If it's missing or wrong, add/update it

### Check Browser Console:

1. Open your deployed site: https://mini-project-inner-balance.vercel.app/register
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Try to register
5. Check for errors - they will now show the actual error message

---

## 🚨 Common Issues

### Issue 1: Environment Variable Not Set
**Error**: "Backend server not configured"
**Fix**: Add `REACT_APP_API_URL` in Vercel environment variables

### Issue 2: Backend Not Deployed
**Error**: "Cannot connect to backend server"
**Fix**: Deploy backend to Railway/Render first

### Issue 3: Wrong Backend URL
**Error**: "Server error: 404" or connection error
**Fix**: Verify backend URL is correct and includes `https://`

### Issue 4: CORS Error
**Error**: "CORS policy" error
**Fix**: Make sure `server.js` has CORS headers (already included)

---

## 📝 Quick Fix Steps (TL;DR)

1. ✅ Deploy backend to Railway: https://railway.app
   - Start command: `node server.js`
   - Copy the URL

2. ✅ Add to Vercel:
   - Settings → Environment Variables
   - Key: `REACT_APP_API_URL`
   - Value: Your Railway backend URL
   - Redeploy

3. ✅ Test:
   - Visit: https://your-backend.railway.app/users
   - Should show JSON data
   - Try registering on frontend

---

## 🎯 Alternative: Use a Free Backend Service

If deploying backend is complicated, you can use:

### Option 1: MyJSON.com (Quick Demo)
- Go to https://myjson.com
- Paste your `db.json` content
- Use the URL they provide as your backend

### Option 2: JSONBin.io (Free Tier)
- Go to https://jsonbin.io
- Create account
- Upload your db.json
- Use their API URL

**Note**: These are temporary solutions for demos. For production, use Railway/Render.

---

## ✅ Verification Checklist

- [ ] Backend deployed and accessible
- [ ] Backend URL tested in browser (returns JSON)
- [ ] `REACT_APP_API_URL` set in Vercel
- [ ] Vercel redeployed after setting environment variable
- [ ] Browser console shows no API errors
- [ ] Registration form shows proper error messages

---

## 🆘 Still Not Working?

Check:
1. Browser console for specific error messages
2. Network tab in DevTools - see if API calls are failing
3. Backend logs in Railway/Render dashboard
4. Ensure backend URL doesn't have trailing slash
5. Ensure backend URL uses `https://` not `http://`

---

**After fixing, registration should work! 🎉**

