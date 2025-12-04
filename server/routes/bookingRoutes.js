import express from 'express';
import { createBooking, getUserBookings, getOwnerBookings, cancelBooking, checkAvailability, updatePaymentStatus, ownerUpdatePaymentStatus, searchAvailableRooms } from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/search', searchAvailableRooms);

// All other booking routes require authentication
router.use(verifyToken);

router.post('/check-availability', checkAvailability);
router.post('/create', createBooking);
router.get('/user', getUserBookings);
router.get('/owner', getOwnerBookings);
router.post('/cancel/:id', cancelBooking);
router.post('/payment/:id', updatePaymentStatus);
router.post('/owner/payment/:id', ownerUpdatePaymentStatus);

export default router;
