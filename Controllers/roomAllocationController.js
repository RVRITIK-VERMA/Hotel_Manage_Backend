const { QueryTypes } = require('sequelize');
const sequelize = require('../Database/db');


// Retrieve all room details
const getAllRoomsForHotel = async (req, res) => {
    try {
        const allRooms = await sequelize.query(
            "SELECT * FROM get_room_data_for_hotel ('get_all_rooms', NULL,NULL)",
            { type: QueryTypes.SELECT }
        );

        if (allRooms.length > 0) {
            res.status(200).json({
                status: true,
                message: 'All room data retrieved successfully.',
                result: allRooms,
            });
        } else {
            res.status(404).json({
                status: false,
                message: 'No rooms found in the hotel.',
            });
        }
    } catch (error) {
        console.error('Error retrieving room details:', error);
        res.status(500).json({
            status: false,
            message: 'Internal server error.',
            error: error.message,
        });
    }
};


// Retrieve all room details
const getCountOfVacantRoom = async (req, res) => {
    try {
        const allRooms = await sequelize.query(
            "SELECT * FROM get_room_data_for_hotel ('get_count_of_all_vacant_rooms', NULL,NULL)",
            { type: QueryTypes.SELECT }
        );

        if (allRooms.length > 0) {
            res.status(200).json({
                status: true,
                message: 'Count retrieved successfully.',
                result: allRooms,
            });
        } else {
            res.status(404).json({
                status: false,
                message: 'No vacant rooms found in the hotel.',
            });
        }
    } catch (error) {
        console.error('Error retrieving room details:', error);
        res.status(500).json({
            status: false,
            message: 'Internal server error.',
            error: error.message,
        });
    }
};

// Retrieve random room details
const getRandomRoomsForAdmin = async (req, res) => {
    const { numberOfRooms } = req.body;
    try {
        const allRooms = await sequelize.query(
            "SELECT * FROM get_room_data_for_hotel (?,?,?)", 
            { replacements:['get_random_vacant_rooms',0,numberOfRooms],type: QueryTypes.SELECT }
        );

        if (allRooms.length > 0) {
            res.status(200).json({
                status: true,
                message: 'All room data retrieved successfully.',
                result: allRooms,
            });
        } else {
            res.status(404).json({
                status: false,
                message: 'No rooms found in the hotel.',
            });
        }
    } catch (error) {
        console.error('Error retrieving room details:', error);
        res.status(500).json({
            status: false,
            message: 'Internal server error.',
            error: error.message,
        });
    }
};

// // Retrieve optimal room allocation (recusive currently taking too much time)
// const getOptimalRooms = async (req, res) => {
//     const { numberOfRooms } = req.body;
//     try {
//         const groupedRooms = await sequelize.query(
//             "SELECT * FROM get_room_data_for_hotel ('get_vacant_rooms_grouped_by_floor', NULL)",
//             { type: QueryTypes.SELECT }
//         );

//         if (groupedRooms.length === 0) {
//             return res.status(404).json({ message: 'No vacant rooms available.' });
//         }

//         // Parsing the grouped rooms data
//         const roomsByFloor = groupedRooms.reduce((acc, floorData) => {
//             acc[floorData.floor_number] = floorData.available_rooms
//                 ? floorData.available_rooms.split(',').map(Number)
//                 : [];
//             return acc;
//         }, {});

//         // Function to calculate travel time
//         const calculateTravelTime = (rooms) => {
//             let totalTime = 0;

//             for (let i = 1; i < rooms.length; i++) {
//                 const prevRoom = rooms[i - 1];
//                 const currentRoom = rooms[i];

//                 if (prevRoom.floor === currentRoom.floor) {
//                     // Horizontal travel
//                     totalTime += Math.abs(currentRoom.room - prevRoom.room);
//                 } else {
//                     // Vertical travel
//                     const verticalTime = Math.abs(currentRoom.floor - prevRoom.floor) * 2;
//                     totalTime += verticalTime;
//                 }
//             }

//             return totalTime;
//         };

