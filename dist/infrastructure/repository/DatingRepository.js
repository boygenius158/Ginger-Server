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
exports.DatingRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CommentModel_1 = __importDefault(require("../database/model/CommentModel"));
const DatingProfileMode_1 = __importDefault(require("../database/model/DatingProfileMode"));
const PostModel_1 = require("../database/model/PostModel");
const ReportModel_1 = __importDefault(require("../database/model/ReportModel"));
const NotificationModel_1 = require("../database/model/NotificationModel");
const UserModel_1 = __importDefault(require("../database/model/UserModel"));
class DatingRepository {
    swipeProfiles(userId, maximumAge, interestedGender) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userId, maximumAge, interestedGender, "maximumage");
            try {
                // Verify if the user has images
                const user = yield DatingProfileMode_1.default.findOne({ userId });
                if (!user || !user.images || user.images.length === 0) {
                    console.log("User has no images, returning an empty profile list.");
                    return []; // Return an empty array if the user doesn't have images
                }
                if (!user.profileVisibility) {
                    return [];
                }
                // Fetch profiles based on provided filters
                const profiles = yield DatingProfileMode_1.default.find({
                    userId: { $ne: userId },
                    profileVisibility: true,
                    age: { $lte: maximumAge },
                    gender: interestedGender,
                    likedByUsers: { $ne: userId },
                    images: { $ne: [] } // Filter out profiles with an empty images array
                });
                console.log(profiles, "profiles");
                return profiles;
            }
            catch (error) {
                console.error("Error fetching swipe profiles:", error);
                throw new Error("Failed to fetch swipe profiles. Please try again later.");
            }
        });
    }
    updateProfileImages(userId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield DatingProfileMode_1.default.findOne({ userId });
                if (!profile) {
                    throw new Error("Profile not found");
                }
                profile.images = url;
                yield profile.save();
                return {};
            }
            catch (error) {
                console.error("Error updating profile images:", error);
                throw new Error("Failed to update profile images. Please try again later.");
            }
        });
    }
    fetchMatches(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const matches = yield DatingProfileMode_1.default.find({
                    userId: { $ne: userId }, // Exclude the current user's profile
                    likedUsers: userId, // The current user has liked these profiles
                    likedByUsers: userId // These profiles have also liked the current user
                }).populate('userId');
                return matches;
            }
            catch (error) {
                console.error("Error fetching matches:", error);
                throw new Error("Failed to fetch matches. Please try again later.");
            }
        });
    }
    getUserDatingProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield DatingProfileMode_1.default.findOne({ userId });
                if (!profile) {
                    throw new Error("Profile not found");
                }
                return profile;
            }
            catch (error) {
                console.error("Error fetching user dating profile:", error);
                throw new Error("Failed to fetch user dating profile. Please try again later.");
            }
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield DatingProfileMode_1.default.findOne({ userId });
                if (!profile) {
                    // throw new Error("User not found");
                    return;
                }
                return profile;
            }
            catch (error) {
                console.error("Error finding user by ID:", error);
                throw new Error("Failed to find user by ID. Please try again later.");
            }
        });
    }
    updateProfile(userId, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield DatingProfileMode_1.default.updateOne({ userId }, {
                    $set: {
                        name: formData.name,
                        age: formData.age,
                        bio: formData.bio,
                        gender: formData.gender
                    }
                });
                // if (result.nModified === 0) {
                //     throw new Error("No profile updated");
                // }
                return result;
            }
            catch (error) {
                console.error("Error updating profile:", error);
                throw new Error("Failed to update profile. Please try again later.");
            }
        });
    }
    createProfile(userId, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = new DatingProfileMode_1.default({
                    userId,
                    name: formData.name,
                    age: formData.age,
                    bio: formData.bio,
                    gender: formData.gender
                });
                return yield profile.save();
            }
            catch (error) {
                console.error("Error creating profile:", error);
                throw new Error("Failed to create profile. Please try again later.");
            }
        });
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(user, "iii");
            try {
                return yield user.save();
            }
            catch (error) {
                console.error("Error saving user:", error);
                throw new Error("Failed to save user. Please try again later.");
            }
        });
    }
    findReportById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ReportModel_1.default.findByIdAndDelete(id);
            }
            catch (error) {
                console.error("Error saving user:", error);
                throw new Error("Failed to save user. Please try again later.");
            }
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield CommentModel_1.default.findByIdAndDelete(commentId);
            }
            catch (error) {
                console.error("Error saving user:", error);
                throw new Error("Failed to save user. Please try again later.");
            }
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield PostModel_1.PostModel.findByIdAndDelete(postId);
            }
            catch (error) {
                console.error("Error delete post:", error);
                throw new Error("Failed to delete post. Please try again later.");
            }
        });
    }
    fetchPostComment(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield CommentModel_1.default.aggregate([
                    {
                        $match: { postId: new mongoose_1.default.Types.ObjectId(postId) }
                    },
                    {
                        $sort: { createdAt: -1 }
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
                console.log(formattedComments);
                return formattedComments;
            }
            catch (error) {
                console.log('Error fetching comments:', error);
                throw new Error;
            }
        });
    }
    findUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.findById(userId);
            }
            catch (error) {
                console.error("Error finding user:", error);
                throw error;
            }
        });
    }
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield PostModel_1.PostModel.findById(postId);
            }
            catch (error) {
                console.error("Error finding post by ID:", error);
                throw error;
            }
        });
    }
    saveComment(commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = new CommentModel_1.default(commentData);
                return yield comment.save();
            }
            catch (error) {
                console.error("Error saving comment:", error);
                throw error;
            }
        });
    }
    createNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = new NotificationModel_1.Notification(notificationData);
                return yield notification.save();
            }
            catch (error) {
                console.error("Error creating notification:", error);
                throw error;
            }
        });
    }
    getRepliesWithUserData(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield CommentModel_1.default.aggregate([
                    {
                        $match: { _id: new mongoose_1.default.Types.ObjectId(commentId) }
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
            }
            catch (error) {
                console.error("Error getting replies with user data:", error);
                throw error;
            }
        });
    }
    deleteCommentReply(parentCommentId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Update the document and remove the reply
                const result = yield CommentModel_1.default.updateOne({ _id: parentCommentId }, {
                    $pull: {
                        replies: { _id: comment._id }
                    }
                });
                return result;
            }
            catch (error) {
                console.error("Error deleteCommentReply:", error);
                throw new Error("Failed deleteCommentReply. Please try again later.");
            }
        });
    }
    likedUserDetails(likedUsersId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const LikedUsers = yield UserModel_1.default.find({
                    _id: { $in: likedUsersId }
                });
                return LikedUsers;
            }
            catch (error) {
                console.error("Error likedUserDetails:", error);
                throw new Error("Failed likedUserDetails. Please try again later.");
            }
        });
    }
    postAlreadyReported(postId, victimUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingReport = yield ReportModel_1.default.findOne({
                    postId: postId,
                    reporterId: victimUser
                });
                return existingReport;
            }
            catch (error) {
                console.error("Error postAlreadyReported:", error);
                throw new Error("Failed postAlreadyReported. Please try again later.");
            }
        });
    }
    userPostedReply(content, userId, postId, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.default.findById(userId);
                if (!user)
                    throw new Error;
                const objectIdParentId = new mongoose_1.default.Types.ObjectId(parentId);
                // Fetch the parent comment using the parentId
                const parentComment = yield CommentModel_1.default.findById(objectIdParentId);
                if (!parentComment) {
                    console.log("Parent comment not found");
                    throw new Error;
                }
                // Create the new reply object
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
                // Save the updated parent comment with the new reply
                yield parentComment.save();
                // Format the reply for the response
                const formattedReply = {
                    _id: reply._id,
                    content: reply.content,
                    createdAt: reply.createdAt,
                    avatar: reply.author.profilePicture, // Include avatar in the response
                    author: reply.author.username // Include author username in the response
                };
                // Send the formatted reply back to the frontend
                return formattedReply;
            }
            catch (error) {
                console.error("Error userPostedReply:", error);
                throw new Error("Failed userPostedReply. Please try again later.");
            }
        });
    }
    profileCompletionStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield DatingProfileMode_1.default.findOne({ userId });
                if (!profile) {
                    throw new Error;
                }
                // Using <any> to bypass TypeScript's strict property checks
                const requiredFields = ["name", "age", "bio", "images", "gender", "profileVisibility", "maximumAge", "interestedGender"];
                const isProfileComplete = requiredFields.every(field => {
                    const value = profile[field];
                    return value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0) && value !== '';
                });
                return {
                    profile,
                    isProfileComplete
                };
            }
            catch (error) {
                console.error("Error saving profileCompletionStatus:", error);
                throw new Error("Failed to save profileCompletionStatus. Please try again later.");
            }
        });
    }
}
exports.DatingRepository = DatingRepository;
