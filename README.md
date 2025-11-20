# Inner Balance - Mental Wellness Platform

A full-stack web application designed to support mental wellness through online consultations, mood tracking, and educational resources.

## 📁 Project Structure

This project is now organized into separate backend and frontend folders:

```
inner-balance/
├── backend/          # Backend API (JSON Server)
│   ├── server.js
│   ├── db.json
│   ├── package.json
│   └── README.md
│
├── frontend/         # React Frontend Application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── README.md         # This file
```

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

**Important**: Make sure to set `REACT_APP_API_URL` environment variable in frontend (see frontend README)

## 📋 Features

### Three User Types

1. **Admin** - Full platform control, user management, content management
2. **Professor/Therapist** - Profile management, session management, availability
3. **Client/Patient** - Booking sessions, mood tracking, content access

### Key Features

- User Authentication (Login/Register)
- Therapist Browsing and Filtering
- Session Booking System
- Mood Tracking & Daily Wellbeing Check
- Mental Health Content/Articles
- Gamification Activities
- Profile Management
- Support/Help Page

## 🌐 Deployment

### Backend Deployment

Deploy the `backend` folder to:
- Railway (recommended)
- Render
- Heroku

See `backend/README.md` for detailed instructions.

### Frontend Deployment

Deploy the `frontend` folder to:
- Vercel (recommended)
- Netlify
- Render

**Important**: Set `REACT_APP_API_URL` environment variable to your backend URL.

See `frontend/README.md` for detailed instructions.

## 🔐 Demo Accounts

- **Admin**: admin@innerbalance.com / admin123
- **Professor**: sarah@innerbalance.com / prof123
- **Client**: john@example.com / client123

## 🛠️ Technology Stack

### Backend
- JSON Server
- Node.js

### Frontend
- React 18
- Tailwind CSS
- React Router v6
- Context API
- Axios

## 📝 Development

### Running Both Locally

**Terminal 1 (Backend)**:
```bash
cd backend
npm start
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm start
```

### Environment Variables

**Frontend** (create `frontend/.env`):
```
REACT_APP_API_URL=http://localhost:3001
```

**Backend** (optional):
```
PORT=3001
```

## 📚 Documentation

- [Backend README](backend/README.md) - Backend setup and deployment
- [Frontend README](frontend/README.md) - Frontend setup and deployment

## 🤝 Contributing

This is a demonstration project. Feel free to extend it with additional features.

## 📄 License

This project is for educational purposes.

---

**Inner Balance** - Healing starts here. You're not alone.
