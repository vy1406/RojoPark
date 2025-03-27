const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "mysecretkey3";
const TABLE_NAME = process.env.TABLE_NAME || "RojoPostsTable";

const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

const dynamoDBClient = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

exports.handler = async (event) => {
    try {
        const authHeader = event.headers?.Authorization || event.headers?.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                statusCode: 401,
                headers: HEADERS,
                body: JSON.stringify({ message: "Missing or invalid Authorization header" }),
            };
        }

        const token = authHeader.split(" ")[1];
        let decoded;

        try {
            decoded = jwt.verify(token, SECRET);
        } catch (err) {
            return {
                statusCode: 403,
                headers: HEADERS,
                body: JSON.stringify({ message: "Invalid or expired token" }),
            };
        }

        const result = await dynamoDB.send(new ScanCommand({
            TableName: TABLE_NAME,
        }));

        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify(result.Items || []),
        };

    } catch (error) {
        console.error("Error in getAllPosts handler:", error);
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({ message: "Internal server error", error }),
        };
    }
};
