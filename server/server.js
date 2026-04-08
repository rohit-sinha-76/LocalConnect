require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const errorMiddleware = require('./src/middleware/errorMiddleware');
const healthRoutes = require('./src/routes/healthRoutes');
const authRoutes = require('./src/routes/authRoutes');
const workerRoutes = require('./src/routes/workerRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const { expireBookings } = require('./src/services/bookingService');
const reviewRoutes = require('./src/routes/reviewRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling middleware (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Run booking expiry check every 10 minutes
  setInterval(async () => {
    try {
      const result = await expireBookings();
      if (result.modifiedCount > 0) {
        console.log(`[Booking] Expired ${result.modifiedCount} booking(s)`);
      }
    } catch (error) {
      console.error(`[Booking] Error expiring bookings: ${error.message}`);
    }
  }, 10 * 60 * 1000);
});
