import express from 'express';
import cors from 'cors';
import connectDB from './configs/Database.js';

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

// Test DB connection
app.get('/api/test-db', async (req, res) => {
    res.json({ message: 'Database connected successfully!' });
});

// Simple rooms endpoint (no routes file yet)
app.get('/api/rooms', (req, res) => {
    res.json({ rooms: [], message: 'Rooms endpoint - DB connected' });
});

export default app;
