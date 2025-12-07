// routes/roomRoutes.js
import express from 'express';
const router = express.Router();
import { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom, getMyRooms, searchRooms } from '../controllers/roomController.js';
import { verifyToken } from "../middleware/auth.js";

// PROTECTED ROUTES (require authentication)
router.post("/", verifyToken, createRoom);              // Create new room (owners only)
router.get("/owner/my-rooms", verifyToken, getMyRooms); // Get owner's rooms
router.put("/:id", verifyToken, updateRoom);            // Update room
router.delete("/:id", verifyToken, deleteRoom);         // Delete room

// PUBLIC ROUTES
router.get("/", getAllRooms);                    // Get all available rooms
router.post("/search", searchRooms);             // Search with filters (POST for fuzzy search)
router.get("/:id", getRoomById);                 // Get single room details

export default router;