//         // Recursive function to find the optimal room allocation
//         const findOptimalRoomsRecursive = (floors, temp = [], remaining = numberOfRooms) => {
//             if (remaining === 0) {
//                 // Base case: Calculate travel time and store the result
//                 const travelTime = calculateTravelTime(temp);
//                 return { rooms: [...temp], travelTime };
//             }

//             console.log("step 0 (floors): ",floors);

//             let optimal = { rooms: [], travelTime: Infinity };

//             //same floor availability
//             for (const floor in floors) {
//                 if (floors[floor].length >= remaining) {
//                 const sameFloorRooms = floors[floor].slice(0, remaining);
//                 const roomsWithFloor = sameFloorRooms.map(room => ({ floor: parseInt(floor), room })); // Correctly create objects
//                 const travelTime = calculateTravelTime(roomsWithFloor); // Now this works correctly
//                 return { rooms: sameFloorRooms.map(room => ({ floor: parseInt(floor), room })), travelTime };
//                 }
//             }

//             for (let floor of Object.keys(floors)) {
//                 const availableRooms = floors[floor];
//                 //console.log("Step 1 (availroom): ",availableRooms);
//                 for (let i = 0; i < availableRooms.length; i++) {
//                     const room = { floor: parseInt(floor), room: availableRooms[i] };

//                     //console.log("Step 2(room): ",room);
//                     // Choose a room
//                     temp.push(room);
//                     floors[floor].splice(i, 1);

//                     //console.log("step 2.1(new floors):",floors);

//                     // Recurse for remaining rooms
//                     const result = findOptimalRooms(floors, temp, remaining - 1);

//                     // Compare results
//                     if (result.travelTime < optimal.travelTime) {
//                         optimal = result;
//                     }

//                     // Backtrack
//                     temp.pop();
//                     floors[floor].splice(i, 0, room.room);
//                 }
//             }

//             return optimal;
//         };

//         // Find optimal allocation

//         const findOptimalRooms = (floors, numberOfRooms) => {
//             // Check for same-floor optimization FIRST
//             // for (const floor in floors) {
//             //     if (floors[floor].length >= numberOfRooms) {
//             //         const sameFloorRooms = floors[floor].slice(0, numberOfRooms).sort((a, b) => a - b); // Sort rooms for correct travel time
//             //         const roomsWithFloor = sameFloorRooms.map(room => ({ floor: parseInt(floor), room }));
//             //         const travelTime = calculateTravelTime(roomsWithFloor);
//             //         return { rooms: roomsWithFloor, travelTime };
//             //     }
//             // }
    
//             for (const floor in floors) {
//                 if (floors[floor].length >= numberOfRooms) {
//                     const sameFloorRooms = floors[floor].slice(0, numberOfRooms);
//                     let minTravelTime = Infinity;
//                     let bestRooms = [];

//                     // Iterate through possible combinations on the same floor
//                     for (let i = 0; i < sameFloorRooms.length - numberOfRooms + 1; i++) {
//                         const currentRooms = sameFloorRooms.slice(i, i + numberOfRooms);
//                         const travelTime = calculateTravelTime(currentRooms.map(room => ({ floor: parseInt(floor), room })));
//                         if (travelTime < minTravelTime) {
//                             minTravelTime = travelTime;
//                             bestRooms = currentRooms.map(room => ({ floor: parseInt(floor), room }));
//                         }
//                     }

//                     // If a solution is found on the same floor, return it immediately
//                     if (minTravelTime !== Infinity) {
//                         return { rooms: bestRooms, travelTime: minTravelTime };
//                     }
//                 }
//             }
//             // If no single floor has enough rooms, THEN proceed with recursive search
//             return findOptimalRoomsRecursive(floors, [], numberOfRooms);
//         }

//         const optimalResult = findOptimalRooms(roomsByFloor);
//         console.log("Optimal result *******************",optimalResult);
//         if (optimalResult.rooms.length === 0) {
//             return res.status(400).json({ message: 'Unable to allocate the requested number of rooms.' });
//         }

