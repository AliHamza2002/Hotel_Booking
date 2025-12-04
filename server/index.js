import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'API is working!' });
});

app.get('/api/rooms', (req, res) => {
    res.json({ rooms: [] });
});

export default app;
