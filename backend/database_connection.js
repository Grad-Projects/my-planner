const Pool = require ("pg").Pool;
const user = process.env.DATABASE_USERNAME
const password =  process.env.DATABASE_PASSWORD
const host =  process.env.DATABASE_HOST
const dbName =  process.env.DATABASE_NAME

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database:"PlannerDB",
    password: "admin",
    port: 5432,
    ssl: false
});

module.exports = pool;
//TODO: figure out how to use env variables without getting errors?