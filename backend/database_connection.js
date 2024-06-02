const Pool = require ("pg").Pool;
const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-west-1' });

async function getSecret(secretName) {
    const client = new AWS.SecretsManager();

    return new Promise((resolve, reject) => {
        client.getSecretValue({ SecretId: secretName }, (err, data) => {
            if (err) {
                console.error('Error retrieving secret:', err);
                reject(err);
            } else {
                resolve(JSON.parse(data.SecretString));
            }
        });
    });
}

async function createPool() {
    const secret = await getSecret('rds!db-5fe13fed-0a7c-4279-968b-469b40420ba9'); 

    const pool = new Pool({
        user: "myplanneradmin",
        host: "my-planner-db.chylgcp0m93v.eu-west-1.rds.amazonaws.com",
        database: "PlannerDB",
        password: secret.password,
        port: 5432,
        ssl: {
            rejectUnauthorized: false,
        }
    });

    return pool;
}

module.exports = createPool;
//TODO: figure out how to use env variables without getting errors?