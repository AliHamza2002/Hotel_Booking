import express from 'express';
import cors from 'cors';
import connectDB from './configs/Database.js';
import roomRoutes from './routes/roomRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Connect to database on each request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
});

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'API is working!' });
});

// API Routes - adding rooms and users
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);

export default app;
