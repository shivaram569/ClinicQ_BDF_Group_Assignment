const { dbAsync } = require('../config/db');

// Helper to check for overlapping active bookings in a given room
async function checkBookingOverlap(roomId, startDate, endDate, startTime, endTime, excludeBookingId = null) {
    let sql = `
        SELECT b.*, d.name as doctor_name, r.room_number
        FROM bookings b
        JOIN doctors d ON b.doctor_id = d.id
        JOIN rooms r ON b.room_id = r.id
        WHERE b.room_id = ?
          AND b.status = 'active'
          AND (b.start_date <= ? AND b.end_date >= ?)
          AND (b.start_time < ? AND b.end_time > ?)
    `;
    const params = [roomId, endDate, startDate, endTime, startTime];

    if (excludeBookingId) {
        sql += ' AND b.id != ?';
        params.push(excludeBookingId);
    }

    return await dbAsync.all(sql, params);
}

// GET /bookings - Retrieve all bookings (optional filtering by room_id, doctor_id, status)
const getAllBookings = async (req, res, next) => {
    try {
        const { room_id, doctor_id, status } = req.query;
        let sql = 'SELECT * FROM bookings WHERE 1=1';
        const params = [];

        if (room_id) {
            sql += ' AND room_id = ?';
            params.push(room_id);
        }
        if (doctor_id) {
            sql += ' AND doctor_id = ?';
            params.push(doctor_id);
        }
        if (status) {
            sql += ' AND status = ?';
            params.push(status);
        }

        sql += ' ORDER BY start_date DESC, start_time ASC';

        const bookings = await dbAsync.all(sql, params);
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        next(err);
    }
};

// GET /bookings/details - MANDATORY JOIN ENDPOINT
// Returns booking information joined with doctor name and room number
const getBookingDetails = async (req, res, next) => {
    try {
        const sql = `
            SELECT 
                b.id AS booking_id,
                b.doctor_id,
                d.name AS doctor_name,
                d.specialization AS doctor_specialization,
                b.room_id,
                r.room_number,
                r.floor AS room_floor,
                b.start_date,
                b.end_date,
                b.start_time,
                b.end_time,
                b.status AS booking_status,
                b.created_at
            FROM bookings b
            INNER JOIN doctors d ON b.doctor_id = d.id
            INNER JOIN rooms r ON b.room_id = r.id
            ORDER BY b.start_date DESC, b.start_time ASC
        `;

        const details = await dbAsync.all(sql);

        res.status(200).json({
            success: true,
            count: details.length,
            data: details
        });
    } catch (err) {
        next(err);
    }
};

// GET /bookings/:id - Retrieve booking by ID
const getBookingById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const booking = await dbAsync.get('SELECT * FROM bookings WHERE id = ?', [id]);

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: `Booking with ID ${id} not found.`
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (err) {
        next(err);
    }
};

// POST /bookings - Create a new booking
const createBooking = async (req, res, next) => {
    try {
        const { doctor_id, room_id, start_date, end_date, start_time, end_time, status = 'active' } = req.body;

        // Verify doctor exists
        const doctor = await dbAsync.get('SELECT id, name FROM doctors WHERE id = ?', [doctor_id]);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                error: `Doctor with ID ${doctor_id} not found.`
            });
        }

        // Verify room exists
        const room = await dbAsync.get('SELECT id, room_number, status FROM rooms WHERE id = ?', [room_id]);
        if (!room) {
            return res.status(404).json({
                success: false,
                error: `Room with ID ${room_id} not found.`
            });
        }

        // Check if room is in maintenance
        if (room.status === 'maintenance') {
            return res.status(400).json({
                success: false,
                error: `Room "${room.room_number}" is currently under maintenance and cannot be booked.`
            });
        }

        // Check for conflicting overlapping active bookings in the same room
        const conflicts = await checkBookingOverlap(room_id, start_date, end_date, start_time, end_time);
        if (conflicts.length > 0) {
            const conflict = conflicts[0];
            return res.status(409).json({
                success: false,
                error: 'Room is already booked for the selected date and time interval.',
                conflict_details: {
                    conflicting_booking_id: conflict.id,
                    room_number: conflict.room_number,
                    booked_by: conflict.doctor_name,
                    date_range: `${conflict.start_date} to ${conflict.end_date}`,
                    time_interval: `${conflict.start_time} - ${conflict.end_time}`
                }
            });
        }

        const result = await dbAsync.run(
            `INSERT INTO bookings (doctor_id, room_id, start_date, end_date, start_time, end_time, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [doctor_id, room_id, start_date, end_date, start_time, end_time, status]
        );

        const newBooking = await dbAsync.get('SELECT * FROM bookings WHERE id = ?', [result.lastID]);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully.',
            data: newBooking
        });
    } catch (err) {
        next(err);
    }
};

// PUT /bookings/:id - Update an existing booking
const updateBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { doctor_id, room_id, start_date, end_date, start_time, end_time, status } = req.body;

        const existing = await dbAsync.get('SELECT * FROM bookings WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: `Booking with ID ${id} not found.`
            });
        }

        const targetDoctorId = doctor_id !== undefined ? doctor_id : existing.doctor_id;
        const targetRoomId = room_id !== undefined ? room_id : existing.room_id;
        const targetStartDate = start_date || existing.start_date;
        const targetEndDate = end_date || existing.end_date;
        const targetStartTime = start_time || existing.start_time;
        const targetEndTime = end_time || existing.end_time;
        const targetStatus = status || existing.status;

        // Verify doctor exists
        const doctor = await dbAsync.get('SELECT id FROM doctors WHERE id = ?', [targetDoctorId]);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                error: `Doctor with ID ${targetDoctorId} not found.`
            });
        }

        // Verify room exists
        const room = await dbAsync.get('SELECT id, room_number, status FROM rooms WHERE id = ?', [targetRoomId]);
        if (!room) {
            return res.status(404).json({
                success: false,
                error: `Room with ID ${targetRoomId} not found.`
            });
        }

        // Check for conflicts if booking is active
        if (targetStatus === 'active') {
            const conflicts = await checkBookingOverlap(
                targetRoomId,
                targetStartDate,
                targetEndDate,
                targetStartTime,
                targetEndTime,
                id // exclude current booking from conflict check
            );

            if (conflicts.length > 0) {
                const conflict = conflicts[0];
                return res.status(409).json({
                    success: false,
                    error: 'Room is already booked for the selected date and time interval.',
                    conflict_details: {
                        conflicting_booking_id: conflict.id,
                        room_number: conflict.room_number,
                        booked_by: conflict.doctor_name,
                        date_range: `${conflict.start_date} to ${conflict.end_date}`,
                        time_interval: `${conflict.start_time} - ${conflict.end_time}`
                    }
                });
            }
        }

        await dbAsync.run(
            `UPDATE bookings
             SET doctor_id = ?, room_id = ?, start_date = ?, end_date = ?, start_time = ?, end_time = ?, status = ?
             WHERE id = ?`,
            [targetDoctorId, targetRoomId, targetStartDate, targetEndDate, targetStartTime, targetEndTime, targetStatus, id]
        );

        const updatedBooking = await dbAsync.get('SELECT * FROM bookings WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'Booking updated successfully.',
            data: updatedBooking
        });
    } catch (err) {
        next(err);
    }
};

// DELETE /bookings/:id - Delete a booking
const deleteBooking = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await dbAsync.get('SELECT * FROM bookings WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: `Booking with ID ${id} not found.`
            });
        }

        await dbAsync.run('DELETE FROM bookings WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: `Booking with ID ${id} deleted successfully.`
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllBookings,
    getBookingDetails,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
};
