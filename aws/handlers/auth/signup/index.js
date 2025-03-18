const multiparty = require('multiparty');
const stream = require('stream');

exports.handler = async (event) => {
    try {
        // Handle CORS preflight requests
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST",
                    "Access-Control-Allow-Headers": "Content-Type,Authorization,multipart/form-data",
                },
                body: JSON.stringify({ message: "CORS preflight successful" }),
            };
        }

        return new Promise((resolve, reject) => {
            const form = new multiparty.Form();

            // Decode Base64 body from API Gateway (important for multipart/form-data)
            if (event.isBase64Encoded) {
                event.body = Buffer.from(event.body, "base64");
            }

            // Ensure 'headers' exist
            if (!event.headers) {
                event.headers = {};
            }

            // Ensure 'content-length' is set (Multiparty requires it)
            if (!event.headers["content-length"] && event.body) {
                event.headers["content-length"] = Buffer.byteLength(event.body);
            }

            // Convert body buffer to a readable stream
            const bufferStream = new stream.PassThrough();
            bufferStream.end(event.body);

            // Parse form data
            form.parse(bufferStream, (err, fields, files) => {
                if (err) {
                    console.error("❌ Form parsing error:", err);
                    return reject({
                        statusCode: 500,
                        headers: { "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ error: "Error parsing form data" }),
                    });
                }

                console.log("✅ Fields:", fields);
                console.log("✅ Files:", files);

                resolve({
                    statusCode: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        message: "✅ Multipart Form Data received!",
                        fields,
                        files,
                    }),
                });
            });
        });
    } catch (error) {
        console.error("❌ Error:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
