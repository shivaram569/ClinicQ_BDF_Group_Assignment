// Validation Middleware for ClinicQ Health Centre API

// Helper to validate YYYY-MM-DD
function isValidDate(dateString) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
}

// Helper to validate HH:MM
function isValidTime(timeString) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(timeString);
}

// 1. Doctor Validation
const validateDoctor = (req, res, next) => {
    const { name, specialization, phone } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Doctor name is required and must be a non-empty string.'
        });
    }

    if (!specialization || typeof specialization !== 'string' || specialization.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Specialization is required and must be a non-empty string.'
        });
    }

    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Phone number is required.'
        });
    }

    next();
};

// 2. Room Validation
const validateRoom = (req, res, next) => {
    const { room_number, floor, capacity, status } = req.body;

    if (!room_number || typeof room_number !== 'string' || room_number.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Room number is required and must be a non-empty string.'
        });
    }

    if (floor === undefined || floor === null || isNaN(Number(floor)) || !Number.isInteger(Number(floor))) {
        return res.status(400).json({
            success: false,
            error: 'Floor must be a valid integer.'
        });
    }

    if (capacity === undefined || capacity === null || isNaN(Number(capacity)) || Number(capacity) <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Capacity must be a positive integer greater than zero.'
        });
    }

    if (status && !['available', 'maintenance', 'occupied'].includes(status)) {
        return res.status(400).json({
            success: false,
            error: "Status must be one of: 'available', 'maintenance', 'occupied'."
        });
    }

    next();
};

// 3. Booking Validation (Including Compulsory Twist Date Check)
const validateBooking = (req, res, next) => {
    const { doctor_id, room_id, start_date, end_date, start_time, end_time, status } = req.body;

    // Check required fields
    if (doctor_id === undefined || doctor_id === null || isNaN(Number(doctor_id))) {
        return res.status(400).json({
            success: false,
            error: 'Doctor ID is required and must be a valid integer.'
        });
    }

    if (room_id === undefined || room_id === null || isNaN(Number(room_id))) {
        return res.status(400).json({
            success: false,
            error: 'Room ID is required and must be a valid integer.'
        });
    }

    if (!start_date || !isValidDate(start_date)) {
        return res.status(400).json({
            success: false,
            error: 'Start date is required and must follow the format YYYY-MM-DD.'
        });
    }

    if (!end_date || !isValidDate(end_date)) {
        return res.status(400).json({
            success: false,
            error: 'End date is required and must follow the format YYYY-MM-DD.'
        });
    }

    // COMPULSORY TWIST CHECK: End date cannot be earlier than start date
    if (end_date < start_date) {
        return res.status(400).json({
            success: false,
            error: 'End date cannot be earlier than start date.'
        });
    }

    if (!start_time || !isValidTime(start_time)) {
        return res.status(400).json({
            success: false,
            error: 'Start time is required and must follow 24-hour HH:MM format.'
        });
    }

    if (!end_time || !isValidTime(end_time)) {
        return res.status(400).json({
            success: false,
            error: 'End time is required and must follow 24-hour HH:MM format.'
        });
    }

    // If booking starts and ends on the same date, start_time must be earlier than end_time
    if (start_date === end_date && end_time <= start_time) {
        return res.status(400).json({
            success: false,
            error: 'End time must be later than start time for same-day bookings.'
        });
    }

    if (status && !['active', 'cancelled', 'completed'].includes(status)) {
        return res.status(400).json({
            success: false,
            error: "Booking status must be one of: 'active', 'cancelled', 'completed'."
        });
    }

    next();
};

// 4. Validate Query Parameter for Available Rooms Twist
const validateAvailableRoomsQuery = (req, res, next) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({
            success: false,
            error: 'Query parameter "date" is required (e.g. ?date=YYYY-MM-DD).'
        });
    }

    if (!isValidDate(date)) {
        return res.status(400).json({
            success: false,
            error: 'Query parameter "date" must be a valid calendar date in YYYY-MM-DD format.'
        });
    }

    next();
};

module.exports = {
    validateDoctor,
    validateRoom,
    validateBooking,
    validateAvailableRoomsQuery
};
