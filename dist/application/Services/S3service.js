"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const mongoose_1 = __importDefault(require("mongoose"));
const PostModel_1 = require("../../infrastructure/database/model/PostModel");
const HttpStatus_1 = require("../../utils/HttpStatus");
const UserModel_1 = __importDefault(require("../../infrastructure/database/model/UserModel"));
const ReportModel_1 = __importDefault(require("../../infrastructure/database/model/ReportModel"));
const CommentModel_1 = __importDefault(require("../../infrastructure/database/model/CommentModel"));
const console_1 = require("console");
const jwt = require("jsonwebtoken");
const router = express_1.default.Router();
// Initialize S3 Client with credentials from environment variables
const s3 = new client_s3_1.S3Client({
    credentials: {
        secretAccessKey: "zl/TCuzABpntkXgF6x4uZLogHgFIOZ0vmRL9dtUn",
        accessKeyId: "AKIA3FLD5WQRZDJUM334",
    },
    region: "us-east-1",
});
router.post("/api/getPresignedUrls", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { files, caption, userId } = req.body;
    try {
        // Generate presigned URLs for each file
        const presignedUrls = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const params = {
                Bucket: 'gingerappbucket1', // Your S3 bucket name
                Key: `${Date.now()}_${file.fileName}`, // Unique file path and name
                ContentType: file.fileType, // File content type
            };
            // Create a command to put the object
            const command = new client_s3_1.PutObjectCommand(params);
            // Generate presigned URL
            const uploadUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 300 }); // URL expires in 5 minutes
            return {
                uploadUrl,
                key: params.Key,
            };
        })));
        // Construct the public object URLs for later use
        const imageUrls = presignedUrls.map(urlInfo => `https://gingerappbucket1.s3.amazonaws.com/${urlInfo.key}`);
        // Create a new post object
        const newPost = new PostModel_1.PostModel({
            imageUrl: imageUrls,
            caption,
            userId,
        });
        // Save the post to the database
        yield newPost.save();
        // Use aggregation to join PostModel and UserModel
        const aggregatedPost = yield PostModel_1.PostModel.aggregate([
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
        if (aggregatedPost.length === 0)
            return res.status(404).json({ message: "Post not found" });
        // Return the structured response
        const responseData = {
            presignedUrls,
            post: aggregatedPost[0], // Get the first object from the aggregated result
        };
        return res.json(responseData);
    }
    catch (error) {
        console.error("Error generating presigned URLs or saving post:", error);
        return res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error processing your request" });
    }
}));
router.post("/refresh-token", (req, res) => {
    const { refreshToken } = req.body;
    // Validate refresh token
    jwt.verify(refreshToken, "helloworld", (err, user) => {
        if (err)
            return res.status(403).json({ message: "Invalid refresh token" });
        // Generate new access token
        const newAccessToken = jwt.sign({ id: user.id, roles: user.roles }, "helloworld", { expiresIn: "30m" } // Extend token expiration as needed
        );
        res.json({ accessToken: newAccessToken });
    });
});
router.post('/api/user/likedUserDetails', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("messaged", req.body);
    const likedUsersId = req.body.likes;
    const LikedUsers = yield UserModel_1.default.find({
        _id: { $in: likedUsersId }
    });
    // console.log(LikedUsers);
    res.json({ LikedUsers });
}));
router.post('/api/user/post-already-reported', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, victimUser } = req.body;
        const existingReport = yield ReportModel_1.default.findOne({
            postId: postId, // Use postId from the request
            reporterId: victimUser // Assuming victimUser is the reporter's ID
        });
        if (existingReport) {
            // Report already exists
            return res.json({ alreadyReported: true });
        }
        // Report does not exist
        return res.json({ alreadyReported: false });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
const bcrypt = require('bcrypt'); // Ensure bcrypt is required
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
router.post('/api/user/user-posted-reply', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { content, userId, postId, parentId } = req.body;
        (0, console_1.log)("parentId", parentId);
        const objectIdParentId = new mongoose_1.default.Types.ObjectId(parentId);
        // Find the parent comment using the parentId
        const parentComment = yield CommentModel_1.default.findById(objectIdParentId);
        if (!parentComment) {
            (0, console_1.log)("Parent comment not found");
            return res.status(404).json({ message: 'Parent comment not found' });
        }
        // Fetch the user data to attach to the reply
        const user = yield UserModel_1.default.findById(userId);
        if (!user)
            return;
        // Create the new reply with user details
        const reply = {
            _id: new mongoose_1.default.Types.ObjectId(), // Generate a unique _id for the reply
            userId,
            content,
            createdAt: new Date(),
            author: {
                profilePicture: user.profilePicture, // Attach user's profile picture
                username: user.username // Attach user's username
            }
        };
        // Push the reply into the replies array of the parent comment
        parentComment.replies.push(reply);
        yield parentComment.save();
        // Format the response with avatar and author details
        const formattedReply = {
            _id: reply._id,
            content: reply.content,
            createdAt: reply.createdAt,
            avatar: reply.author.profilePicture, // Include avatar in the response
            author: reply.author.username // Include author username in the response
        };
        // Send the formatted reply back to the frontend
        res.json(formattedReply);
    }
    catch (error) {
        console.error('Error posting reply:', error);
        res.status(500).json({ message: 'Error posting reply' });
    }
}));
router.post('/api/user/user-posted-comment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, userId, postId } = req.body;
        // Create a new comment and save it to the database
        const newComment = new CommentModel_1.default({
            userId,
            postId,
            content,
            replies: [] // Initialize the replies array
        });
        yield newComment.save();
        // Fetch the user details to include in the response
        const user = yield UserModel_1.default.findById(userId);
        if (!user)
            return;
        if (!newComment)
            return;
        // Fetch replies related to the comment (if any exist)
        const repliesWithUserData = yield CommentModel_1.default.aggregate([
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
            author: user.username, // Get the user's username
            replies: formattedReplies // Include any replies found
        };
        // Send the response back to the frontend
        res.json(response);
    }
    catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ message: 'Error posting comment' });
    }
}));
router.post('/api/user/fetch-post-comment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // log("request came", req.body);
    const { postId } = req.body;
    try {
        const comments = yield CommentModel_1.default.aggregate([
            {
                $match: { postId: new mongoose_1.default.Types.ObjectId(postId) }
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
            replies: comment.replies.map((reply) => ({
                _id: reply._id,
                content: reply.content,
                createdAt: reply.createdAt,
                avatar: reply.author.profilePicture,
                author: reply.author.username
            }))
        }));
        res.json({ comments: formattedComments });
    }
    catch (error) {
        console.log('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
}));
router.post('/api/user/delete-post', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.body;
    console.log(req.body);
    const post = yield PostModel_1.PostModel.findByIdAndDelete(postId);
    if (post) {
        return res.status(200).json({ success: true });
    }
    res.status(500).json({ success: false });
}));
router.post('/api/user/delete-comment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("delete comment", req.body);
    const { commentId } = req.body;
    const comment = yield CommentModel_1.default.findByIdAndDelete(commentId);
    if (!comment) {
        throw new Error;
    }
    res.status(200).json({ success: true });
}));
router.post('/api/admin/delete-record', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { id } = req.body;
    const record = yield ReportModel_1.default.findByIdAndDelete(id);
    console.log(record);
    res.status(200).json({});
}));
exports.default = router;