//         res.status(200).json({
//             status: true, result:optimalResult.rooms.map(room => ({
//                 roomNumber: room.room,
//                 floorNumber: room.floor,
//             })),
//             totalTravelTime: optimalResult.travelTime,
//         });
//     } catch (error) {
//         console.error('Error retrieving optimal room allocation:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// Retrieve optimal room allocation
const getOptimalRooms = async (req, res) => {
    const { numberOfRooms } = req.body;
    try {
        const groupedRooms = await sequelize.query(
            "SELECT * FROM get_room_data_for_hotel ('get_vacant_rooms_grouped_by_floor', NULL,NULL)",
            { type: QueryTypes.SELECT }
        );

        if (groupedRooms.length === 0) {
            return res.status(404).json({ message: 'No vacant rooms available.' });
        }

        const roomsByFloor = groupedRooms.reduce((acc, floorData) => {
            acc[floorData.floor_number] = floorData.available_rooms
                ? floorData.available_rooms.split(',').map(Number).sort((a, b) => a - b) 
                : [];
            return acc;
        }, {});

        // Function to calculate travel time
        const calculateTravelTime = (rooms) => {
            let totalTime = 0;
            for (let i = 1; i < rooms.length; i++) {
                const prevRoom = rooms[i - 1];
                const currentRoom = rooms[i];
                if (prevRoom.floor === currentRoom.floor) {
                    // Horizontal travel
                    totalTime += Math.abs(currentRoom.room - prevRoom.room);
                } else {
                    // Vertical travel (2 seconds per floor difference)
                    totalTime += Math.abs(currentRoom.floor - prevRoom.floor) * 2;
                }
            }
            return totalTime;
        };

        // Find the best rooms on the same floor
        const findBestSameFloorRooms = (floors, numberOfRooms) => {
            let optimalRooms = [];
            let minTravelTime = Infinity;

            for (const floor in floors) {
                const availableRooms = floors[floor];
                if (availableRooms.length >= numberOfRooms) {
                    // Check all possible combinations of contiguous rooms
                    for (let i = 0; i <= availableRooms.length - numberOfRooms; i++) {
                        const currentRooms = availableRooms.slice(i, i + numberOfRooms);
                        const travelTime = calculateTravelTime(currentRooms.map(room => ({ floor: parseInt(floor), room })));
                        if (travelTime < minTravelTime) {
                            minTravelTime = travelTime;
                            optimalRooms = currentRooms.map(room => ({ floor: parseInt(floor), room }));
                        }
                    }
                }
            }

            return { rooms: optimalRooms, travelTime: minTravelTime };
        };

        // Find the best rooms across multiple floors
        const findBestMultiFloorRooms = (floors, numberOfRooms) => {
            const allRooms = [];
            for (const floor in floors) {
                const floorRooms = floors[floor].map(room => ({ floor: parseInt(floor), room }));
                allRooms.push(...floorRooms);
            }

            // Sort rooms by floor and room number for minimal travel time
            allRooms.sort((a, b) => a.floor === b.floor ? a.room - b.room : a.floor - b.floor);

            let optimalRooms = [];
            let minTravelTime = Infinity;

            // find the best combination
            for (let i = 0; i <= allRooms.length - numberOfRooms; i++) {
                const currentRooms = allRooms.slice(i, i + numberOfRooms);
                const travelTime = calculateTravelTime(currentRooms);
                if (travelTime < minTravelTime) {
                    minTravelTime = travelTime;
                    optimalRooms = currentRooms;
                }
            }

            return { rooms: optimalRooms, travelTime: minTravelTime };
        };

        // First optimal rooms on the same floor
        let optimalResult = findBestSameFloorRooms(roomsByFloor, numberOfRooms);

        // If no suitable rooms are found on the same floor, consider multi-floor allocation
        if (optimalResult.rooms.length === 0) {
            optimalResult = findBestMultiFloorRooms(roomsByFloor, numberOfRooms);
        }

        if (optimalResult.rooms.length === 0) {
            return res.status(400).json({ message: 'Unable to allocate the requested number of rooms.' });
        }

        res.status(200).json({
            status: true,
            result: optimalResult.rooms.map(room => ({
                roomNumber: room.room,
                floorNumber: room.floor,
            })),
            totalTravelTime: optimalResult.travelTime,
        });
    } catch (error) {
        console.error('Error retrieving optimal room allocation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { getOptimalRooms,getAllRoomsForHotel,getRandomRoomsForAdmin ,getCountOfVacantRoom};
