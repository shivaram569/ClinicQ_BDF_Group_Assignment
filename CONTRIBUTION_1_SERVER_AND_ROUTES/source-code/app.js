const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const doctorRoutes = require('./routes/doctorRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Welcome & API Status Endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        project: 'ClinicQ Health Centre - Consultation Room Booking System',
        course: 'Backend Development Fundamentals (BDF)',
        group_id: 'YG-AIDE2B-G08',
        version: '1.0.0',
        documentation: {
            doctors: {
                list: 'GET /doctors',
                get_one: 'GET /doctors/:id',
                create: 'POST /doctors',
                update: 'PUT /doctors/:id',
                delete: 'DELETE /doctors/:id'
            },
            rooms: {
                list: 'GET /rooms (supports ?floor=X&status=Y)',
                available: 'GET /rooms/available?date=YYYY-MM-DD (Compulsory Twist)',
                get_one: 'GET /rooms/:id',
                create: 'POST /rooms',
                update: 'PUT /rooms/:id',
                delete: 'DELETE /rooms/:id'
            },
            bookings: {
                list: 'GET /bookings',
                details: 'GET /bookings/details (JOIN with Doctor & Room info)',
                get_one: 'GET /bookings/:id',
                create: 'POST /bookings',
                update: 'PUT /bookings/:id',
                delete: 'DELETE /bookings/:id'
            }
        }
    });
});

// Mount Routes
app.use('/doctors', doctorRoutes);
app.use('/rooms', roomRoutes);
app.use('/bookings', bookingRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
