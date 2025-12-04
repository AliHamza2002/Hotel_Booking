import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Vercel serves this at /api, so we need to handle both /api and /
app.get(['/', '/api'], (req, res) => {
    res.json({
        status: 'OK',
        message: 'API is working without database!',
        timestamp: new Date().toISOString(),
        path: req.path
    });
});

// Rooms endpoint - handle both /rooms and /api/rooms
app.get(['/rooms', '/api/rooms'], (req, res) => {
    res.json({
        rooms: [],
        message: 'Rooms endpoint working (no DB yet)',
        path: req.path
    });
});

// Users endpoint - handle both /users and /api/users
app.get(['/users', '/api/users'], (req, res) => {
    res.json({
        users: [],
        message: 'Users endpoint working (no DB yet)',
        path: req.path
    });
});

export default app;
