import express from 'express'
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/Database.js';
import roomRoutes from './routes/roomRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

//connectDB()

const app = express()
app.use(cors()) //Enable cross-origin resouse sharing

//Middleware
app.use(express.json())

// ✅ CRITICAL: Connect to DB on each request for serverless
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// API Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => res.send('Api is working fine'))

// ✅ STEP 6: 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// const PORT = process.env.PORT || 3000;

// if (process.env.NODE_ENV !== 'production') {
//     app.listen(PORT, () => console.log((`server running on port ${PORT}`)));
// }


// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
export default app;