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
            console.log("ys");
            return yield UserModel_1.default.aggregate([
                {
                    $group: {
                        _id: "$roles",
                        count: { $sum: 1 }
                    }
                }
            ]);
        });
    }
    findUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserModel_1.default.findOne({ username: username });
        });
    }
    findPostsByIds(postIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PostModel_1.PostModel.find({ _id: { $in: postIds } }).sort({ _id: -1 });
        });
    }
    reportPost(reporterId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = new ReportModel_1.default({
                reporterId,
                postId,
            });
            yield report.save();
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.default.findById(userId).exec();
        });
    }
    findPremiumByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return PremiumModel_1.PremiumModel.findOne({ userId }).exec();
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
                console.log("iiiiiii");
                const user = yield UserModel_1.default.findOne({ email });
                if (!user) {
                    throw new Error("User not2 found");
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
                const user = yield UserModel_1.default.findOne({ username });
                if (!user) {
                    throw new Error("User not found");
                }
                return user;
            }
            catch (error) {
                console.error("Error finding user by username:", error);
                return null;
            }
        });
    }
    fetchPost(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield PostModel_1.PostModel.find({ userId }).sort({ _id: -1 });
                return posts.map(post => post.toObject());
            }
            catch (error) {
                console.error("Error finding posts by user ID:", error);
                return [];
            }
        });
    }
    followProfile(email, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Convert the id string to ObjectId
                const objectId = new mongoose_1.default.Types.ObjectId(id);
                // Find users
                const user = yield UserModel_1.default.findOne({ email });
                const user2 = yield UserModel_1.default.findById(objectId); // Convert id to ObjectId
                if (!user) {
                    throw new Error('User not found');
                }
                if (!user2) {
                    throw new Error('User not found');
                }
                // Initialize the following and followers arrays if they are undefined
                if (!user.following) {
                    user.following = [];
                }
                if (!user2.followers) {
                    user2.followers = [];
                }
                // Toggle follow/unfollow
                const alreadyFollowing = user.following.some(followedId => followedId.equals(objectId));
                if (alreadyFollowing) {
                    // Remove from following and followers
                    user.following = user.following.filter(followedId => !followedId.equals(objectId));
                    user2.followers = user2.followers.filter(followerId => !followerId.equals(objectId));
                }
                else {
                    // Add to following and followers
                    user.following.push(objectId);
                    user2.followers.push(objectId);
                }
                // Save changes to both users
                const updatedUser = yield user.save();
                yield user2.save(); // Save changes for user2
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
                    throw new Error;
                }
                const objectId = new mongoose_1.default.Types.ObjectId(id);
                return (_b = (_a = user.following) === null || _a === void 0 ? void 0 : _a.includes(objectId)) !== null && _b !== void 0 ? _b : false;
            }
            catch (error) {
                console.error("Error following profile:", error);
                throw new Error;
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
                    {
                        $match: {
                            $or: [
                                { userId: objectId },
                                { userId: { $in: following } }
                            ],
                            isBanned: false
                        },
                    },
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
                        $addFields: {
                            isSaved: {
                                $in: ['$_id', savedPosts]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            imageUrl: 1,
                            caption: 1,
                            userId: 1,
                            likeCount: 1,
                            likes: 1,
                            createdAt: 1,
                            'userDetails.username': 1,
                            'userDetails.email': 1,
                            'userDetails.profilePicture': 1,
                            isSaved: 1
                        },
                    },
                    {
                        $sort: { createdAt: -1 },
                    },
                    {
                        $skip: offset,
                    },
                    {
                        $limit: limit,
                    }
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
                    post.likeCount = Math.max((post.likeCount || 0) - 1, 0);
                }
                else {
                    post.likes.push(OoriginalUser);
                    post.likeCount = (post.likeCount || 0) + 1;
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
            console.log(postId);
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
        });
    }
    uploadStory(url, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("reached");
            const objectId = new mongoose_1.default.Types.ObjectId(userId);
            const story = new StoryModel_1.default({
                imageUrl: url,
                userId: objectId
            });
            yield story.save();
            return true;
        });
    }
    updateProfile(name, bio, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.default.findOne({ email });
            if (!user) {
                console.log("user not found");
                throw new Error('user not found');
            }
            console.log(user);
            user.bio = bio;
            user.name = name;
            yield user.save();
            return true;
        });
    }
    updateMessageReadStatus(sender, recipient) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageModel_1.default.updateMany({
                $or: [
                    { sender: recipient, receiver: sender },
                ],
                isRead: false
            }, {
                $set: { isRead: true }
            });
        });
    }
    getHistoricalMessages(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageModel_1.default.find({
                $or: [
                    { sender: senderId, receiver: receiverId },
                    { sender: receiverId, receiver: senderId },
                ]
            }).sort({ timestamp: 1 });
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserModel_1.default.findById(userId);
        });
    }
    getUsersByIds(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserModel_1.default.find({ _id: { $in: userIds } });
        });
    }
    getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PostModel_1.PostModel.findById(postId).populate('userId');
        });
    }
    getCommentsByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CommentModel_1.default.find({ postId }).populate('userId');
        });
    }
    getUserFollowing(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield UserModel_1.default.findById(userId).select('following');
            if (!user) {
                throw new Error('User not found');
            }
            // Provide an empty array if following is undefined
            const followingList = (_a = user.following) !== null && _a !== void 0 ? _a : [];
            // Convert ObjectId to string
            return followingList.map(id => id.toString());
        });
    }
    getStoriesByFollowingList(followingList) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield StoryModel_1.default.aggregate([
                { $match: { userId: { $in: followingList.map(id => new mongoose_1.default.Types.ObjectId(id)) } } },
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
        });
    }
    createMessage(messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new MessageModel_1.default(messageData);
            return newMessage.save();
        });
    }
    getNotificationsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return NotificationModel_1.Notification.find({ user: userId })
                .populate('interactorId', 'username profilePicture')
                .exec();
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.default.findById(userId).exec();
        });
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user.save();
        });
    }
    getTopUsersByFollowers(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.default.aggregate([
                { $match: { roles: { $ne: 'admin' } } },
                { $project: { _id: 0, username: 1, followerCount: { $size: { $ifNull: ['$followers', []] } } } },
                { $sort: { followerCount: -1 } },
                { $limit: limit }
            ]).exec();
        });
    }
}
exports.MediaRepository = MediaRepository;
