# 🔧 Update Frontend to Use Your Backend URL

## ✅ Backend is Live!

Your backend is deployed at: **`https://inner-balance-backend.onrender.com`**

Now update your frontend to connect to it!

## 📝 Step 1: Update Frontend Environment Variable

### If Frontend is on Vercel:

1. Go to [vercel.com](https://vercel.com) → Your project
2. **Settings** → **Environment Variables**
3. **Add New** or **Edit**:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://inner-balance-backend.onrender.com`
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**

5. **Redeploy**:
   - Go to **Deployments** tab
   - Click **⋯** on latest deployment
   - Click **Redeploy**

### If Frontend is on Netlify:

1. Go to [netlify.com](https://netlify.com) → Your site
2. **Site settings** → **Environment variables**
3. **Add a variable**:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://inner-balance-backend.onrender.com`
   - **Scopes**: All scopes
4. Click **Save**

5. **Redeploy**:
   - Go to **Deploys** tab
   - **Trigger deploy** → **Deploy site**

### If Frontend is on Render:

1. Go to [render.com](https://render.com) → Your static site
2. **Environment** tab
3. **Add Environment Variable**:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://inner-balance-backend.onrender.com`
4. Click **Save Changes**

5. **Redeploy** (usually auto-deploys after saving)

## 🧪 Step 2: Test Your Frontend

After redeploying:

1. **Visit your frontend URL**
2. **Try to register** a new account
3. **Check browser console** (F12):
   - Should see API calls to `inner-balance-backend.onrender.com`
   - No CORS errors
   - No connection errors

4. **Test login** with demo account:
   - Email: `john@example.com`
   - Password: `client123`

## ✅ Verification

Your frontend should now:
- ✅ Connect to backend successfully
- ✅ Allow user registration
- ✅ Allow user login
- ✅ Load therapist data
- ✅ Display content and resources

## 🔍 Troubleshooting

### Frontend still shows errors?

1. **Check environment variable is set**:
   - Verify `REACT_APP_API_URL` is set correctly
   - Make sure you redeployed after setting it

2. **Check browser console**:
   - Press F12 → Console tab
   - Look for API errors
   - Check network tab for failed requests

3. **Verify backend is accessible**:
   - Visit: `https://inner-balance-backend.onrender.com/users`
   - Should see JSON data
   - If it's slow, wait - free tier may be spinning up

### CORS errors?

- Already handled! Your backend has CORS enabled ✅

### Connection timeout?

- Render free tier spins down after inactivity
- First request may take 30-60 seconds
- This is normal for free tier

## 🎉 Done!

Once you update the environment variable and redeploy, your full-stack app will be connected!

**Backend**: `https://inner-balance-backend.onrender.com`  
**Frontend**: Your frontend URL (Vercel/Netlify/Render)

---

**Update the environment variable and redeploy your frontend! 🚀**

