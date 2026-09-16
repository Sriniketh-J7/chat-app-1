import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './libs/db.js';
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';
import { Server } from 'socket.io';

// Create express app
const app = express();
const server = http.createServer(app);

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://chat-app-eta-eight-11.vercel.app",
];

// Initialize socket.io server
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store online users
export const userSocketMap = {}; // {userId: socketId}

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`User connected: ${userId}`);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" })); // increased limit for image uploads

app.get("/", (req,res) => res.send("working"));
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

// Connect to database then start server
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export for vercel
export default server;
