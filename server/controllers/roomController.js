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

// Helper function for Levenshtein distance
const levenshteinDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
};

//Search rooms with filters - WITH FUZZY CITY MATCHING
export const searchRooms = async (req, res) => {
    try {
        const { city, roomType, minPrice, maxPrice, amenities, guests } = req.body;

        let filters = { isAvailable: true };

        // City filter with LEVENSHTEIN DISTANCE
        if (city) {
            // 1. Get all distinct cities from DB
            const distinctCities = await Room.distinct('city');

            // 2. Find the best matching city using Levenshtein distance
            // We look for a city that is "close enough"
            const searchCity = city.toLowerCase();

            // Find all cities that are close matches (distance <= 3)
            const matchedCities = distinctCities.filter(dbCity => {
                const dbCityLower = dbCity.toLowerCase();

                // Direct match or contains
                if (dbCityLower.includes(searchCity) || searchCity.includes(dbCityLower)) return true;

                // Levenshtein distance
                const distance = levenshteinDistance(searchCity, dbCityLower);
                return distance <= 3; // Allow up to 3 typos
            });

            if (matchedCities.length > 0) {
                // Filter by ANY of the matched cities
                filters.city = { $in: matchedCities };
            } else {
                // Fallback to regex if no close match found
                filters.city = { $regex: city, $options: 'i' };
            }
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