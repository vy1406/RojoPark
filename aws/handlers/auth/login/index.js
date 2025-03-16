const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    const id = uuidv4();

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Lambda function is using shared dependencies!',
            id,
        }),
    };
};
