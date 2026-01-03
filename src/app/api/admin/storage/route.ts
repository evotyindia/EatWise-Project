
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "eatwise-blog";
const R2_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || "https://pub-2ed7858c5208451892931a2386221544.r2.dev";

const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID || "",
        secretAccessKey: R2_SECRET_ACCESS_KEY || "",
    },
});

export async function GET() {
    try {
        const command = new ListObjectsV2Command({
            Bucket: R2_BUCKET_NAME,
        });

        const data = await S3.send(command);

        const objects = data.Contents?.map(item => ({
            key: item.Key,
            lastModified: item.LastModified,
            size: item.Size,
            url: `${R2_PUBLIC_DOMAIN}/${item.Key}`
        })) || [];

        // Sort by newest first
        objects.sort((a, b) => (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0));

        return NextResponse.json({ objects });
    } catch (error) {
        console.error("Error listing R2 objects:", error);
        return NextResponse.json({ error: "Failed to list objects" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { key } = await request.json();

        if (!key) {
            return NextResponse.json({ error: "Missing file key" }, { status: 400 });
        }

        const command = new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
        });

        await S3.send(command);

        return NextResponse.json({ success: true, message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting R2 object:", error);
        return NextResponse.json({ error: "Failed to delete object" }, { status: 500 });
    }
}
