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

const environment = process.env.ENVIRONMENT || 'dev';
const user = process.env.DATABASE_USERNAME;
const password =  process.env.DATABASE_PASSWORD;
const host =  process.env.DATABASE_HOST;
const dbName =  process.env.DATABASE_NAME;

async function createPool() {
    const pool = new Pool({
        user: user,
        host: host,
        database: dbName,
        password: environment == 'prod' ? (await getSecret('rds!db-5fe13fed-0a7c-4279-968b-469b40420ba9')).password : password,
        port: 5432,
        ssl: environment != 'prod' ? false : {
            rejectUnauthorized: false,
        }
    });

    return pool;
}

module.exports = createPool;