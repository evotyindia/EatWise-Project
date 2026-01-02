
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "eatwise-blog";

const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID || "",
        secretAccessKey: R2_SECRET_ACCESS_KEY || "",
    },
});

export async function POST(request: Request) {
    try {
        const { filename, filetype } = await request.json();

        if (!filename || !filetype) {
            return NextResponse.json({ error: "Missing filename or filetype" }, { status: 400 });
        }

        const uniqueFilename = `${Date.now()}-${filename.replace(/\s+/g, '-')}`;

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: uniqueFilename,
            ContentType: filetype,
        });

        const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });

        // Public public URL usually follows a different pattern if custom domain is set, 
        // or typically: https://<custom-domain>/<key> or https://pub-<hash>.r2.dev/<key>
        // For now, we will return the file name and let the client assume the public domain, 
        // or we can require a R2_PUBLIC_DOMAIN env var.

        return NextResponse.json({
            uploadUrl: signedUrl,
            fileKey: uniqueFilename
        });

    } catch (error) {
        console.error("Error generating signed URL:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
