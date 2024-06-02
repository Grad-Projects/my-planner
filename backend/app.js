const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const router = express.Router();
const port = 8080;

// Protected route with JWT verification
app.get('/protected', (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Assuming JWT token is passed in the Authorization header
  
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        console.error('JWT validation error:', err);
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        const email = decoded.email; // Access custom claim
        res.json({ email });
      }
    });
})

// Mount the router on the /auth path
app.use('/auth', router);

// Example route using app.get
app.get('/hello', (req, res) => {
  res.send('Hello World');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
