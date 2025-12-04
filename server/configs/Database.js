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



// let isConnected = false; // Track connection status

// const connectDB = async () => {
//     mongoose.set('strictQuery', true);

//     if (isConnected) {
//         console.log('MongoDB is already connected');
//         return;
//     }

//     try {
//         // Use MONGODB_URL to match user's likely setup
//         await mongoose.connect(`${process.env.MONGODB_URL}/hotel-booking`);
//         isConnected = true;
//         console.log("Database Connected");
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// export default connectDB;


let isConnected = false;

const connectDB = async () => {
    // Prevent multiple connections
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('✅ Using existing database connection');
        return;
    }

    // If mongoose is connecting, wait for it
    if (mongoose.connection.readyState === 2) {
        console.log('⏳ Database connection in progress...');
        await new Promise(resolve => {
            mongoose.connection.once('connected', resolve);
        });
        isConnected = true;
        return;
    }

    try {
        console.log('🔄 Attempting database connection...');

        const db = await mongoose.connect(`${process.env.MONGODB_URL}/hotel-booking`, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4, skip trying IPv6
        });

        isConnected = db.connections[0].readyState === 1;
        console.log('✅ MongoDB connected successfully');

    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        isConnected = false;
        throw new Error(`Database connection failed: ${error.message}`);
    }
};

export default connectDB;