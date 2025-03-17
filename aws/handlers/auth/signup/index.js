const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    try {
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                },
                body: JSON.stringify({ message: 'CORS Preflight successful' }),
            };
        }

        const id = uuidv4();
        const requestBody = JSON.parse(event.body);
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            },
            body: JSON.stringify({
                message: 'Lambda function executed successfully!',
                id,
                email: requestBody?.email || 'No email provided',
                password: requestBody?.password || 'No password provided',
                fileBase64: requestBody?.fileBase64 || 'No fileBase64 provided'
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
