const express = require('express');
const rateLimit = require('express-rate-limit');
const endpoints = require("./api/routes");
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const port = 8080;

const fifteenMinutes = 15 * 60 * 1000;
const apiLimiter = rateLimit({
    windowMs: fifteenMinutes, // 15 minutes
    max: 100, 
    message: 'Too many requests from this IP, please try again after 15 minutes'
  });

app.use(cors())
app.use(express.json());
app.use(helmet())

// Middleware to extract access token from Authorization header
app.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const accessToken = authHeader.substring(7); // Remove 'Bearer ' from the beginning
    req.accessToken = accessToken; // Attach accessToken to request object for later use
  }
  next();
});

app.listen(port, () => {console.log(`Server has started on port: ${port} ✔️`)});

app.use("/api/v1", apiLimiter, endpoints);
