# Inner Balance - Mental Wellness Platform

A full-stack web application designed to support mental wellness through online consultations, mood tracking, and educational resources.

## 🌟 Features

### Three User Types

1. **Admin**
   - Full platform control
   - Manage all users (CRUD operations)
   - Approve/Reject Professors
   - View all consultations
   - Manage mental-health content
   - View system analytics

2. **Professor/Therapist**
   - Profile management
   - Add specializations (anxiety, depression, trauma, etc.)
   - Manage availability calendar
   - View upcoming sessions
   - Accept/Reject client bookings
   - Provide consultation notes
   - Communicate with clients via messaging

3. **Client/Patient**
   - User registration & login
   - Browse therapist profiles
   - Filter by mental health issues
   - Book sessions (video / audio / chat)
   - Mood tracking
   - Daily Wellbeing Check form
   - Read mental-health articles
   - Chat/message with assigned professor
   - Daily gamification hub with light mini-games and reflection prompts

## 🛠️ Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Context API
- **Backend/Database**: JSON Server (db.json)
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start JSON Server (Backend)

In one terminal window, run:

```bash
npm run server
```

This will start the JSON server on `http://localhost:3001`

### 3. Start React Development Server

In another terminal window, run:

```bash
npm start
```

This will start the React app on `http://localhost:3000`

## 🔐 Demo Accounts

### Admin
- **Email**: admin@innerbalance.com
- **Password**: admin123

### Professor/Therapist
- **Email**: sarah@innerbalance.com
- **Password**: prof123

### Client/Patient
- **Email**: john@example.com
- **Password**: client123

## 📁 Project Structure

```
inner-balance/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── PrivateRoute.js
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
│   │   ├── Gamification.js
│   │   ├── ContentPage.js
│   │   ├── Profile.js
│   │   └── Support.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── db.json
├── package.json
├── tailwind.config.js
└── README.md
```

## 🗄️ Database Structure

The `db.json` file contains the following collections:

- **users**: User accounts (admin, professor, client)
- **professors**: Therapist profiles with qualifications and availability
- **clients**: Client profiles with mood logs and session history
- **sessions**: Booking information
- **content**: Mental health articles and resources
- **messages**: Communication between clients and therapists
- **gamification**: Daily quests, prompts, and playful challenges

## 🎨 Design Features

- Soft, calming color palette (blue, green, lavender)
- Supportive and user-friendly UI
- Motivational phrases throughout the platform
- Responsive design for all devices

## 🧠 Mental Health Focus Areas

The platform addresses various mental health challenges:

- Depression
- Anxiety
- Stress & Burnout
- Career Pressure
- Relationship Issues
- Loneliness
- Academic Pressure
- Trauma Recovery
- Postpartum Support
- Social Media Addiction
- Low Self-Esteem
- Insomnia

## 📝 Available Scripts

- `npm start` - Start React development server
- `npm run server` - Start JSON server backend
- `npm run build` - Build for production
- `npm test` - Run tests

## 🔄 How It Works

1. **Authentication**: Users register/login and are redirected to their respective dashboards based on user type.

2. **Client Flow**:
   - Browse therapists by specialization
   - Book sessions (pending approval)
   - Track daily mood and wellbeing
   - Read educational content
   - Message with therapists

3. **Professor Flow**:
   - Manage profile and availability
   - Review and accept/reject session requests
   - Communicate with clients
   - View session history

4. **Admin Flow**:
   - Manage all users
   - Approve/reject professor registrations
   - View all sessions and analytics
   - Manage content

## 🌐 API Endpoints

The JSON server provides RESTful API endpoints:

- `GET /users` - Get all users
- `GET /professors` - Get all professors
- `GET /clients` - Get all clients
- `GET /sessions` - Get all sessions
- `GET /content` - Get all content
- `GET /messages` - Get all messages

All endpoints support standard CRUD operations (GET, POST, PATCH, DELETE).

## ⚠️ Important Notes

- This is a demo application using JSON Server for data persistence
- Authentication is simulated (not production-ready)
- Data is stored in `db.json` and persists between server restarts
- For production use, replace JSON Server with a proper backend API

## 🤝 Contributing

This is a demonstration project. Feel free to extend it with additional features like:
- Real authentication with JWT
- File uploads for profile pictures
- Video/audio call integration
- Payment processing
- Email notifications
- Advanced analytics

## 📄 License

This project is for educational purposes.

## 💚 Support

Remember: Your mental health matters. If you're struggling, please reach out to professional help or use the emergency resources provided in the Support page.

---

**Inner Balance** - Healing starts here. You're not alone.


