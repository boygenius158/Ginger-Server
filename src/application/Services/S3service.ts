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

router.post('/api/user/profile-completion-status', async (req, res) => {
    const userId = req.body.userId;

    try {
        const profile = await DatingProfile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        // Using <any> to bypass TypeScript's strict property checks
        const requiredFields = ["name", "age", "bio", "images", "gender", "profileVisibility", "maximumAge", "interestedGender"];
        const isProfileComplete = requiredFields.every(field => {
            const value = (profile as any)[field];
            return value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0) && value !== '';
        });

        res.json({
            profile,
            isProfileComplete
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// router.post('/api/user/delete-commentreply', async (req, res) => {
//     try {
//         const { parentCommentId, comment } = req.body;

//         // Update the document and remove the reply
//         const result = await CommentModel.updateOne(
//             { _id: parentCommentId },
//             {
//                 $pull: {
//                     replies: { _id: comment._id }
//                 }
//             }
//         );

//         if (result.modifiedCount === 0) {
//             return res.status(HttpStatus.NOT_FOUND).json({ message: 'Comment or reply not found' });
//         }

//         return res.status(HttpStatus.OK).json({ message: 'Reply deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'An error occurred', error });
//     }
// });


// router.post('/api/user/likedUserDetails', async (req, res) => {
//     // console.log("messaged", req.body);
//     const likedUsersId = req.body.likes
//     const LikedUsers = await UserModel.find({

//         _id: { $in: likedUsersId }
//     })
//     // console.log(LikedUsers);

//     res.json({ LikedUsers })
// })


// router.post('/api/user/post-already-reported', async (req, res) => {
//     try {
//         const { postId, victimUser } = req.body;

//         const existingReport = await Report.findOne({
//             postId: postId,
//             reporterId: victimUser
//         });

//         if (existingReport) {
//             // Report already exists
//             return res.json({ alreadyReported: true });
//         }

//         // Report does not exist
//         return res.json({ alreadyReported: false });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });



// router.post('/api/user/user-posted-reply', async (req, res) => {
//     try {
//         // Log the incoming request body
//         console.log(req.body);

//         // Destructure the request body
//         const { content, userId, postId, parentId } = req.body;

//         // Fetch the user who is posting the reply
//         const user = await UserModel.findById(userId);
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         // Convert the parentId to an ObjectId
//         const objectIdParentId = new mongoose.Types.ObjectId(parentId);

//         // Fetch the parent comment using the parentId
//         const parentComment = await CommentModel.findById(objectIdParentId);
//         if (!parentComment) {
//             console.log("Parent comment not found");
//             return res.status(404).json({ message: 'Parent comment not found' });
//         }

//         // Create the new reply object
//         const reply = {
//             _id: new mongoose.Types.ObjectId(), // Generate a unique _id for the reply
//             userId,
//             content,
//             createdAt: new Date(),
//             author: {
//                 profilePicture: user.profilePicture, // Attach user's profile picture
//                 username: user.username              // Attach user's username
//             }
//         };

//         // Push the reply into the replies array of the parent comment
//         parentComment.replies.push(reply);

//         // Save the updated parent comment with the new reply
//         await parentComment.save();

//         // Format the reply for the response
//         const formattedReply = {
//             _id: reply._id,
//             content: reply.content,
//             createdAt: reply.createdAt,
//             avatar: reply.author.profilePicture, // Include avatar in the response
//             author: reply.author.username        // Include author username in the response
//         };

//         // Send the formatted reply back to the frontend
//         res.json(formattedReply);
//     } catch (error) {
//         console.error('Error posting reply:', error);
//         res.status(500).json({ message: 'Error posting reply' });
//     }
// });

// router.post('/api/user/user-posted-comment', async (req, res) => {
//     try {
//         const { content, userId, postId } = req.body;
//         const response = await DatingUseCase.executed(content, userId, postId);
//         res.json(response);
//     } catch (error) {
//         console.error('Error posting comment:', error);
//         res.status(500).json({ message: 'Error posting comment' });
//     }
// });


// interface Reply { 
//     _id: mongoose.Types.ObjectId;
//     content: string;
//     createdAt: Date;
//     author: {
//         profilePicture: string;
//         username: string;
//     };
// }

// router.post('/api/user/fetch-post-comment', async (req, res) => {
//     // log("request came", req.body);
//     const { postId } = req.body;

//     try {
//         const comments = await CommentModel.aggregate([
//             {
//                 $match: { postId: new mongoose.Types.ObjectId(postId) }
//             },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'userId',
//                     foreignField: '_id',
//                     as: 'user'
//                 }
//             },
//             { $unwind: '$user' },
//             {

//                 $lookup: {
//                     from: 'users',
//                     localField: 'replies.userId',
//                     foreignField: '_id',
//                     as: 'replyUser'
//                 }
//             },
//             {
//                 $addFields: {

//                     replies: {
//                         $map: {
//                             input: '$replies',
//                             as: 'reply',
//                             in: {
//                                 _id: '$$reply._id',
//                                 content: '$$reply.content',
//                                 createdAt: '$$reply.createdAt',
//                                 userId: '$$reply.userId',

//                                 author: {
//                                     $arrayElemAt: [
//                                         {
//                                             $filter: {
//                                                 input: '$replyUser',
//                                                 as: 'ru',
//                                                 cond: { $eq: ['$$ru._id', '$$reply.userId'] }
//                                             }
//                                         }, 0
//                                     ]
//                                 }
//                             }
//                         }
//                     }
//                 }
//             },
//             {

//                 $project: {
//                     _id: 1,
//                     content: 1,
//                     'user.profilePicture': 1,
//                     'user.username': 1,
//                     replies: {
//                         _id: 1,
//                         content: 1,
//                         createdAt: 1,
//                         'author.profilePicture': '$replies.author.profilePicture',
//                         'author.username': '$replies.author.username'
//                     }
//                 }
//             }
//         ]);

//         const formattedComments = comments.map(comment => ({
//             _id: comment._id,
//             content: comment.content,
//             avatar: comment.user.profilePicture,
//             author: comment.user.username,
//             replies: comment.replies.map((reply: Reply) => ({
//                 _id: reply._id,
//                 content: reply.content,
//                 createdAt: reply.createdAt,
//                 avatar: reply.author.profilePicture,
//                 author: reply.author.username
//             }))
//         }));

//         res.json({ comments: formattedComments });
//     } catch (error) {
//         console.log('Error fetching comments:', error);
//         res.status(500).json({ message: 'Error fetching comments' });
//     }
// });

// router.post('/api/user/delete-post', async (req, res) => {
//     const { postId } = req.body
//     console.log(req.body);

//     const post = await PostModel.findByIdAndDelete(postId)
//     if (post) {
//         return res.status(200).json({ success: true })
//     }
//     res.status(500).json({ success: false })
// })

// router.post('/api/user/delete-comment', async (req, res) => {
//     // console.log("delete comment", req.body);
//     const { commentId } = req.body

//     const comment = await CommentModel.findByIdAndDelete(commentId)
//     if (!comment) {
//         throw new Error
//     }
//     res.status(200).json({ success: true })


// })

// router.post('/api/admin/delete-record', async (req, res) => {
//     console.log(req.body);
//     const { id } = req.body
//     const record = await Report.findByIdAndDelete(id)
//     console.log(record);

//     res.status(200).json({})

// })


export default router;
