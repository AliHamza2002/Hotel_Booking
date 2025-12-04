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
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    }

    try {
        // Use MONGODB_URL to match user's likely setup
        await mongoose.connect(`${process.env.MONGODB_URL}/hotel-booking`);
        isConnected = true;
        console.log("Database Connected");
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;