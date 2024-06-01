const pool = require("../database_connection");
const queries = require("./queries");
const { getUserEmail } = require("./cognito_utils.js");
const { allowedTables, checkUserExists } = require("./utils.js");


const getUserNotes = async (req, res) => {
    try {
        const userEmail = await getUserEmail();
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        pool.query(queries.getUserNotes, [userEmail], (error, results) => {
            if (error) {
                console.error('Error executing query', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.rows.length === 0) {
                return res.status(404).json({ error: 'No notes found for the specified user' });
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        console.error('Error getting user email', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserTodoItems = async (req, res) => {
    try {
        const userEmail = await getUserEmail();
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        pool.query(queries.getUserTodoItems, [userEmail], (error, results) => {
            if (error) {
                console.error('Error executing query', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.rows.length === 0) {
                return res.status(404).json({ error: 'No todo items found for the specified user' });
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        console.error('Error getting user email', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserTimeTrackerItems = async (req, res) => {
    try {
        const userEmail = await getUserEmail();
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        pool.query(queries.getUserTimeTrackerItems, [userEmail], (error, results) => {
            if (error) {
                console.error('Error executing query', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.rows.length === 0) {
                return res.status(404).json({ error: 'No time tracker items found for the specified user' });
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        console.error('Error getting user email', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserAppointments = async (req, res) => {
    try {
        const userEmail = await getUserEmail();
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        pool.query(queries.getUserAppointments, [userEmail], (error, results) => {
            if (error) {
                console.error('Error executing query', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.rows.length === 0) {
                return res.status(404).json({ error: 'No appointments found for the specified user' });
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        console.error('Error getting user email', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateIsDeleted = async (req, res) => {
    const { id, table } = req.params;

    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: "Invalid table name" });
    }

    try {
        const userEmail = await getUserEmail();
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        pool.query(queries.updateIsDeleted(table), [id, userEmail], (error, results) => {
            if (error) {
                console.error('Error executing query', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.rows.length === 0) {
                return res.status(404).json({ error: `No ${table} item found for the specified user email or already marked as deleted` });
            }
            res.status(200).json(results.rows[0]);
        });
    } catch (error) {
        console.error('Error getting user email', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateTodoItemCompleted = async (req, res) => {
    const { id } = req.params;

    try {
        const userEmail = await getUserEmail();
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        pool.query(queries.updateTodoItemCompleted, [id, userEmail], (error, results) => {
            if (error) {
                console.error('Error executing query', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.rows.length === 0) {
                return res.status(404).json({ error: 'Todo item not found for the specified user' });
            }
            res.status(200).json(results.rows[0]);
        });
    } catch (error) {
        console.error('Error getting user email', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateTimeUnit = async (req, res) => {
    const itemId = req.params.id;
    const { time_unit } = req.body;

    try {
        const userEmail = await getUserEmail();
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        if (![1, 2].includes(time_unit)) {
            return res.status(400).json({ error: 'Invalid time unit value. Must be 1 or 2.' });
        }
        
        pool.query(queries.updateTimeUnit, [time_unit, itemId, userEmail], (error, results) => {
            if (error) {
                console.error('Error executing query', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.rows.length === 0) {
                return res.status(404).json({ error: 'Time tracker item not found or you do not have permission to update it.' });
            }
            res.status(200).json(results.rows[0]);
        });
    } catch (error) {
        console.error('Error getting user email', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const updateTimeTrackerItemLength = async (req, res) => {
    const itemId = req.params.id;
    const { length } = req.body;

    try {
        const userEmail = await getUserEmail();
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        

        if (!Number.isInteger(length) || length <= 0) {
            return res.status(400).json({ error: 'Length must be a positive integer' });
        }

        pool.query(queries.updateTimeTrackerItemLength, [length, itemId, userEmail], (error, results) => {
            if (error) {
                console.error('Error executing query', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.rows.length === 0) {
                return res.status(404).json({ error: 'Time tracker item not found or you do not have permission to update it.' });
            }
            res.status(200).json(results.rows[0]);
        });
    } catch (error) {
        console.error('Error getting user email', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const createAppointment = async (req, res) => {
    try {
        const { title, description, start_time, length } = req.body;
        const userEmail = await getUserEmail();
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        

        if (!title || !description || !start_time || length <= 0) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        pool.query(queries.createAppointment, [userEmail, title, description, start_time, length], (error, results) => {
            if (error) {
                console.error('Error creating appointment', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(201).json(results.rows[0]);
        });
    } catch (error) {
        console.error('Error creating appointment', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userEmail = await getUserEmail();
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        

        if (!title || !content) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        pool.query(queries.createNote, [userEmail, title, content], (error, results) => {
            if (error) {
                console.error('Error creating note', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(201).json(results.rows[0]);
        });
    } catch (error) {
        console.error('Error creating note', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createTodoItem = async (req, res) => {
    try {
        const { item } = req.body;
        const userEmail = await getUserEmail();
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        

        if (!item) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        pool.query(queries.createTodoItem, [userEmail, item], (error, results) => {
            if (error) {
                console.error('Error creating todo item', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(201).json(results.rows[0]);
        });
    } catch (error) {
        console.error('Error creating todo item', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createTimeTrackerItem = async (req, res) => {
    try {
        const { description, length, time_unit } = req.body;
        const userEmail = await getUserEmail();
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        

        if (!description || !length || length <= 0 || ![1, 2].includes(time_unit)) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        pool.query(queries.createTimeTrackerItem, [userEmail, description, length, time_unit], (error, results) => {
            if (error) {
                console.error('Error creating time tracker item', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(201).json(results.rows[0]);
        });
    } catch (error) {
        console.error('Error creating time tracker item', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const createUser = async (req, res) => {
    try {
        const userEmail = await getUserEmail();

        const userExists = await checkUserExists(userEmail);

        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        await pool.query(queries.createUser, [userEmail]);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getUserNotes,
    getUserTodoItems,
    getUserTimeTrackerItems,
    getUserAppointments,
    updateIsDeleted,
    updateTodoItemCompleted,
    updateTimeUnit,
    updateTimeTrackerItemLength,
    createAppointment,
    createNote,
    createTodoItem,
    createTimeTrackerItem,
    createUser,
};