const AWS = require('aws-sdk');

AWS.config.update({region: 'eu-west-1'});

const cognitoISP = new AWS.CognitoIdentityServiceProvider();

async function getUserEmail(accessToken) 
{ 
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
        console.error('Error fetching user attributes:', error);
        throw error;
    }
}

module.exports = {
    getUserEmail
};