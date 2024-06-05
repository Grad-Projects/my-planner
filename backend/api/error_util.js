const handleErrorResponse = (res, err, errorMessage) => {
    console.error(errorMessage, err);

    switch (true) {
        case err.message.includes("too long for type"):
        case err.message.includes("Invalid input data"):
        case err.message.includes("Appointments_check"):        
            return res.status(400).json({ error: 'Invalid input data' });

        case err.message.includes("Access Token has expired"):
        case err.message.includes("Invalid Access Token"):
        case err.message.includes("Access token not provided"):
        case err.message.includes("Could not verify signature for Access Token"):
            return res.status(401).json({ error: 'Unauthorised' });

        case err.message.includes("User not found"):
            return res.status(404).json({ error: 'Unauthorised' });
            
        default:
            return res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
module.exports = handleErrorResponse;