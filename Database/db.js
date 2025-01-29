require('dotenv').config();
const {Sequelize}= require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: "ritikhotelmanagementproject.csolpezbn6us.ap-south-1.rds.amazonaws.com",
    port: 5432,
    username: "postgres",
    password: "postgres431",
    database: "Hotel_Management",
    dialectModule: pg, 
    // Other options as needed
    dialectOptions: {
        ssl: {
          require: true, // This will help you. But you will see nwe error
          rejectUnauthorized: false // This line will fix new error
        }
      },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//exporting connection to other files
module.exports = db;