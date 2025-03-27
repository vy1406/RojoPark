const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "mysecretkey3";
const TABLE_NAME = process.env.TABLE_NAME || "RojoPostsTable";

const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT,OPTIONS',
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

        const body = JSON.parse(event.body || '{}');
        const { postId, thumbnail, attachments } = body;

        if (!postId) {
            return {
                statusCode: 400,
                headers: HEADERS,
                body: JSON.stringify({ message: "Missing postId" }),
            };
        }

        const updateFields = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};

        if (thumbnail) {
            updateFields.push("#thumbnail = :thumbnail");
            expressionAttributeNames["#thumbnail"] = "thumbnail";
            expressionAttributeValues[":thumbnail"] = thumbnail;
        }

        if (attachments) {
            updateFields.push("#attachments = :attachments");
            expressionAttributeNames["#attachments"] = "attachments";
            expressionAttributeValues[":attachments"] = attachments;
        }

        if (updateFields.length === 0) {
            return {
                statusCode: 400,
                headers: HEADERS,
                body: JSON.stringify({ message: "No fields to update" }),
            };
        }

        const updateCommand = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { postId },
            UpdateExpression: `SET ${updateFields.join(", ")}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames,
            ReturnValues: "ALL_NEW",
        });

        const result = await dynamoDB.send(updateCommand);

        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify({
                message: "Post updated",
                updatedPost: result.Attributes,
            }),
        };

    } catch (error) {
        console.error("Error in updatePostFiles handler:", error);
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({ message: "Internal server error", error }),
        };
    }
};
