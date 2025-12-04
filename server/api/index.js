import express from 'express';
import cors from 'cors';
import connectDB from '../configs/Database.js';
import roomRoutes from '../routes/roomRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import bookingRoutes from '../routes/bookingRoutes.js';
import uploadRoutes from '../routes/uploadRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Database middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Actual routes
app.use('/rooms', roomRoutes);
app.use('/users', userRoutes);
app.use('/bookings', bookingRoutes);
app.use('/upload', uploadRoutes);

export default app;
