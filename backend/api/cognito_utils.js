const AWS = require('aws-sdk');

AWS.config.update({region: 'eu-west-1'});

const cognitoISP = new AWS.CognitoIdentityServiceProvider();

async function getUserEmail(accessToken) 
{ 
    if (!accessToken) {
        throw new Error('Access token not provided');
    }
    
    const params = {
        AccessToken: accessToken
    };

    try {
        const data = await cognitoISP.getUser(params).promise();
        const emailAttribute = data.UserAttributes.find(attr => attr.Name === 'email');
        if (emailAttribute) {
            return emailAttribute.Value;
        } else {
            throw new Error('User email not found');
        } 
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUserEmail
};