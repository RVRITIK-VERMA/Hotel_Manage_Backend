const { QueryTypes } = require('sequelize');
const sequelize = require('../Database/db');

// Retrieve owner details
const getOwnerDetails = async (req, res) => {
    const { ownerName } = req.body;

    try {
        const ownerDetails = await sequelize.query(
            'SELECT * FROM get_registration_data(:p_owner_name)',
            {
                replacements: { p_owner_name: ownerName },
                type: QueryTypes.SELECT
            }
        );

        if (ownerDetails.length > 0) {
            res.status(200).json({status: true, result: ownerDetails[0]});
        } else {
            res.status(200).json({status: false, result: 'Owner not found' });
        }
    } catch (error) {
        console.error('Error retrieving owner details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Register/update a new owner
const registerOwner = async (req,res)=>{
    const {action, name, roomsBooked, totalBooked} = req.body;

    try{
        const result = await sequelize.query(
            'Call Insert_Update_hotel_Data (:p_action,:p_name,:p_rooms_booked,:p_total_booked,:p_status)',{
                replacements:{
                    p_action:action,
                    p_name:name,
                    p_rooms_booked:roomsBooked,
                    p_total_booked:totalBooked,
                    p_status:null
                }, type: QueryTypes.SELECT
            });

        if (result != undefined && result.length > 0) {
            console.log(result[0].p_status);
            res.status(200).json({ status: true, result: result[0].p_status });
        }
        else {
            res.status(400).json({ status: false, result: "Error in registering owner" });
        }
    }
    catch(error){
        console.error('Error registering owner:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}


//Extract All users
const getAllUsers = async (req, res) => {

    try {
        const userDetails = await sequelize.query(
            'SELECT * FROM get_user_data()',
            {
                type: QueryTypes.SELECT
            }
        );
        if (userDetails.length > 0) {
            res.status(200).json({status: true, result: userDetails});
        } else {
            res.status(200).json({status: false, result: 'user not found' });
        }
    } catch (error) {
        console.error('Error retrieving owner details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getOwnerDetails,
    registerOwner,
    getAllUsers
    
};