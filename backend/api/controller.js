const getPool = require("../database_connection");
const handleErrorResponse = require("./error_util.js")
const queries = require("./queries");
const { getUserEmail } = require("./cognito_utils.js");
const { allowedTables, checkUserExists } = require("./utils.js");

const getOauthStateAndCodeVerifier = async (req, res) => {
    try {
        const pool = await getPool();
        const { state } = req.query;
        pool.query(queries.getCodeVerifierByState, [state], (error, results) => {
            if (error) {
                console.error('Error executing query', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.rows.length === 0) {
                return res.status(404).json({ error: 'State not found' });
            }
            
            // delete state after retrieving it
            pool.query(queries.deleteOauthStateAndCodeVerifier, [state], (error, results) => {
                if (error) {
                    console.error('Error deleting oauth state and code verifier', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
            });

            res.status(200).json(results.rows[0]);
        });
    } catch (error) {
        console.error('Error getting oauth state and code verifier', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserNotes = async (req, res) => {
    try {
        const accessToken = req.accessToken;
        const pool = await getPool();
        const userEmail = await getUserEmail(accessToken);
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
        return handleErrorResponse(res, error, 'Error getting user email');
    }
};

const getUserTodoItems = async (req, res) => {
    try {
        const accessToken = req.accessToken;
        const pool = await getPool();
        const userEmail = await getUserEmail(accessToken);
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
        return handleErrorResponse(res, error, 'Error getting user email');
    }
};

const getUserTimeTrackerItems = async (req, res) => {
    try {
        const accessToken = req.accessToken;
        const pool = await getPool();
        const userEmail = await getUserEmail(accessToken);
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
        return handleErrorResponse(res, error, 'Error getting user email');
    }
};

const getUserAppointments = async (req, res) => {
    try {
        const accessToken = req.accessToken;
        const pool = await getPool();
        const userEmail = await getUserEmail(accessToken);
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
        return handleErrorResponse(res, error, 'Error getting user email');
    }
};

const updateIsDeleted = async (req, res) => {
    const { id, table } = req.params;

    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: "Invalid table name" });
    }

    try {
        const accessToken = req.accessToken;
        const pool = await getPool();
        const userEmail = await getUserEmail(accessToken);
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
        return handleErrorResponse(res, error, 'Error getting user email');
    }
};

const updateTodoItemCompleted = async (req, res) => {
    const { id } = req.params;

    try {
        const accessToken = req.accessToken;
        const pool = await getPool();
        const userEmail = await getUserEmail(accessToken);
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
        return handleErrorResponse(res, error, 'Error getting user email');
    }
};

const updateTimeUnit = async (req, res) => {
    const itemId = req.params.id;
    const { time_unit } = req.body;

    try {
        const accessToken = req.accessToken;
        const pool = await getPool();
        const userEmail = await getUserEmail(accessToken);
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        if (![1, 2, 3].includes(time_unit)) {
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
        return handleErrorResponse(res, error, 'Error getting user email');
    }
};


const updateTimeTrackerItemLength = async (req, res) => {
    const itemId = req.params.id;
    const { length } = req.body;

    try {
        const accessToken = req.accessToken;
        const pool = await getPool();
        const userEmail = await getUserEmail(accessToken);
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
        return handleErrorResponse(res, error, 'Error getting user email');
    }
};


const createAppointment = async (req, res) => {
    try {
        const { title, description, start_time, length } = req.body;
        const accessToken = req.accessToken;
        const pool = await getPool();
        const userEmail = await getUserEmail(accessToken);
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return handleErrorResponse(res, new Error("User not found"), 'Error creating appointment');
        }
        

        if (!title || !description || !start_time || length <= 0) {
            return handleErrorResponse(res, new Error("Invalid input data"), 'Error creating appointment');
        }

        pool.query(queries.createAppointment, [userEmail, title, description, start_time, length], (error, results) => {
            if (error) {
                return handleErrorResponse(res, error, 'Error creating appointment');
            }
            res.status(201).json(results.rows[0]);
        });
    } catch (error) {
        return handleErrorResponse(res, error, 'Error creating appointment');
    }
};

const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const accessToken = req.accessToken;
        const pool = await getPool();
        const userEmail = await getUserEmail(accessToken);
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return handleErrorResponse(res, new Error("User not found"), 'Error creating note');
        }


        if (!title || !content) {
            return handleErrorResponse(res, new Error("Invalid input data"), 'Error creating note');
        }

        pool.query(queries.createNote, [userEmail, title, content], (error, results) => {
            if (error) {
                return handleErrorResponse(res, error, 'Error creating note');
            }
            res.status(201).json(results.rows[0]);
        });
    } catch (error) {
        return handleErrorResponse(res, error, 'Error creating note');
    }
};

const createTodoItem = async (req, res) => {
    try {
        const { item } = req.body;
        const accessToken = req.accessToken;
        const pool = await getPool();
        const userEmail = await getUserEmail(accessToken);
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        

        if (!item) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        pool.query(queries.createTodoItem, [userEmail, item], (error, results) => {
            if (error) {
                return handleErrorResponse(res, error, 'Error creating todo item');
            }
            res.status(201).json(results.rows[0]);
        });
    } catch (error) {
        return handleErrorResponse(res, error, 'Error creating todo item');
    }
};

const createTimeTrackerItem = async (req, res) => {
    try {
        const { description, length, time_unit } = req.body;
        const accessToken = req.accessToken;
        const pool = await getPool();
        const userEmail = await getUserEmail(accessToken);
        const userExists = await checkUserExists(userEmail);

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        

        if (!description || !length || length <= 0 || ![1, 2].includes(time_unit)) {
            return handleErrorResponse(res, new Error("Invalid input data"), 'Error creating time tracker item');
        }

        pool.query(queries.createTimeTrackerItem, [userEmail, description, length, time_unit], (error, results) => {
            if (error) {
                console.error('Error creating time tracker item', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(201).json(results.rows[0]);
        });
    } catch (error) {
        return handleErrorResponse(res, error, 'Error creating time tracker item');
    }
};


const createUser = async (req, res) => {
    try {
        const accessToken = req.accessToken;
        const pool = await getPool();
        const userEmail = await getUserEmail(accessToken);
        const userExists = await checkUserExists(userEmail);

        if (userExists) {
            return res.status(200).json({ message: "User already exists", email: userEmail});
        }

        await pool.query(queries.createUser, [userEmail]);
        res.status(201).json({ message: 'User created successfully', email: userEmail});
    } catch (error) {
        return handleErrorResponse(res, error, 'Error creating user');
    }
};

const createOauthStateAndCodeVerifier = async (req, res) => {
    try {
        const pool = await getPool();

        const { state, code_verifier } = req.body;
        pool.query(queries.createOauthStateAndCodeVerifier, [state, code_verifier]);
        res.status(201).json({ message: 'State and code verifier created successfully' });
    } catch (error) {
        return handleErrorResponse(res, error, 'Error creating oauth state and code verifier');
    }
};

const validateToken = async (req, res) => {
    try{
        const accessToken = req.accessToken;
        const userEmail = await getUserEmail(accessToken);
        const userExists = await checkUserExists(userEmail);

        if (userExists) {
            return res.status(200).json({ message: "Token is valid" });
        } else {
            return res.status(404).json({ message: "Token is not valid" });
        }
    } catch (error) {
        return handleErrorResponse(res, error, 'Error validating token');
    }
};

module.exports = {
    getOauthStateAndCodeVerifier,
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
    createOauthStateAndCodeVerifier,
    validateToken
};