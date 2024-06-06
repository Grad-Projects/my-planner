const express = require('express');
const handleErrorResponse = require('./api/error_util.js')
const rateLimit = require('express-rate-limit');
const endpoints = require("./api/routes");
const helmet = require('helmet');
const cors = require('cors');
const getPool = require("./database_connection.js");
const fs = require('fs');
const https = require('https');

const app = express();
const port = 8080;

const fiveMinutes = 5 * 60 * 1000;
const apiLimiter = rateLimit({
    windowMs: fiveMinutes,
    max: 250, 
    message: 'Too many requests from this IP, please try again after 5 minutes'
  });

const corsOptions = {
  origin: ["https://myplanner.projects.bbdgrad.com", "http://localhost:5500", "http://127.0.0.1:5500", "https://localhost:5500", "https://127.0.0.1:5500"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());

// Middleware to extract access token from Authorization header
app.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const accessToken = authHeader.substring(7); // Remove 'Bearer ' from the beginning
    req.accessToken = accessToken; // Attach accessToken to request object for later use
  }
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const pool = await getPool();

  try {
    // Attempt to connect to the database
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'Database is up' });
  } catch (error) {
    return handleErrorResponse(res, new Error('Database connection error'), 'health check error');
  } finally {
    // Close the database connection
    await pool.end();
  }
});

if (process.env.ENVIRONMENT !== 'prod') {
  const serverOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  };

  https.createServer(serverOptions, app).listen(port, () => {
    console.log(`Server has started on port: ${port} ✔️`);
  });
} else {
  app.listen(port, () => {console.log(`Server has started on port: ${port} ✔️`)});
}

app.use("/api/v1", apiLimiter, endpoints);