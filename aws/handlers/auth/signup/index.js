const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const SECRET = process.env.JWT_SECRET || "mysecretkey3";
const TABLE_NAME = process.env.TABLE_NAME || "UsersTable";

const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
}

exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Missing username or password', body: JSON.stringify(event.body) }),
    };
};
