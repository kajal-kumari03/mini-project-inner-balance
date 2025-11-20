# Inner Balance - Frontend

React frontend application for the Inner Balance mental wellness platform.

## 📋 Overview

This is the frontend application built with React, Tailwind CSS, and React Router. It provides a complete user interface for clients, therapists, and administrators.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

This runs the app in development mode on `http://localhost:3000`

### Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:3001
```

For production, set this to your deployed backend URL (e.g., `https://inner-balance-backend.railway.app`)

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🌐 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. New Project → Import from GitHub
4. Add Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: Your backend URL
5. Deploy!

### Deploy to Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. New Site → Import from Git
4. Build command: `npm run build`
5. Publish directory: `build`
6. Add Environment Variable: `REACT_APP_API_URL`
7. Deploy!

### Deploy to Render

1. Go to [render.com](https://render.com)
2. New → Static Site
3. Connect GitHub repository
4. Root Directory: `frontend`
5. Build Command: `npm install && npm run build`
6. Publish Directory: `build`
7. Add Environment Variable: `REACT_APP_API_URL`

## 🎨 Features

- User Authentication (Login/Register)
- Three User Types: Admin, Professor/Therapist, Client
- Therapist Browsing and Booking with live slot checker
- Therapist onboarding form for document verification (marksheets, identity proofs, certificates)
- Mood Tracking
- Daily Wellbeing Check
- Mental Health Content/Articles
- Gamification Activities
- Session Feedback journal (clients share rating, mood before/after, headline takeaway)
- Profile Management
- Support/Help Page

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── PrivateRoute.js
│   ├── config/
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Landing.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── AdminDashboard.js
│   │   ├── ProfessorDashboard.js
│   │   ├── ClientDashboard.js
│   │   ├── TherapistListing.js
│   │   ├── SessionBooking.js
│   │   ├── MoodTracker.js
│   │   ├── ContentPage.js
│   │   ├── Gamification.js
│   │   ├── Profile.js
│   │   └── Support.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── vercel.json
```

## 🔗 API Configuration

The API URL is configured in `src/config/api.js`. It uses the `REACT_APP_API_URL` environment variable.

Default (development): `http://localhost:3001`

Make sure to set this environment variable in your hosting platform!

## 🎨 Styling

This project uses Tailwind CSS with custom colors:
- `calm-blue`: #6B9BD1
- `calm-green`: #7FB3A3
- `calm-lavender`: #B8A9D9
- `soft-pink`: #F5D7DA
- `warm-beige`: #F5F1E8

## 📝 Demo Accounts

- **Admin**: admin@innerbalance.com / admin123
- **Professor**: sarah@innerbalance.com / prof123
- **Client**: john@example.com / client123

## 🔧 Troubleshooting

### API Connection Issues

- Check that `REACT_APP_API_URL` is set correctly
- Verify backend is running and accessible
- Check browser console for CORS errors

### Build Failures

- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript/ESLint errors
- Clear `node_modules` and reinstall if needed

