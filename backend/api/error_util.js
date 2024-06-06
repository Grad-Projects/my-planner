const handleErrorResponse = (res, err, errorMessage) => {

    switch (true) {
        case err.message.includes("Expected"):
        case err.message.includes("Unexpected token"):
        case err.message.includes("invalid input syntax"):
        case err.message.includes("too long for type"):
        case err.message.includes("Invalid input data"):
        case err.message.includes("Appointments_check"):  
        case err.message.includes("violates foreign key constraint"):       
            return res.status(400).json({ error: 'Invalid input data' });

        case err.message.includes("Invalid table name"):
        case err.message.includes("Length must be a positive integer"):
        case err.message.includes("Invalid time unit value. Must be 1 or 2."):       
            return res.status(400).json({ error: err.message });

        case err.message.includes("Access Token has expired"):            
            return res.status(401).json({ error: 'Token expired' });

        case err.message.includes("Invalid Access Token"):
        case err.message.includes("Access token not provided"):
        case err.message.includes("Could not verify signature for Access Token"):
            return res.status(401).json({ error: 'Unauthorised' });

        case err.message.includes("User not found"):
            return res.status(404).json({ error: 'Unauthorised' });
        
        case err.message.includes("not found"):
        case err.message.includes("State not found"):
        case err.message.includes("found for the specified user"):
            return res.status(404).json({ error: err.message });

        case err.message.includes("Database connection error"):   
            return res.status(500).json({ error: err.message});
            
        default:
            return res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
module.exports = handleErrorResponse;