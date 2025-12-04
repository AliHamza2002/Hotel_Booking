import express from 'express'
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/Database.js';
import roomRoutes from './routes/roomRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

connectDB()

const app = express()
app.use(cors()) //Enable cross-origin resouse sharing

//Middleware
app.use(express.json())

// API Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => res.send('Api is working fine'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log((`server running on port ${PORT}`)));