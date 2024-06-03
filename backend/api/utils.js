const getPool = require("../database_connection");
const queries = require("./queries");

const allowedTables = ["Notes", "TodoItems", "TimeTrackerItems", "Appointments"];


const checkUserExists = async (userEmail) => {
    const pool = await getPool();
    
    return new Promise((resolve, reject) => {
        pool.query(queries.getUser, [userEmail], (error, results) => {
            if (error) {
                return reject(new Error('Error executing query'));
            }
            if (results.rows.length === 0) {
                return resolve(false);
            }
            resolve(true);
        });
    });
};

module.exports = {
    allowedTables, 
    checkUserExists,
};