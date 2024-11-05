import express, { Request, Response } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mongoose from "mongoose";
import { PostModel } from "../../infrastructure/database/model/PostModel";
import { HttpStatus } from "../../utils/HttpStatus";
import UserModel from "../../infrastructure/database/model/UserModel";
import Report from "../../infrastructure/database/model/ReportModel";
import { Admin } from "mongodb";
import AdminModel from "../../infrastructure/database/model/AdminModel";
import CommentModel from "../../infrastructure/database/model/CommentModel";
import { log } from "console";
import { Notification } from "../../infrastructure/database/model/NotificationModel";
import { DatingUseCase } from "../usecase/DatingUseCase";
import DatingProfile from "../../infrastructure/database/model/DatingProfileMode";
const jwt = require("jsonwebtoken");

const router = express.Router();


const s3 = new S3Client({
    credentials: {
        secretAccessKey: "zl/TCuzABpntkXgF6x4uZLogHgFIOZ0vmRL9dtUn",
        accessKeyId: "AKIA3FLD5WQRZDJUM334",
    },
    region: "us-east-1",
});


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
                    Bucket: 'gingerappbucket1',
                    Key: `${Date.now()}_${file.fileName}`,
                    ContentType: file.fileType,
                };

                const command = new PutObjectCommand(params);
                const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // URL expires in 5 minutes

                return {
                    uploadUrl,
                    key: params.Key,
                };
            })
        );


        const imageUrls = presignedUrls.map(urlInfo => `https://gingerappbucket1.s3.amazonaws.com/${urlInfo.key}`);


        const newPost = new PostModel({
            imageUrl: imageUrls,
            caption,
            userId,
        });


        await newPost.save();

        const aggregatedPost = await PostModel.aggregate([
            { $match: { _id: newPost._id } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $unwind: '$userDetails',
            },
            {
                $project: {
                    _id: 1,
                    imageUrl: 1,
                    caption: 1,
                    'userDetails.username': 1,
                    'userDetails.name': 1,
                    'userDetails.profilePicture': 1,
                    'userDetails.followers': 1,
                    'userDetails.following': 1,
                },
            },
        ]);


        if (aggregatedPost.length === 0) return res.status(HttpStatus.NOT_FOUND).json({ message: "Post not found" });


        const responseData = {
            presignedUrls,
            post: aggregatedPost[0],
        };

        return res.json(responseData);

    } catch (error) {
        console.error("Error generating presigned URLs or saving post:", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error processing your request" });
    }
});
router.post("/refresh-token", (req, res) => {
    const { refreshToken } = req.body;

    // Validate refresh token
    jwt.verify(refreshToken, "helloworld", (err: any, user: any) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });

        // Generate new access token
        const newAccessToken = jwt.sign(
            { id: user.id, roles: user.roles },
            "helloworld",
            { expiresIn: "30m" } // Extend token expiration as needed
        );

        res.json({ accessToken: newAccessToken });
    });
});

// router.post('/api/user/profile-completion-status', async (req, res) => {
//     const userId = req.body.userId;

//     try {
//         const profile = await DatingProfile.findOne({ userId });

//         if (!profile) {
//             return res.status(404).json({ error: "Profile not found" });
//         }

//         // Using <any> to bypass TypeScript's strict property checks
//         const requiredFields = ["name", "age", "bio", "images", "gender", "profileVisibility", "maximumAge", "interestedGender"];
//         const isProfileComplete = requiredFields.every(field => {
//             const value = (profile as any)[field];
//             return value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0) && value !== '';
//         });

//         res.json({
//             profile,
//             isProfileComplete
//         });

//     } catch (error) {
//         console.error("Error fetching profile:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// });




export default router;
