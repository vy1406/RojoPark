const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

const SECRET = process.env.JWT_SECRET || "mysecretkey3";

exports.handler = async (event) => {
    const id = uuidv4();
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Missing username or password', body: JSON.stringify(event.body), id }),
    };
};
