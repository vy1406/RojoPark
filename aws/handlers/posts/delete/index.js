const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "mysecretkey3";
const TABLE_NAME = process.env.TABLE_NAME || "RojoPostsTable";

const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
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

        const { postId } = JSON.parse(event.body || '{}');

        if (!postId) {
            return {
                statusCode: 400,
                headers: HEADERS,
                body: JSON.stringify({ message: "Missing postId" }),
            };
        }

        const getResponse = await dynamoDB.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: { postId }
        }));

        const post = getResponse.Item;

        if (!post) {
            return {
                statusCode: 404,
                headers: HEADERS,
                body: JSON.stringify({ message: "Post not found" }),
            };
        }

        if (post.moderator?.username !== decoded.username) {
            return {
                statusCode: 403,
                headers: HEADERS,
                body: JSON.stringify({ message: "Unauthorized to delete this post" }),
            };
        }

        await dynamoDB.send(new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { postId }
        }));

        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify({ message: "Post deleted successfully", postId }),
        };

    } catch (error) {
        console.error("❌ Error in deletePost handler:", error);
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({ message: "Internal server error", error }),
        };
    }
};
