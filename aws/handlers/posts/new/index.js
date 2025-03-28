const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const SECRET = process.env.JWT_SECRET || "mysecretkey3";
const TABLE_NAME = process.env.TABLE_NAME || "RojoPostsTable";

const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
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

        const body = JSON.parse(event.body);
        const { title, content, moderator, park, dateCreated } = body;

        if (!title || !content || !moderator || !park || !dateCreated) {
            return {
                statusCode: 400,
                headers: HEADERS,
                body: JSON.stringify({ message: "Missing required fields" }),
            };
        }

        if (moderator.username !== decoded.username) {
            return {
                statusCode: 403,
                headers: HEADERS,
                body: JSON.stringify({ message: "Moderator mismatch with token user" }),
            };
        }

        const postId = uuidv4();

        const newPost = {
            postId,
            title,
            content,
            moderator,
            park,
            dateCreated,
        };

        await dynamoDB.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: newPost,
        }));

        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify({ message: "Post created", postId }),
        };

    } catch (error) {
        console.error("Error in createPost handler:", error);
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({ message: "Internal server error", error }),
        };
    }
};
