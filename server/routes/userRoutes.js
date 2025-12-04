import express from 'express'
const router = express.Router()
import { createUser, deleteUser, getUser, updateUser, loginUser, updateProfile, getProfile } from '../controllers/loginController.js'
import { verifyToken } from "../middleware/auth.js";

// PUBLIC ROUTES
router.post("/register", createUser);
router.post("/login", loginUser);

// PROTECTED ROUTES
router.get("/", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

// PROFILE ROUTES
router.get("/profile/me", verifyToken, getProfile);
router.put("/profile/update", verifyToken, updateProfile);

export default router