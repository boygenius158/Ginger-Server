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
const NotificationModel_1 = require("../../infrastructure/database/model/NotificationModel");
const jwt = require("jsonwebtoken");
const router = express_1.default.Router();
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
                Bucket: 'gingerappbucket1',
                Key: `${Date.now()}_${file.fileName}`,
                ContentType: file.fileType,
            };
            const command = new client_s3_1.PutObjectCommand(params);
            const uploadUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 300 }); // URL expires in 5 minutes
            return {
                uploadUrl,
                key: params.Key,
            };
        })));
        const imageUrls = presignedUrls.map(urlInfo => `https://gingerappbucket1.s3.amazonaws.com/${urlInfo.key}`);
        const newPost = new PostModel_1.PostModel({
            imageUrl: imageUrls,
            caption,
            userId,
        });
        yield newPost.save();
        const aggregatedPost = yield PostModel_1.PostModel.aggregate([
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
        if (aggregatedPost.length === 0)
            return res.status(HttpStatus_1.HttpStatus.NOT_FOUND).json({ message: "Post not found" });
        const responseData = {
            presignedUrls,
            post: aggregatedPost[0],
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
router.post('/api/user/delete-commentreply', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { parentCommentId, comment } = req.body;
        // Update the document and remove the reply
        const result = yield CommentModel_1.default.updateOne({ _id: parentCommentId }, {
            $pull: {
                replies: { _id: comment._id }
            }
        });
        if (result.modifiedCount === 0) {
            return res.status(HttpStatus_1.HttpStatus.NOT_FOUND).json({ message: 'Comment or reply not found' });
        }
        return res.status(HttpStatus_1.HttpStatus.OK).json({ message: 'Reply deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error });
    }
}));
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
router.post('/api/user/user-posted-reply', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { content, userId, postId, parentId } = req.body;
        const user = yield UserModel_1.default.findById(userId);
        if (!user)
            return;
        // log("parentId", parentId);
        const objectIdParentId = new mongoose_1.default.Types.ObjectId(parentId);
        // Find the parent comment using the parentId
        const parentComment = yield CommentModel_1.default.findById(objectIdParentId);
        if (!parentComment) {
            (0, console_1.log)("Parent comment not found");
            return res.status(HttpStatus_1.HttpStatus.NOT_FOUND).json({ message: 'Parent comment not found' });
        }
        // Fetch the user data to attach to the reply
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
        console.log(req.body);
        const { content, userId, postId } = req.body;
        const user = yield UserModel_1.default.findById(userId);
        if (!user)
            return;
        const newComment = new CommentModel_1.default({
            userId,
            postId,
            content,
            replies: []
        });
        const postDetails = yield PostModel_1.PostModel.findById(postId);
        if (!postDetails) {
            throw new Error;
        }
        yield newComment.save();
        const message = `${user.username} commented: ${content}`;
        const notification = new NotificationModel_1.Notification({
            user: postDetails.userId,
            interactorId: userId,
            type: 'comment',
            message: message
        });
        yield notification.save();
        if (!newComment)
            return;
        const repliesWithUserData = yield CommentModel_1.default.aggregate([
            {
                $match: { _id: newComment._id }
            },
            {
                $unwind: "$replies"
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
                    "replies.author": { $arrayElemAt: ["$replyUser", 0] }
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
        const formattedReplies = repliesWithUserData.map(reply => ({
            _id: reply.replies._id,
            content: reply.replies.content,
            createdAt: reply.replies.createdAt,
            avatar: reply.replies.author.profilePicture,
            author: reply.replies.author.username
        }));
        const response = {
            _id: newComment._id,
            content: newComment.content,
            avatar: user.profilePicture,
            author: user.username,
            replies: formattedReplies
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ message: 'Error posting comment' });
    }
}));
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
exports.default = router;
