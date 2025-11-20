# Inner Balance - Backend API

JSON Server REST API for the Inner Balance mental wellness platform.

## 📋 Overview

This backend provides RESTful API endpoints for:
- User authentication and management
- Therapist/Professor profiles
- Client profiles
- Session bookings
- Mental health content
- Messaging system
- Gamification data

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

This starts JSON Server with watch mode on `http://localhost:3001`

### Run Production Server

```bash
npm start
```

This starts the production server using `server.js` on `http://localhost:3001` (or PORT from environment)

## 📡 API Endpoints

All endpoints follow RESTful conventions:

- `GET /users` - Get all users
- `POST /users` - Create new user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

Same pattern for:
- `/professors`
- `/clients`
- `/sessions`
- `/content`
- `/messages`
- `/gamification`

## 🌐 Deployment

### Deploy to Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. New Project → Deploy from GitHub
4. Select this backend folder
5. Set Start Command: `npm start`
6. Copy the deployment URL

### Deploy to Render

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Set PORT environment variable (auto-set by Render)

## 🔧 Environment Variables

- `PORT` - Server port (default: 3001)

## 📁 Database

The `db.json` file contains all data. JSON Server automatically creates REST endpoints for all top-level keys.

## 🔒 CORS

CORS is enabled for all origins. In production, you may want to restrict this to your frontend domain.

## 📝 Notes

- JSON Server is ideal for development and demos
- For production, consider migrating to a real backend (Node.js/Express, Firebase, etc.)
- Data persists in `db.json` file

