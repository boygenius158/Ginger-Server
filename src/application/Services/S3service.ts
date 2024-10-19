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
const jwt = require("jsonwebtoken");

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
                    key: params.Key,
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

        // Use aggregation to join PostModel and UserModel
        const aggregatedPost = await PostModel.aggregate([
            { $match: { _id: newPost._id } }, // Match the new post
            {
                $lookup: {
                    from: 'users', // The name of your user collection
                    localField: 'userId', // Field from PostModel
                    foreignField: '_id', // Field from UserModel
                    as: 'userDetails', // Output array field
                },
            },
            {
                $unwind: '$userDetails', // Unwind the userDetails array (assuming it will have a single entry)
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

        // If no post is found, return null
        if (aggregatedPost.length === 0) return res.status(404).json({ message: "Post not found" });

        // Return the structured response
        const responseData = {
            presignedUrls,
            post: aggregatedPost[0], // Get the first object from the aggregated result
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




router.post('/api/user/likedUserDetails', async (req, res) => {
    // console.log("messaged", req.body);
    const likedUsersId = req.body.likes
    const LikedUsers = await UserModel.find({

        _id: { $in: likedUsersId }
    })
    // console.log(LikedUsers);

    res.json({ LikedUsers })
})


router.post('/api/user/post-already-reported', async (req, res) => {
    try {
        const { postId, victimUser } = req.body;

        const existingReport = await Report.findOne({
            postId: postId,        // Use postId from the request
            reporterId: victimUser // Assuming victimUser is the reporter's ID
        });

        if (existingReport) {
            // Report already exists
            return res.json({ alreadyReported: true });
        }

        // Report does not exist
        return res.json({ alreadyReported: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const bcrypt = require('bcrypt');  // Ensure bcrypt is required

// router.post('/api/user/admin-login', async (req, res) => {
//     try {
//         console.log(req.body);
//         const { email, password } = req.body;

//         // Find the admin user by email
//         const adminUser = await AdminModel.findOne({ email });

//         if (!adminUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Compare the provided password with the hashed password in the DB
//         const isMatch = await bcrypt.compare(password, adminUser.password);

//         if (!isMatch) {
//             console.log("no");

//             return res.status(400).json({ message: "Invalid credentials" });
//         }
//         console.log("yes");

//         // If passwords match, return a success response
//         res.status(200).json({ message: "Login successful" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

router.post('/api/user/user-posted-reply', async (req, res) => {
    try {
        console.log(req.body);
        const { content, userId, postId, parentId } = req.body;

        log("parentId", parentId);
        const objectIdParentId = new mongoose.Types.ObjectId(parentId);

        // Find the parent comment using the parentId
        const parentComment = await CommentModel.findById(objectIdParentId);
        if (!parentComment) {
            log("Parent comment not found");
            return res.status(404).json({ message: 'Parent comment not found' });
        }

        // Fetch the user data to attach to the reply
        const user = await UserModel.findById(userId);
        if (!user) return
        // Create the new reply with user details
        const reply = {
            _id: new mongoose.Types.ObjectId(), // Generate a unique _id for the reply
            userId,
            content,
            createdAt: new Date(),
            author: {
                profilePicture: user.profilePicture, // Attach user's profile picture
                username: user.username              // Attach user's username
            }
        };

        // Push the reply into the replies array of the parent comment
        parentComment.replies.push(reply);
        await parentComment.save();

        // Format the response with avatar and author details
        const formattedReply = {
            _id: reply._id,
            content: reply.content,
            createdAt: reply.createdAt,
            avatar: reply.author.profilePicture, // Include avatar in the response
            author: reply.author.username        // Include author username in the response
        };

        // Send the formatted reply back to the frontend
        res.json(formattedReply);
    } catch (error) {
        console.error('Error posting reply:', error);
        res.status(500).json({ message: 'Error posting reply' });
    }
});

router.post('/api/user/user-posted-comment', async (req, res) => {
    try {
        const { content, userId, postId } = req.body;

        // Create a new comment and save it to the database
        const newComment = new CommentModel({
            userId,
            postId,
            content,
            replies: [] // Initialize the replies array
        });
        await newComment.save();

        // Fetch the user details to include in the response
        const user = await UserModel.findById(userId);
        if (!user) return
        if (!newComment) return
        // Fetch replies related to the comment (if any exist)
        const repliesWithUserData = await CommentModel.aggregate([
            {
                $match: { _id: newComment._id } // Match the newly created comment
            },
            {
                $unwind: "$replies" // Unwind the replies array
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'replies.userId',
                    foreignField: '_id',
                    as: 'replyUser'
                }
            },
            {
                $addFields: {
                    "replies.author": { $arrayElemAt: ["$replyUser", 0] } // Attach the user data to each reply
                }
            },
            {
                $project: {
                    "replies._id": 1,
                    "replies.content": 1,
                    "replies.createdAt": 1,
                    "replies.author.profilePicture": "$replies.author.profilePicture",
                    "replies.author.username": "$replies.author.username"
                }
            }
        ]);

        // Map replies to correct format (if there are any)
        const formattedReplies = repliesWithUserData.map(reply => ({
            _id: reply.replies._id,
            content: reply.replies.content,
            createdAt: reply.replies.createdAt,
            avatar: reply.replies.author.profilePicture,
            author: reply.replies.author.username
        }));

        // Construct the response with user details and replies
        const response = {
            _id: newComment._id,
            content: newComment.content,
            avatar: user.profilePicture, // Get the user's avatar
            author: user.username,       // Get the user's username
            replies: formattedReplies    // Include any replies found
        };

        // Send the response back to the frontend
        res.json(response);
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ message: 'Error posting comment' });
    }
});


interface Reply {
    _id: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    author: {
        profilePicture: string;
        username: string;
    };
}

router.post('/api/user/fetch-post-comment', async (req, res) => {
    // log("request came", req.body);
    const { postId } = req.body;

    try {
        const comments = await CommentModel.aggregate([
            {
                $match: { postId: new mongoose.Types.ObjectId(postId) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {

                $lookup: {
                    from: 'users',
                    localField: 'replies.userId',
                    foreignField: '_id',
                    as: 'replyUser'
                }
            },
            {
                $addFields: {

                    replies: {
                        $map: {
                            input: '$replies',
                            as: 'reply',
                            in: {
                                _id: '$$reply._id',
                                content: '$$reply.content',
                                createdAt: '$$reply.createdAt',
                                userId: '$$reply.userId',

                                author: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$replyUser',
                                                as: 'ru',
                                                cond: { $eq: ['$$ru._id', '$$reply.userId'] }
                                            }
                                        }, 0
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {

                $project: {
                    _id: 1,
                    content: 1,
                    'user.profilePicture': 1,
                    'user.username': 1,
                    replies: {
                        _id: 1,
                        content: 1,
                        createdAt: 1,
                        'author.profilePicture': '$replies.author.profilePicture',
                        'author.username': '$replies.author.username'
                    }
                }
            }
        ]);

        const formattedComments = comments.map(comment => ({
            _id: comment._id,
            content: comment.content,
            avatar: comment.user.profilePicture,
            author: comment.user.username,
            replies: comment.replies.map((reply: Reply) => ({
                _id: reply._id,
                content: reply.content,
                createdAt: reply.createdAt,
                avatar: reply.author.profilePicture,
                author: reply.author.username
            }))
        }));

        res.json({ comments: formattedComments });
    } catch (error) {
        console.log('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
});

router.post('/api/user/delete-post', async (req, res) => {
    const { postId } = req.body
    console.log(req.body);

    const post = await PostModel.findByIdAndDelete(postId)
    if (post) {
        return res.status(200).json({ success: true })
    }
    res.status(500).json({ success: false })
})

router.post('/api/user/delete-comment', async (req, res) => {
    console.log("delete comment", req.body);
    const { commentId } = req.body

    const comment = await CommentModel.findByIdAndDelete(commentId)
    if (!comment) {
        throw new Error
    }
    res.status(200).json({ success: true })


})

router.post('/api/admin/delete-record', async (req, res) => {
    console.log(req.body);
    const { id } = req.body
    const record = await Report.findByIdAndDelete(id)
    console.log(record);

    res.status(200).json({})

})


export default router;
