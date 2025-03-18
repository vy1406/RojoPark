const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "mysecretkey3";
const TABLE_NAME = process.env.USERS_TABLE || "RojoUsersTable";

const HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
};


const dynamoDBClient = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

exports.handler = async (event) => {
    try {
        const { username, password } = JSON.parse(event.body);

        if (!username || !password) {
            return {
                statusCode: 400,
                headers: HEADERS,
                body: JSON.stringify({ message: "Missing username or password" }),
            };
        }


        const result = await dynamoDB.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: { username },
        }));

        const user = result.Item;

        if (!user) {
            return {
                statusCode: 400,
                headers: HEADERS,
                body: JSON.stringify({ message: "Invalid username or password" }),
            };
        }


        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return {
                statusCode: 401,
                headers: HEADERS,
                body: JSON.stringify({ message: "Invalid username or password" }),
            };
        }


        const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify({ message: "Login successful", token, username: user.username }),
        };
    } catch (error) {
        console.error("❌ Error in login handler:", error);
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({ message: "Internal server error", error }),
        };
    }
};
