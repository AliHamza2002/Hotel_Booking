import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Root route (for /api)
app.get('/', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Rooms route (for /api/rooms)
app.get('/rooms', (req, res) => {
    res.json({ rooms: [], message: 'Rooms endpoint working - no DB yet' });
});

// Test route
app.get('/test-express', (req, res) => {
    res.json({ message: 'Express test route working!' });
});

export default app;
