const { dbAsync } = require('../config/db');

// GET /rooms - Retrieve all rooms, with optional query filtering (e.g. ?floor=2, ?status=available)
const getAllRooms = async (req, res, next) => {
    try {
        const { floor, status } = req.query;
        let sql = 'SELECT * FROM rooms WHERE 1=1';
        const params = [];

        if (floor !== undefined) {
            const parsedFloor = parseInt(floor, 10);
            if (isNaN(parsedFloor)) {
                return res.status(400).json({
                    success: false,
                    error: 'Query parameter "floor" must be an integer.'
                });
            }
            sql += ' AND floor = ?';
            params.push(parsedFloor);
        }

        if (status) {
            sql += ' AND status = ?';
            params.push(status.trim().toLowerCase());
        }

        sql += ' ORDER BY floor ASC, room_number ASC';

        const rooms = await dbAsync.all(sql, params);
        res.status(200).json({
            success: true,
            count: rooms.length,
            filters: { floor: floor || null, status: status || null },
            data: rooms
        });
    } catch (err) {
        next(err);
    }
};

// GET /rooms/available?date=YYYY-MM-DD - ASSIGNMENT TWIST ENDPOINT
// Returns all rooms that have no active booking covering the requested date.
const getAvailableRooms = async (req, res, next) => {
    try {
        const { date } = req.query;

        // SQL NOT EXISTS query: finds rooms that have NO active bookings covering requested date
        const sql = `
            SELECT r.*
            FROM rooms r
            WHERE r.status = 'available'
            AND NOT EXISTS (
                SELECT 1 
                FROM bookings b
                WHERE b.room_id = r.id
                  AND b.status = 'active'
                  AND b.start_date <= ?
                  AND b.end_date >= ?
            )
            ORDER BY r.floor ASC, r.room_number ASC
        `;

        const availableRooms = await dbAsync.all(sql, [date, date]);

        res.status(200).json({
            success: true,
            requested_date: date,
            available_count: availableRooms.length,
            data: availableRooms
        });
    } catch (err) {
        next(err);
    }
};

// GET /rooms/:id - Retrieve room by ID
const getRoomById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const room = await dbAsync.get('SELECT * FROM rooms WHERE id = ?', [id]);

        if (!room) {
            return res.status(404).json({
                success: false,
                error: `Room with ID ${id} not found.`
            });
        }

        res.status(200).json({
            success: true,
            data: room
        });
    } catch (err) {
        next(err);
    }
};

// POST /rooms - Create a new room
const createRoom = async (req, res, next) => {
    try {
        const { room_number, floor, capacity, status = 'available' } = req.body;

        // Check for duplicate room number
        const existing = await dbAsync.get('SELECT id FROM rooms WHERE room_number = ?', [room_number.trim()]);
        if (existing) {
            return res.status(409).json({
                success: false,
                error: `A room with room number "${room_number}" already exists.`
            });
        }

        const result = await dbAsync.run(
            'INSERT INTO rooms (room_number, floor, capacity, status) VALUES (?, ?, ?, ?)',
            [room_number.trim(), parseInt(floor, 10), parseInt(capacity, 10), status]
        );

        const newRoom = await dbAsync.get('SELECT * FROM rooms WHERE id = ?', [result.lastID]);

        res.status(201).json({
            success: true,
            message: 'Room created successfully.',
            data: newRoom
        });
    } catch (err) {
        next(err);
    }
};

// PUT /rooms/:id - Update an existing room
const updateRoom = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { room_number, floor, capacity, status } = req.body;

        const existing = await dbAsync.get('SELECT * FROM rooms WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: `Room with ID ${id} not found.`
            });
        }

        // Check if updating to an existing room number of another room
        if (room_number && room_number.trim() !== existing.room_number) {
            const duplicate = await dbAsync.get('SELECT id FROM rooms WHERE room_number = ? AND id != ?', [room_number.trim(), id]);
            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    error: `A room with room number "${room_number}" already exists.`
                });
            }
        }

        const updatedRoomNumber = room_number ? room_number.trim() : existing.room_number;
        const updatedFloor = floor !== undefined ? parseInt(floor, 10) : existing.floor;
        const updatedCapacity = capacity !== undefined ? parseInt(capacity, 10) : existing.capacity;
        const updatedStatus = status ? status : existing.status;

        await dbAsync.run(
            'UPDATE rooms SET room_number = ?, floor = ?, capacity = ?, status = ? WHERE id = ?',
            [updatedRoomNumber, updatedFloor, updatedCapacity, updatedStatus, id]
        );

        const updatedRoom = await dbAsync.get('SELECT * FROM rooms WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'Room updated successfully.',
            data: updatedRoom
        });
    } catch (err) {
        next(err);
    }
};

// DELETE /rooms/:id - Delete a room
const deleteRoom = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await dbAsync.get('SELECT * FROM rooms WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: `Room with ID ${id} not found.`
            });
        }

        await dbAsync.run('DELETE FROM rooms WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: `Room with ID ${id} deleted successfully.`
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllRooms,
    getAvailableRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
};
