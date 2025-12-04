import express from 'express';
import cors from 'cors';
import connectDB from '../configs/Database.js';

const app = express();

app.use(cors());
app.use(express.json());

// Simple health check without DB
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});

// Test route with database
app.get('/db-test', async (req, res) => {
    try {
        await connectDB();
        res.json({ message: 'Database connected successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
});

// Simple rooms endpoint without actual routes
app.get('/rooms', async (req, res) => {
    try {
        await connectDB();
        // For now, just return empty array - we'll add the actual Room model later
        res.json({ rooms: [], message: 'Rooms endpoint working (DB connected)' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms', details: error.message });
    }
});

export default app;
