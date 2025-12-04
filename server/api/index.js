import express from 'express';
import cors from 'cors';

const app = express();

// CORS
app.use(cors());

// Body Parser
app.use(express.json());

// Simple test routes (no database yet)
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API is working fine',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/test-express', (req, res) => {
    res.json({ message: 'Express is working!' });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path
    });
});

// Export for Vercel
export default app;
