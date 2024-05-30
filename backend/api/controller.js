const pool = require("../database_connection");
const queries = require("./queries");
const { getUserEmail } = require("./cognito_utils.js");

const getUserNotes= async (req, res) => {
    const userEmail = await getUserEmail();
    pool.query(queries.getUserNotesQuery, [userEmail], (error, results) => {
        if (error) {
            console.error('Error executing query', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'No notes found for the specified user email' });
        }
        res.status(200).json(results.rows);
    });
};

const getUserTodoItems= async (req, res) => {
    const userEmail = await getUserEmail();
    pool.query(queries.getUserTodoItems, [userEmail], (error, results) => {
        if (error) {
            console.error('Error executing query', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'No todo items found for the specified user email' });
        }
        res.status(200).json(results.rows);
    });
};

const getUserTimeTrackerItems = async (req, res) => {
    const userEmail = await getUserEmail();
    pool.query(queries.getUserTimeTrackerItems, [userEmail], (error, results) => {
        if (error) {
            console.error('Error executing query', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'No time tracker items found for the specified user email' });
        }
        res.status(200).json(results.rows);
    });
};

module.exports = {
    getUserNotes,
    getUserTodoItems,
    getUserTimeTrackerItems,
};