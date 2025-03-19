const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.BUCKET_NAME;

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { fileName, fileType } = body;

        if (!fileName || !fileType) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: "fileName and fileType are required" }),
            };
        }

        const params = {
            Bucket: BUCKET_NAME,
            Key: `profiles/${fileName}`,
            ContentType: fileType
        };

        const url = await getSignedUrl(s3, new PutObjectCommand(params), {
            expiresIn: 300, //  5 minutes
        });

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,PUT,POST,GET",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ uploadUrl: url }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: error.message })
        };
    }
}
