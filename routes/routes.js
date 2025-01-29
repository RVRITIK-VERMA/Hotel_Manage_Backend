const express = require('express');
const router = express.Router();
const { getOwnerDetails, registerOwner, getAllUsers } = require('../Controllers/ownerController');
const { getOptimalRooms, getAllRoomsForHotel,getRandomRoomsForAdmin,getCountOfVacantRoom } = require('../Controllers/roomAllocationController');

//routes
router.post('/api/owner/getOwnerData', getOwnerDetails);
router.post('/api/owner/register', registerOwner);
router.get('/api/owner/getAllUsers', getAllUsers);
router.post('/api/rooms/optimalRooms', getOptimalRooms);
router.get('/api/rooms/getAllRooms', getAllRoomsForHotel);
router.post('/api/rooms/getRandomRooms', getRandomRoomsForAdmin);
router.get('/api/rooms/getCountOfVacantRoom', getCountOfVacantRoom);

module.exports = router;