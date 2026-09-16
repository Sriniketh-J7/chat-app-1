import express from 'express';
import { checkAuth, Login, signup, updateProfile } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.js';


const userRouter = express.Router()

userRouter.post("/signup", signup)
userRouter.post("/login", Login)
userRouter.get("/check-auth", protectRoute, checkAuth)
userRouter.put("/update-profile", protectRoute, updateProfile)

export default userRouter;