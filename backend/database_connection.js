const Pool = require ("pg").Pool;
require("dotenv").config();

const user = process.env.DB_USER
const password =  process.env.DB_PASSWORD
const host =  process.env.DB_HOST
const dbName =  process.env.DB_DATABASE
const port = process.env.DB_PORT 

const pool = new Pool({
    user: user,
    host: host,
    database: dbName,
    password: password,
    port: port,
    ssl: {
    rejectUnauthorized: false,
  }
});

module.exports = pool;
//TODO: figure out the ssl stuff, localhost needs ssl: false and aws db needs it as above?