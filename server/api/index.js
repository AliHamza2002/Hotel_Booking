import express from 'express';
import cors from 'cors';
import connectDB from '../configs/Database.js';
import roomRoutes from '../routes/roomRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import bookingRoutes from '../routes/bookingRoutes.js';
import uploadRoutes from '../routes/uploadRoutes.js';

const app = express();

// CORS configuration
app.use(cors({
    origin: '*',
    credentials: true
}));

// Middleware
app.use(express.json());

// Connect to DB on each request for serverless (BEFORE routes)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// API Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => res.send('Api is working fine'));
app.get('/api', (req, res) => res.send('Api is working fine'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel serverless
export default (req, res) => {
    return app(req, res);
};
