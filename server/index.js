import express from 'express';
import cors from 'cors';
import connectDB from './configs/Database.js';
import roomRoutes from './routes/roomRoutes.js';

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
    res.json({ message: 'API is working with database!' });
});

// API Routes - adding rooms first
app.use('/api/rooms', roomRoutes);

export default app;
