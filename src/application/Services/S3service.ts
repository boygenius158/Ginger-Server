import express, { Request, Response } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mongoose from "mongoose";
import { PostModel } from "../../infrastructure/database/model/PostModel";

const router = express.Router();

// Initialize S3 Client with credentials from environment variables
const s3 = new S3Client({
    credentials: {
        secretAccessKey: "zl/TCuzABpntkXgF6x4uZLogHgFIOZ0vmRL9dtUn",
        accessKeyId: "AKIA3FLD5WQRZDJUM334",
    },
    region: "us-east-1",
});

// Define a TypeScript interface for file objects
interface FileData {
    fileName: string;
    fileType: string;
}
router.post("/api/getPresignedUrls", async (req: Request, res: Response) => {
    const { files, caption, userId }: { files: FileData[], caption: string, userId: mongoose.Types.ObjectId } = req.body;

    try {
        // Generate presigned URLs for each file
        const presignedUrls = await Promise.all(
            files.map(async (file) => {
                const params = {
                    Bucket: 'gingerappbucket1', // Your S3 bucket name
                    Key: `${Date.now()}_${file.fileName}`, // Unique file path and name
                    ContentType: file.fileType, // File content type
                };

                // Create a command to put the object
                const command = new PutObjectCommand(params);

                // Generate presigned URL
                const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // URL expires in 5 minutes

                return {
                    uploadUrl,
                    key: params.Key, // Return the key for potential use (e.g., saving to DB)
                };
            })
        );

        // Construct the public object URLs for later use
        const imageUrls = presignedUrls.map(urlInfo => `https://gingerappbucket1.s3.amazonaws.com/${urlInfo.key}`);

        // Create a new post object
        const newPost = new PostModel({
            imageUrl: imageUrls,
            caption,
            userId,
        });

        // Save the post to the database
        await newPost.save(); 
        console.log(presignedUrls);
        
        // Return the generated presigned URLs and the post ID
        return res.json({ presignedUrls, postId: newPost._id });

    } catch (error) {
        console.error("Error generating presigned URLs or saving post:", error);
        return res.status(500).json({ message: "Error processing your request" });
    }
});



export default router;
