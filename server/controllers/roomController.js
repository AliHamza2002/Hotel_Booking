import Room from "../model/roomSchema.js";
import User from "../model/userSchema.js";

// Get all available rooms
export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//Search rooms with filters - WITH FUZZY CITY MATCHING
export const searchRooms = async (req, res) => {
    try {
        const { city, roomType, minPrice, maxPrice, amenities, guests } = req.body;

        let filters = { isAvailable: true };
        
        // City filter with FUZZY MATCHING - handles typos!
        if (city) {
            // Create a flexible regex pattern
            const fuzzyPattern = city
                .split('')
                .map(char => `${char}.*`)
                .join('');
            
            filters.$or = [
                // Exact match (case-insensitive)
                { city: { $regex: city, $options: 'i' } },
                // Fuzzy match - allows typos like "parias" for "paris"
                { city: { $regex: fuzzyPattern, $options: 'i' } },
                // Starts with the search term
                { city: { $regex: `^${city}`, $options: 'i' } }
            ];
        }

        //room Type filter
        if (roomType) {
            filters.roomType = roomType;
        }

        // Price range filter (FIXED)
        if (minPrice || maxPrice) {
            filters.pricePerNight = {};
            if (minPrice) filters.pricePerNight.$gte = Number(minPrice);
            if (maxPrice) filters.pricePerNight.$lte = Number(maxPrice);
        }

        if (guests) {
            filters.maxGuests = { $gte: Number(guests) };
        }

        // Amenities filter
        if (amenities) {
            const amenityList = amenities.split(',');
            amenityList.forEach(amenity => {
                filters[`amenities.${amenity.trim()}`] = true;
            });
        }

        const rooms = await Room.find(filters).sort({ pricePerNight: 1 });
        res.status(200).json({ success: true, count: rooms.length, filters: { city, roomType, minPrice, maxPrice, amenities, guests }, data: rooms });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Get single room by ID
export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('ownerId', 'name email phoneNumber');

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        res.status(200).json({
            success: true,
            data: room
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createRoom = async (req, res) => {
    try {
        const { hotelName, hotelDescription, city, roomType, pricePerNight, amenities, maxGuests, images } = req.body;

        if (!hotelName || !hotelDescription || !city || !roomType || !pricePerNight || !maxGuests || !images) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (maxGuests < 1) {
            return res.status(400).json({ success: false, message: "Max guests must be at least 1" });
        }
        // Create room with owner ID from auth middleware
        const room = new Room({
            hotelName,
            hotelDescription,
            city,
            roomType,
            pricePerNight,
            maxGuests,
            amenities: amenities || {},
            images: images || [],
            ownerId: req.userId // From verifyToken middleware
        });

        await room.save();
        res.status(201).json({ success: true, message: 'Room created successfully', data: room });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const updateRoom = async (req, res) => {
    try {
        const room = await Room.findOne({ _id: req.params.id, ownerId: req.userId });
        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }
        // set max guests
        if (req.body.maxGuests && req.body.maxGuests < 1) {
            return res.status(400).json({
                success: false,
                message: 'Maximum guests must be at least 1'
            });
        }

        // Update room fields
        const updateRoom = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findOne({ _id: req.params.id, ownerId: req.userId });
        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }
        await Room.findByIdAndDelete(
            req.params.id,
        );
        res.status(200).json({ success: true, message: "Room deleted successfully" });

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get rooms by owner
export const getMyRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ ownerId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}