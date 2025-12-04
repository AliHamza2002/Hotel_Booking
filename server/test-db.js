import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log(`URL: ${process.env.MONGODB_URL}/hotel-booking`);
        await mongoose.connect(`${process.env.MONGODB_URL}/hotel-booking`);
        console.log("Database Connected Successfully!");

        const bookingSchema = new mongoose.Schema({}, { strict: false });
        const Booking = mongoose.model('Booking', bookingSchema);

        const bookings = await Booking.find({});
        console.log(`Found ${bookings.length} bookings in the database.`);
        if (bookings.length > 0) {
            console.log("Booking ID:", bookings[0]._id);
            console.log("Room ID:", bookings[0].roomId);
            console.log("User ID:", bookings[0].userId);

            const roomSchema = new mongoose.Schema({}, { strict: false });
            const Room = mongoose.model('Room', roomSchema);
            const room = await Room.findById(bookings[0].roomId);
            if (room) {
                console.log("Room Owner ID:", room.ownerId);
                console.log("Booking User ID:", bookings[0].userId);

                if (room.ownerId.toString() === bookings[0].userId.toString()) {
                    console.log("MATCH: The user who booked IS the owner of the room.");
                } else {
                    console.log("MISMATCH: The user who booked is NOT the owner.");
                    console.log("To see this in Owner Dashboard, you must log in as:", room.ownerId);
                }
            } else {
                console.log("Room not found for this booking");
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("Database Connection Failed:");
        console.error(error.message);
        process.exit(1);
    }
}

connectDB();
