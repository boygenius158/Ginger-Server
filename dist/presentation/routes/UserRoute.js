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
const UserController_1 = require("../controllers/UserController");
const UserRepository_1 = require("../../infrastructure/repository/UserRepository");
const UserUseCase_1 = require("../../application/usecase/UserUseCase");
const UserModel_1 = __importDefault(require("../../infrastructure/database/model/UserModel"));
const verifyJWT_1 = __importDefault(require("../../utils/verifyJWT"));
const console_1 = require("console");
const mongoose_1 = __importDefault(require("mongoose"));
const CommentModel_1 = __importDefault(require("../../infrastructure/database/model/CommentModel"));
const router = express_1.default.Router();
const repo = new UserRepository_1.AuthRepository();
const auth = new UserUseCase_1.AuthUseCase(repo);
const controller = new UserController_1.authController(auth);
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
            { $unwind: '$user' }, // Unwind the user data
            {
                // Lookup user data for each reply in the replies array
                $lookup: {
                    from: 'users',
                    localField: 'replies.userId', // Field in the replies array to match with the User collection
                    foreignField: '_id',
                    as: 'replyUser' // Temporary field to store user data for replies
                }
            },
            {
                $addFields: {
                    // Map over the replies array and inject user data into each reply
                    replies: {
                        $map: {
                            input: '$replies',
                            as: 'reply',
                            in: {
                                _id: '$$reply._id',
                                content: '$$reply.content',
                                createdAt: '$$reply.createdAt',
                                userId: '$$reply.userId',
                                // Lookup user data in the replyUser array using $arrayElemAt
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
                // Project only the necessary fields
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
        // Format the comments to return the required structure
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
        // log(formattedComments);
        res.json({ comments: formattedComments });
    }
    catch (error) {
        (0, console_1.log)('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
}));
router.post('/api/user/custom-signin', controller.loginUser.bind(controller));
router.post('/api/registration', controller.signUpUser.bind(controller));
router.post('/api/user/google-auth', controller.googleAuth.bind(controller));
router.post('/api/user/forgetpassword', controller.forgetPassword.bind(controller));
router.post('/api/user/resetpassword', controller.changePassword.bind(controller));
router.post('/api/user/register/generateotp', controller.generateotp.bind(controller));
router.post('/api/user/register/clearotp', controller.clearotp.bind(controller)); // No JWT verification
router.post('/api/user/register/verifyotp', controller.verifyotp.bind(controller));
router.post('/api/user/custom-registration', controller.customBackendSession.bind(controller));
// Routes that require `verifyJWT` 
router.post('/api/user/checkrole', verifyJWT_1.default, controller.checkRole.bind(controller));
router.post('/api/user/uploadProfile', verifyJWT_1.default, controller.uploadProfile.bind(controller));
router.get('/api/user/searchUser', verifyJWT_1.default, controller.searchUser.bind(controller));
router.post('/api/user/fetch-name-username', verifyJWT_1.default, controller.fetchNameUsername.bind(controller));
router.post('/api/user/has-password', controller.hasPassword.bind(controller));
router.post('/api/user/update-user', verifyJWT_1.default, controller.updateUser.bind(controller));
router.post('/api/user/update-password', verifyJWT_1.default, controller.updatePassword.bind(controller));
router.post('/api/user/miniProfile', controller.miniProfile.bind(controller));
router.post('/api/user/save-user-to-search-history', verifyJWT_1.default, controller.saveUserToSearchHistory.bind(controller));
router.post('/api/user/get-recent-searches', verifyJWT_1.default, controller.getRecentSearches.bind(controller));
router.post('/api/user/premium-payment', verifyJWT_1.default, controller.premiumPayment.bind(controller));
router.post('/api/create-payment-intent', controller.createPaymentIntent.bind(controller));
exports.default = router;
