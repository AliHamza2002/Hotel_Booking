// import express from 'express'
// import "dotenv/config";
// import cors from 'cors';
// import connectDB from './configs/Database.js';
// import roomRoutes from './routes/roomRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import bookingRoutes from './routes/bookingRoutes.js';
// import uploadRoutes from './routes/uploadRoutes.js';

// //connectDB()

// const app = express()
// app.use(cors()) //Enable cross-origin resouse sharing

// //Middleware
// app.use(express.json())

// // ✅ CRITICAL: Connect to DB on each request for serverless
// app.use(async (req, res, next) => {
//     try {
//         await connectDB();
//         next();
//     } catch (error) {
//         res.status(500).json({ error: 'Database connection failed' });
//     }
// });

// // API Routes
// app.use('/api/rooms', roomRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/upload', uploadRoutes);

// app.get('/', (req, res) => res.send('Api is working fine'))

// // ✅ STEP 6: 404 handler for unknown routes
// app.use((req, res) => {
//     res.status(404).json({ error: 'Route not found' });
// });

// // const PORT = process.env.PORT || 3000;

// // if (process.env.NODE_ENV !== 'production') {
// //     app.listen(PORT, () => console.log((`server running on port ${PORT}`)));
// // }


// // For local development
// if (process.env.NODE_ENV !== 'production') {
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }
// export default app;



import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/Database.js';
import roomRoutes from './routes/roomRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

// 1. CORS
app.use(cors());

// 2. Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Database Connection (with timeout protection)
app.use(async (req, res, next) => {
    try {
        // Set a timeout for DB connection
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database connection timeout')), 8000)
        );
        
        await Promise.race([connectDB(), timeoutPromise]);
        next();
    } catch (error) {
        console.error('❌ Database middleware error:', error.message);
        return res.status(503).json({ 
            error: 'Service Unavailable',
            message: 'Database connection failed',
            details: error.message
        });
    }
});

// 4. API Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);

// 5. Health Check
app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API is working fine',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 6. 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Global error:', err);
    res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 8. Local Development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// 9. Export for Vercel
export default app;