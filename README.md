# 💬 DYK Chat App

A real-time full-stack chat application with instant messaging, image sharing, and online presence indicators.

---

## 🎥 Demo

<!-- Paste your video embed or link below -->
<!-- Option 1: YouTube embed -->
<!--
[![Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)
-->

<!-- Option 2: Loom / direct link -->
<!-- [▶ Watch Demo](YOUR_LOOM_OR_DRIVE_LINK) -->

> 📌 **To test live:** Open the app in **two different browsers** (or one normal + one incognito window), create two accounts, and chat between them in real time.

---

## 🌐 Live Demo

🔗 [YOUR_DEPLOYED_LINK_HERE](YOUR_DEPLOYED_LINK_HERE)

### Demo Credentials

| Account | Email | Password |
|---------|-------|----------|
| User 1  | demo1@test.com | demo123 |
| User 2  | demo2@test.com | demo123 |

---

## ✨ Features

- 🔐 **Auth** — Secure signup & login with JWT (7-day token)
- 💬 **Real-time messaging** — Instant messages via Socket.IO
- 🖼️ **Image sharing** — Send images in chat (up to 5MB), stored on Cloudinary
- 👤 **Profile management** — Update name, bio, and profile picture
- 🟢 **Online presence** — See who is online in real time
- 🔔 **Unseen message count** — Badge counter for unread messages per user
- 📱 **Fully responsive** — Works on mobile, tablet, and desktop
- 🌙 **Dark glassmorphism UI** — Modern design with blur effects and gradients

---

## 🛠 Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Socket.IO Client | Real-time communication |
| Axios | HTTP requests |
| React Router v6 | Client-side routing |
| React Hot Toast | Notifications |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | Server & REST API |
| Socket.IO | WebSocket server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Cloudinary | Image storage |

---

## 📁 Folder Structure

```
chat-app/
├── client/                   # React frontend
│   ├── context/
│   │   ├── AuthContext.jsx   # Auth state, login/logout, socket connection
│   │   └── ChatContext.jsx   # Chat state, messages, users
│   ├── public/
│   │   └── bgImage.svg
│   └── src/
│       ├── assets/           # Icons, images, logo
│       ├── components/
│       │   ├── Sidebar.jsx       # User list with search & unseen count
│       │   ├── ChatContainer.jsx # Message thread + input
│       │   └── RightSidebar.jsx  # Selected user info + shared media
│       ├── lib/
│       │   └── utils.js          # Helper functions (e.g. formatMessageTime)
│       ├── pages/
│       │   ├── LoginPage.jsx     # Login & signup form
│       │   ├── HomePage.jsx      # Main chat layout
│       │   └── ProfilePage.jsx   # Edit profile
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
└── server/                   # Express backend
    ├── controllers/
    │   ├── user.controller.js    # Signup, login, profile update
    │   └── message.controller.js # Send, get, mark-seen messages
    ├── libs/
    │   ├── db.js                 # MongoDB connection
    │   ├── utils.js              # JWT token generation
    │   └── Cloudinary.js         # Cloudinary config
    ├── middlewares/
    │   └── auth.js               # JWT verification middleware
    ├── models/
    │   ├── User.js               # User schema
    │   └── Message.js            # Message schema
    ├── routes/
    │   ├── user.routes.js        # /api/users/*
    │   └── message.routes.js     # /api/messages/*
    └── index.js                  # Entry point, Express + Socket.IO setup
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd chat-app
```

### 2. Set up environment variables

**`server/.env`**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

**`client/.env`**
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Install dependencies & run

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## 📡 API Endpoints

### Auth (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Create account |
| POST | `/login` | Login |
| GET | `/check-auth` | Verify token |
| PUT | `/update-profile` | Update name, bio, avatar |

### Messages (`/api/messages`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users + unseen counts |
| GET | `/:id` | Get conversation with a user |
| POST | `/send/:id` | Send message (text or image) |
| PUT | `/mark/:id` | Mark message as seen |

---

## 🔌 Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `getOnlineUsers` | Server → Client | Broadcasts online user IDs |
| `newMessage` | Server → Client | Delivers a new message in real time |

---

## 🙋 Author

**Sriniketh**
- GitHub: [YOUR_GITHUB](https://github.com/YOUR_GITHUB)
- LinkedIn: [YOUR_LINKEDIN](https://linkedin.com/in/YOUR_LINKEDIN)
- Portfolio: [YOUR_PORTFOLIO](YOUR_PORTFOLIO_LINK)
