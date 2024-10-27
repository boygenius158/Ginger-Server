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
exports.MediaRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserModel_1 = __importDefault(require("../database/model/UserModel"));
const PostModel_1 = require("../database/model/PostModel");
const CommentModel_1 = __importDefault(require("../database/model/CommentModel"));
const StoryModel_1 = __importDefault(require("../database/model/StoryModel"));
const NotificationModel_1 = require("../database/model/NotificationModel");
const ReportModel_1 = __importDefault(require("../database/model/ReportModel"));
const MessageModel_1 = __importDefault(require("../database/model/MessageModel"));
const PremiumModel_1 = require("../database/model/PremiumModel");
class MediaRepository {
    getUserDemographics() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("ys");
                return yield UserModel_1.default.aggregate([
                    {
                        $match: {
                            roles: {
                                $ne: "admin"
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$roles",
                            count: { $sum: 1 }
                        }
                    }
                ]);
            }
            catch (error) {
                console.error("Error fetching user demographics:", error);
                return [];
            }
        });
    }
    findUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.findOne({ username });
            }
            catch (error) {
                console.error("Error finding user by username:", error);
                return null;
            }
        });
    }
    findPostsByIds(postIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield PostModel_1.PostModel.find({ _id: { $in: postIds } }).sort({ _id: -1 });
            }
            catch (error) {
                console.error("Error finding posts by IDs:", error);
                return [];
            }
        });
    }
    reportPost(reporterId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = new ReportModel_1.default({
                    reporterId,
                    postId,
                });
                yield report.save();
            }
            catch (error) {
                console.error("Error reporting post:", error);
            }
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.findById(userId).exec();
            }
            catch (error) {
                console.error("Error finding user by ID:", error);
                return null;
            }
        });
    }
    findPremiumByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield PremiumModel_1.PremiumModel.findOne({ userId }).exec();
            }
            catch (error) {
                console.error("Error finding premium user by ID:", error);
                return null;
            }
        });
    }
    uploadPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { imageUrl, caption, userId } = post;
                const newPost = new PostModel_1.PostModel({
                    caption,
                    imageUrl,
                    userId
                });
                yield newPost.save();
                return newPost.toObject();
            }
            catch (error) {
                console.error("Error uploading post:", error);
                return null;
            }
        });
    }
    findUserId(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.default.findOne({ email });
                if (!user) {
                    throw new Error("User not found");
                }
                return user.id;
            }
            catch (error) {
                console.error("Error finding user by email:", error);
                return null;
            }
        });
    }
    findUserIdByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const user = await UserModel.findOne({ username });
                const user = yield UserModel_1.default.aggregate([
                    {
                        $match: { username } // Match the user document by username
                    },
                    {
                        $lookup: {
                            from: "users", // Assuming your users are stored in the "users" collection
                            localField: "followers",
                            foreignField: "_id",
                            as: "followerDetails"
                        }
                    },
                    {
                        $lookup: {
                            from: "users", // Assuming your users are stored in the "users" collection
                            localField: "following",
                            foreignField: "_id",
                            as: "followingDetails"
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            name: 1,
                            bio: 1,
                            roles: 1,
                            followers: 1,
                            following: 1,
                            profilePicture: 1,
                            followerDetails: { username: 1, profilePicture: 1, followers: 1 },
                            followingDetails: { username: 1, profilePicture: 1, following: 1 }
                        }
                    }
                ]);
                if (!user) {
                    throw new Error("User not found");
                }
                console.log(user);
                return user[0];
            }
            catch (error) {
                console.error("Error finding user by username:", error);
                return null;
            }
        });
    }
    // async fetchPost(userId: Types.ObjectId): Promise<Post[]> {
    //     try {
    //         // const posts = await PostModel.find({ userId }).sort({ _id: -1 });
    //         const posts = await PostModel.aggregate([
    //             {
    //                 $match: {
    //                     userId
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'users',
    //                     localField: "userId",
    //                     foreignField: "_id",
    //                     as: "userDetails"
    //                 }
    //             },
    //             {
    //                 $unwind: '$userDetails'
    //             },
    //             {
    //                 $project: {
    //                     ...PostModel.schema.obj,
    //                     "userDetails.username": 1,
    //                     "userDetails.profilePicture": 1
    //                 }
    //             }
    //         ])
    //         return posts.map(post => post.toObject());
    //     } catch (error) {
    //         console.error("Error fetching posts by user ID:", error);
    //         return [];
    //     }
    // }
    fetchPost(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield PostModel_1.PostModel.find({ userId }).sort({ _id: -1 });
                return posts.map(post => post.toObject());
            }
            catch (error) {
                console.error("Error fetching posts by user ID:", error);
                return [];
            }
        });
    }
    followProfile(email, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    throw new Error('Invalid user ID format');
                }
                const objectId = new mongoose_1.default.Types.ObjectId(id);
                const user = yield UserModel_1.default.findOne({ email });
                const user2 = yield UserModel_1.default.findById(objectId);
                console.log(user, user2);
                if (!user) {
                    throw new Error('User not found');
                }
                if (!user2) {
                    throw new Error('Profile to follow not found');
                }
                user.following = user.following || [];
                user2.followers = user2.followers || [];
                const alreadyFollowing = user.following.some(followedId => followedId.equals(user2._id));
                if (alreadyFollowing) {
                    user.following = user.following.filter(followedId => !followedId.equals(user2._id));
                    user2.followers = user2.followers.filter(followerId => !followerId.equals(user._id));
                }
                else {
                    user.following.push(objectId);
                    user2.followers.push(user._id);
                    const message = `${user.username} started following you`;
                    const notification = new NotificationModel_1.Notification({
                        user: user2._id,
                        interactorId: user._id,
                        type: 'follow',
                        message: message
                    });
                    yield notification.save();
                }
                const updatedUser = yield user.save();
                yield user2.save();
                return updatedUser;
            }
            catch (error) {
                console.error("Error following profile:", error);
                throw new Error('Error following profile');
            }
        });
    }
    checkFollowingStatus(email, id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const user = yield UserModel_1.default.findOne({ email });
                if (!user) {
                    throw new Error('User not found');
                }
                const objectId = new mongoose_1.default.Types.ObjectId(id);
                return (_b = (_a = user.following) === null || _a === void 0 ? void 0 : _a.includes(objectId)) !== null && _b !== void 0 ? _b : false;
            }
            catch (error) {
                console.error("Error checking following status:", error);
                throw new Error('Error checking following status');
            }
        });
    }
    fetchFeed(userId, offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(userId);
                const user = yield UserModel_1.default.findById(objectId);
                if (!user) {
                    console.error('User not found');
                    return null;
                }
                const following = user.following;
                const savedPosts = user.savedPosts;
                const posts = yield PostModel_1.PostModel.aggregate([
                    { $match: { $or: [{ userId: objectId }, { userId: { $in: following } }], isBanned: false } },
                    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userDetails' } },
                    { $unwind: '$userDetails' },
                    { $addFields: { isSaved: { $in: ['$_id', savedPosts] } } },
                    // { $project: { _id: 1, imageUrl: 1, caption: 1, userId: 1, likeCount: 1, likes: 1, createdAt: 1, 'userDetails.username': 1, 'userDetails.email': 1, 'userDetails.profilePicture': 1, 'userDetails.followers': 1, 'userDetails.following': 1, 'userDetails.createdAt': 1, isSaved: 1 } },
                    { $project: { _id: 1, imageUrl: 1, caption: 1, userId: 1, likes: 1, createdAt: 1, 'userDetails.username': 1, 'userDetails.email': 1, 'userDetails.profilePicture': 1, 'userDetails.followers': 1, 'userDetails.following': 1, 'userDetails.createdAt': 1, isSaved: 1 } },
                    { $sort: { createdAt: -1 } },
                    { $skip: offset },
                    { $limit: limit }
                ]);
                return posts;
            }
            catch (error) {
                console.error('Failed to fetch feed:', error);
                return null;
            }
        });
    }
    likePost(postsId, originalUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const OpostId = new mongoose_1.default.Types.ObjectId(postsId);
                const OoriginalUser = new mongoose_1.default.Types.ObjectId(originalUser);
                const userWhoLikePost = yield UserModel_1.default.findById(OoriginalUser);
                const post = yield PostModel_1.PostModel.findById(OpostId);
                if (!post) {
                    return false;
                }
                if (!post.likes) {
                    post.likes = [];
                }
                const hasLiked = post.likes.includes(OoriginalUser);
                if (hasLiked) {
                    post.likes = post.likes.filter(like => !like.equals(OoriginalUser));
                    // post.likeCount = Math.max((post.likeCount || 0) - 1, 0);
                }
                else {
                    post.likes.push(OoriginalUser);
                    // post.likeCount = (post.likeCount || 0) + 1;
                }
                yield post.save();
                return true;
            }
            catch (error) {
                console.error('Failed to like/unlike post:', error);
                return false;
            }
        });
    }
    postComment(email, postId, postedComment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.default.findOne({ email });
                if (!user) {
                    throw new Error('User not found');
                }
                if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
                    throw new Error('Invalid postId');
                }
                const objectId = new mongoose_1.default.Types.ObjectId(postId);
                const comment = new CommentModel_1.default({
                    userId: user._id,
                    postId: objectId,
                    content: postedComment,
                });
                const savedComment = yield comment.save();
                return savedComment;
            }
            catch (error) {
                console.error('Failed to post comment:', error);
                throw new Error('Failed to post comment');
            }
        });
    }
    uploadStory(url, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(userId);
                const story = new StoryModel_1.default({
                    imageUrl: url,
                    userId: objectId
                });
                yield story.save();
                return true;
            }
            catch (error) {
                console.error('Failed to upload story:', error);
                return false;
            }
        });
    }
    updateProfile(name, bio, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.default.findOne({ email });
                if (!user) {
                    throw new Error('User not found');
                }
                user.bio = bio;
                user.name = name;
                yield user.save();
                return true;
            }
            catch (error) {
                console.error('Failed to update profile:', error);
                return false;
            }
        });
    }
    updateMessageReadStatus(sender, recipient) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield MessageModel_1.default.updateMany({ $or: [{ sender: recipient, receiver: sender }], isRead: false }, { $set: { isRead: true } });
            }
            catch (error) {
                console.error('Failed to update message read status:', error);
                throw new Error('Failed to update message read status');
            }
        });
    }
    getHistoricalMessages(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield MessageModel_1.default.find({
                    $or: [
                        { sender: senderId, receiver: receiverId },
                        { sender: receiverId, receiver: senderId }
                    ]
                }).sort({ timestamp: 1 });
            }
            catch (error) {
                console.error('Failed to fetch historical messages:', error);
                throw new Error('Failed to fetch historical messages');
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.findById(userId);
            }
            catch (error) {
                console.error('Failed to get user by ID:', error);
                throw new Error('Failed to get user by ID');
            }
        });
    }
    getUsersByIds(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.find({ _id: { $in: userIds } });
            }
            catch (error) {
                console.error('Failed to get users by IDs:', error);
                throw new Error('Failed to get users by IDs');
            }
        });
    }
    getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield PostModel_1.PostModel.findById(postId).populate('userId');
            }
            catch (error) {
                console.error('Failed to get post by ID:', error);
                throw new Error('Failed to get post by ID');
            }
        });
    }
    getFollowers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.find({ following: userId });
            }
            catch (error) {
                console.error('Failed to get followers:', error);
                throw new Error('Failed to get followers');
            }
        });
    }
    getCommentsByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield CommentModel_1.default.find({ postId })
                    .populate('userId')
                    .populate({
                    path: 'replies.userId',
                    select: 'username profilePicture'
                });
            }
            catch (error) {
                console.error('Failed to get comments by post ID:', error);
                throw new Error('Failed to get comments by post ID');
            }
        });
    }
    getUserFollowing(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield UserModel_1.default.findById(userId).select('following');
                if (!user) {
                    throw new Error('User not found');
                }
                // Provide an empty array if following is undefined
                const followingList = (_a = user.following) !== null && _a !== void 0 ? _a : [];
                // Convert ObjectId to string
                return followingList.map(id => id.toString());
            }
            catch (error) {
                console.error(`Error fetching following list for userId ${userId}:`, error);
                throw new Error('Failed to get user following list');
            }
        });
    }
    getStoriesByFollowingList(owner, followingList) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield StoryModel_1.default.aggregate([
                    {
                        $match: {
                            userId: {
                                $in: [
                                    new mongoose_1.default.Types.ObjectId(owner), // Include the owner
                                    ...followingList.map(id => new mongoose_1.default.Types.ObjectId(id)) // Include following list
                                ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'userDetails'
                        }
                    },
                    { $unwind: '$userDetails' },
                    {
                        $project: {
                            _id: 1,
                            userId: 1,
                            imageUrl: 1,
                            createdAt: 1,
                            'userDetails.username': 1,
                            'userDetails.profilePicture': 1
                        }
                    }
                ]);
            }
            catch (error) {
                console.error(`Error fetching stories for owner ${owner} and following list:`, error);
                throw new Error('Failed to get stories');
            }
        });
    }
    createMessage(messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = new MessageModel_1.default(messageData);
                return yield newMessage.save();
            }
            catch (error) {
                console.error('Error creating message:', error);
                throw new Error('Failed to create message');
            }
        });
    }
    getNotificationsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield NotificationModel_1.Notification.find({ user: userId })
                    .populate('interactorId', 'username profilePicture')
                    .sort({ createdAt: -1 })
                    .limit(20)
                    .exec();
            }
            catch (error) {
                console.error(`Error fetching notifications for userId ${userId}:`, error);
                throw new Error('Failed to get notifications');
            }
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.findById(userId).exec();
            }
            catch (error) {
                console.error(`Error fetching user by ID ${userId}:`, error);
                throw new Error('Failed to find user');
            }
        });
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield user.save();
            }
            catch (error) {
                console.error('Error saving user:', error);
                throw new Error('Failed to save user');
            }
        });
    }
    getTopUsersByFollowers(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.aggregate([
                    { $match: { roles: { $ne: 'admin' } } },
                    { $project: { _id: 0, username: 1, followerCount: { $size: { $ifNull: ['$followers', []] } } } },
                    { $sort: { followerCount: -1 } },
                    { $limit: limit }
                ]).exec();
            }
            catch (error) {
                console.error(`Error fetching top users by followers with limit ${limit}:`, error);
                throw new Error('Failed to get top users');
            }
        });
    }
}
exports.MediaRepository = MediaRepository;
