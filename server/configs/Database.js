import mongoose from "mongoose";

// const connectDB =async () =>{
//     try{
//         mongoose.connection.on('connected', ()=> console.log("Database Connected")
//          );
//         await mongoose.connect(`${process.env.MONGODB_URL}/hotel-booking`)
//     } catch(error){
//         console.log(error.message);
        
//     }
// }



let isConnected = false; // Track connection status

const connectDB = async () => {
    // If already connected, reuse the connection
    if (isConnected) {
        console.log('✅ Using existing database connection');
        return;
    }

    // If there's an existing connection in connecting state, wait for it
    if (mongoose.connection.readyState === 1) {
        isConnected = true;
        console.log('✅ Database already connected');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        isConnected = db.connections[0].readyState === 1;
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        isConnected = false;
        throw new Error('Database connection failed');
    }
};

export default connectDB;