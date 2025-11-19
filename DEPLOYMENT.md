# Deployment Guide for Inner Balance

This guide covers multiple deployment options for the Inner Balance application.

## 📋 Overview

The application consists of:
- **Frontend**: React app (can be deployed to Vercel, Netlify, etc.)
- **Backend**: JSON Server (needs a hosting solution or alternative backend)

---

## 🚀 Option 1: Deploy to Vercel (Recommended - Easiest)

### Frontend Deployment

1. **Install Vercel CLI** (optional, or use web interface):
   ```bash
   npm install -g vercel
   ```

2. **Build the project**:
   ```bash
   cd mini-project-inner-balance
   npm run build
   ```

3. **Deploy via Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "New Project"
   - Import your GitHub repository (or drag & drop the project folder)
   - Set build command: `npm run build`
   - Set output directory: `build`
   - Add environment variable: `REACT_APP_API_URL` = your backend URL (see backend options below)
   - Click "Deploy"

### Backend Options for Vercel

**Option A: Use a separate JSON Server hosting**
- Deploy JSON Server to Railway, Render, or Heroku (see Option 2)
- Update `REACT_APP_API_URL` in Vercel to point to your backend URL

**Option B: Use Vercel Serverless Functions**
- Create an API route in your React app (more complex, requires code changes)

---

## 🌐 Option 2: Deploy to Netlify (Easy Alternative)

### Frontend Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy via Netlify**:
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Drag & drop the `build` folder, OR
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variable: `REACT_APP_API_URL` = your backend URL

### Backend for Netlify

Deploy JSON Server separately to Railway, Render, or Heroku.

---

## 🚂 Option 3: Deploy Backend to Railway (Recommended for JSON Server)

Railway makes it easy to deploy JSON Server.

1. **Create a `server.js` file** in your project root:
   ```javascript
   const jsonServer = require('json-server');
   const server = jsonServer.create();
   const router = jsonServer.router('db.json');
   const middlewares = jsonServer.defaults();
   const port = process.env.PORT || 3001;

   server.use(middlewares);
   server.use(router);
   server.listen(port, () => {
     console.log(`JSON Server is running on port ${port}`);
   });
   ```

2. **Create a `package.json` for the server** (or update existing):
   ```json
   {
     "name": "inner-balance-backend",
     "version": "1.0.0",
     "main": "server.js",
     "scripts": {
       "start": "node server.js"
     },
     "dependencies": {
       "json-server": "^0.17.4"
     }
   }
   ```

3. **Deploy to Railway**:
   - Go to [railway.app](https://railway.app) and sign up
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository
   - Railway will auto-detect and deploy
   - Copy the generated URL (e.g., `https://your-app.railway.app`)
   - Update your frontend's `REACT_APP_API_URL` to this URL

---

## 🎯 Option 4: Deploy to Render (Free Tier Available)

### Backend Deployment

1. **Create `server.js`** (same as Railway option above)

2. **Deploy to Render**:
   - Go to [render.com](https://render.com) and sign up
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set:
     - Build Command: `npm install`
     - Start Command: `node server.js`
   - Add environment variable: `PORT` = `10000` (or any port)
   - Click "Create Web Service"
   - Copy the URL and update frontend

### Frontend Deployment

- Use the same process as Vercel/Netlify
- Or deploy frontend to Render as a Static Site

---

## 🔧 Option 5: Deploy to Heroku

### Backend

1. **Create `server.js`** (same as above)

2. **Create `Procfile`**:
   ```
   web: node server.js
   ```

3. **Deploy**:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

---

## ⚙️ Environment Variables Setup

### For Frontend (React)

Create a `.env` file in your project root:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

Or set in your hosting platform's environment variables section.

### Update AuthContext.js

The code should use:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

---

## 📝 Step-by-Step: Complete Deployment

### Step 1: Prepare Backend

1. Create `server.js` in project root:
   ```javascript
   const jsonServer = require('json-server');
   const server = jsonServer.create();
   const router = jsonServer.router('db.json');
   const middlewares = jsonServer.defaults();
   const port = process.env.PORT || 3001;

   server.use(middlewares);
   server.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', '*');
     res.header('Access-Control-Allow-Headers', '*');
     next();
   });
   server.use(router);
   server.listen(port);
   ```

2. Update `package.json` to include server start script:
   ```json
   "scripts": {
     "server": "node server.js",
     "start": "react-scripts start",
     "build": "react-scripts build"
   }
   ```

### Step 2: Deploy Backend

1. **Deploy to Railway** (easiest):
   - Push code to GitHub
   - Connect Railway to GitHub repo
   - Railway auto-deploys
   - Copy the backend URL

### Step 3: Update Frontend

1. Update `src/context/AuthContext.js`:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
   ```

2. Create `.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```

### Step 4: Deploy Frontend

1. **Deploy to Vercel**:
   - Push to GitHub
   - Import to Vercel
   - Add environment variable: `REACT_APP_API_URL`
   - Deploy

---

## 🎯 Quick Deploy Commands

### Local Testing (Production Build)

```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Build and serve frontend
npm run build
npx serve -s build -l 3000
```

### Deploy Checklist

- [ ] Backend deployed and URL obtained
- [ ] Frontend `REACT_APP_API_URL` environment variable set
- [ ] `AuthContext.js` uses environment variable
- [ ] CORS enabled on backend (if needed)
- [ ] Build tested locally
- [ ] Frontend deployed
- [ ] Test login/register functionality

---

## 🔒 Important Notes

1. **JSON Server is for development**: For production, consider migrating to a real backend (Node.js/Express, Firebase, Supabase, etc.)

2. **CORS**: Make sure your backend allows requests from your frontend domain

3. **Environment Variables**: Never commit `.env` files with production URLs to public repos

4. **HTTPS**: Always use HTTPS in production

5. **Database**: JSON Server uses a file-based database. For production, use a real database (PostgreSQL, MongoDB, etc.)

---

## 🆘 Troubleshooting

### CORS Errors
- Add CORS middleware to your backend server.js
- Ensure backend URL is correct in frontend

### 404 Errors
- Check that `REACT_APP_API_URL` is set correctly
- Verify backend is running and accessible

### Build Failures
- Run `npm install` before building
- Check for TypeScript/ESLint errors
- Ensure all dependencies are in package.json

---

## 📚 Alternative: Migrate to Real Backend

For production, consider:
- **Firebase**: Easy setup, real-time database
- **Supabase**: Open-source Firebase alternative
- **Node.js + Express**: Full control
- **MongoDB Atlas**: Database hosting

Would you like me to help set up any of these alternatives?

