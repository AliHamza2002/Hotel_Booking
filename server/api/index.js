import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API is working without database!',
        timestamp: new Date().toISOString()
    });
});

// Rooms endpoint (no database)
app.get('/rooms', (req, res) => {
    res.json({
        rooms: [],
        message: 'Rooms endpoint working (no DB yet)'
    });
});

// Users endpoint (no database)
app.get('/users', (req, res) => {
    res.json({
        users: [],
        message: 'Users endpoint working (no DB yet)'
    });
});

export default app;
