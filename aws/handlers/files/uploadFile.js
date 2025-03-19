import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { GetSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.BUCKET_NAME;

export async function handler(event) {
    try {
        const body = JSON.parse(event.body);
        const { fileName, fileType } = body;

        if (!fileName || !fileType) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "fileName and fileType are required" }),
            };
        }

        const params = {
            Bucket: BUCKET_NAME,
            Key: `uploads/${fileName}`,
            ContentType: fileType,
            ACL: "private",
        };

        const url = await GetSignedUrl(s3, new PutObjectCommand(params), {
            expiresIn: 300, //  5 minutes
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ uploadUrl: url }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
}
