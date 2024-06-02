const express = require('express');
const rateLimit = require('express-rate-limit');
const endpoints = require("./api/routes");
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');

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

app.listen(port, () => {console.log(`Server has started on port: ${port} ✔️`)});

app.use("/api/v1", apiLimiter, endpoints);
