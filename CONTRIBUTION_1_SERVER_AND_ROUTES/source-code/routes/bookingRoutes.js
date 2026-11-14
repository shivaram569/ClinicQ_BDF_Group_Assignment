const express = require('express');
const router = express.Router();
const {
    getAllBookings,
    getBookingDetails,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingsController');
const { validateBooking } = require('../middleware/validate');

// Booking Routes
// NOTE: /details route is placed BEFORE /:id route to prevent routing conflict
router.get('/', getAllBookings);
router.get('/details', getBookingDetails);
router.get('/:id', getBookingById);
router.post('/', validateBooking, createBooking);
router.put('/:id', validateBooking, updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router;
