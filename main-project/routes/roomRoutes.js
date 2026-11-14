const express = require('express');
const router = express.Router();
const {
    getAllRooms,
    getAvailableRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
} = require('../controllers/roomsController');
const { validateRoom, validateAvailableRoomsQuery } = require('../middleware/validate');

// Room Routes
// NOTE: /available route is placed BEFORE /:id route to prevent routing conflict
router.get('/', getAllRooms);
router.get('/available', validateAvailableRoomsQuery, getAvailableRooms);
router.get('/:id', getRoomById);
router.post('/', validateRoom, createRoom);
router.put('/:id', validateRoom, updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;
