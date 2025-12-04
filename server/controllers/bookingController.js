import Booking from "../model/bookingSchema.js";
import Room from "../model/roomSchema.js";

// Check room availability without creating a booking
export const checkAvailability = async (req, res) => {
    try {
        const { roomId, checkInDate, checkOutDate, numberOfGuests } = req.body;

        // 1. Validate input
        if (!roomId || !checkInDate || !checkOutDate || !numberOfGuests) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);

        if (start >= end) {
            return res.status(400).json({ success: false, message: "Check-out date must be after check-in date" });
        }

        // Check if dates are in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (start < today) {
            return res.status(400).json({ success: false, message: "Check-in date cannot be in the past" });
        }

        // 2. Check if room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        // 3. Check if room is available
        if (!room.isAvailable) {
            return res.status(400).json({ success: false, message: "This room is currently unavailable" });
        }

        // 4. Check guest capacity
        if (numberOfGuests > room.maxGuests) {
            return res.status(400).json({
                success: false,
                message: `Max guests allowed is ${room.maxGuests}`
            });
        }

        // 5. Check availability (Date overlap)
        const conflictingBooking = await Booking.findOne({
            roomId,
            status: { $ne: 'cancelled' },
            $or: [
                { checkInDate: { $lt: end }, checkOutDate: { $gt: start } }
            ]
        });

        if (conflictingBooking) {
            return res.status(400).json({
                success: false,
                message: "Room is already booked for these dates",
                available: false
            });
        }

        // 6. Calculate total price
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = days * room.pricePerNight;

        res.status(200).json({
            success: true,
            available: true,
            message: "Room is available for the selected dates",
            data: {
                numberOfNights: days,
                pricePerNight: room.pricePerNight,
                totalPrice,
                roomName: room.hotelName,
                roomType: room.roomType
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const { roomId, checkInDate, checkOutDate, numberOfGuests } = req.body;
        const userId = req.userId; // From auth middleware

        // 1. Validate input
        if (!roomId || !checkInDate || !checkOutDate || !numberOfGuests) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);

        if (start >= end) {
            return res.status(400).json({ success: false, message: "Check-out date must be after check-in date" });
        }

        // 2. Check if room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        // 3. Check guest capacity
        if (numberOfGuests > room.maxGuests) {
            return res.status(400).json({ success: false, message: `Max guests allowed is ${room.maxGuests}` });
        }

        // 4. Check availability (Date overlap)
        const conflictingBooking = await Booking.findOne({
            roomId,
            status: { $ne: 'cancelled' },
            $or: [
                { checkInDate: { $lt: end }, checkOutDate: { $gt: start } }
            ]
        });

        if (conflictingBooking) {
            return res.status(400).json({ success: false, message: "Room is already booked for these dates" });
        }

        // 5. Calculate total price
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = days * room.pricePerNight;

        // 6. Create booking
        const booking = new Booking({
            roomId,
            userId,
            checkInDate: start,
            checkOutDate: end,
            numberOfGuests,
            totalPrice,
            status: 'confirmed', // Auto-confirm for now
            paymentStatus: 'pending' // Default
        });

        await booking.save();

        res.status(201).json({ success: true, message: "Booking created successfully", data: booking });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get bookings for the logged-in user
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.userId })
            .populate('roomId') // Populate room details
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get bookings for rooms owned by the logged-in user (Hotel Owner)
export const getOwnerBookings = async (req, res) => {
    try {
        // 1. Find all rooms owned by the user
        const rooms = await Room.find({ ownerId: req.userId }).select('_id');
        const roomIds = rooms.map(room => room._id);

        // 2. Find bookings for these rooms
        const bookings = await Booking.find({ roomId: { $in: roomIds } })
            .populate('roomId')
            .populate('userId', 'name email') // Populate user details who booked
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Check if the user owns the booking
        if (booking.userId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Not authorized to cancel this booking" });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({ success: true, message: "Booking cancelled successfully", data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update payment status (Mock Payment)
export const updatePaymentStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Check if the user owns the booking
        if (booking.userId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Not authorized to update this booking" });
        }

        // Check if already paid
        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({ success: false, message: "Booking is already paid" });
        }

        // Update payment status
        booking.paymentStatus = 'paid';
        await booking.save();

        res.status(200).json({ success: true, message: "Payment successful", data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Owner updates payment status
export const ownerUpdatePaymentStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('roomId');

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Check if the user owns the room
        if (booking.roomId.ownerId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Not authorized to update this booking" });
        }

        // Check if already paid
        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({ success: false, message: "Booking is already paid" });
        }

        // Update payment status
        booking.paymentStatus = 'paid';
        await booking.save();

        res.status(200).json({ success: true, message: "Payment status updated successfully", data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Search available rooms
export const searchAvailableRooms = async (req, res) => {
    try {
        const { city, checkIn, checkOut, guests } = req.query;

        // Build query
        let query = { isAvailable: true };

        // Filter by city if provided
        if (city) {
            query.city = { $regex: city, $options: 'i' }; // Case-insensitive search
        }

        // Filter by guest capacity if provided
        if (guests) {
            query.maxGuests = { $gte: parseInt(guests) };
        }

        // Get all matching rooms
        let rooms = await Room.find(query);

        // If dates provided, filter out booked rooms
        if (checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);

            // Find all bookings that conflict with the search dates
            const conflictingBookings = await Booking.find({
                status: { $ne: 'cancelled' },
                $or: [
                    { checkInDate: { $lt: end }, checkOutDate: { $gt: start } }
                ]
            }).select('roomId');

            // Get array of booked room IDs
            const bookedRoomIds = conflictingBookings.map(booking => booking.roomId.toString());

            // Filter out booked rooms
            rooms = rooms.filter(room => !bookedRoomIds.includes(room._id.toString()));
        }

        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
