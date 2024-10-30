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
exports.PostUseCase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class PostUseCase {
    constructor(repository) {
        this._repository = repository;
    }
    findUserId(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield this._repository.findUserId(email);
                return userId;
            }
            catch (error) {
                console.error("Error in findUserId:", error);
                throw new Error("Unable to find user by email");
            }
        });
    }
    findUserIdByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield this._repository.findUserIdByUsername(username);
                if (!userId) {
                    throw new Error("User not found");
                }
                return userId;
            }
            catch (error) {
                console.error("Error in findUserIdByUsername:", error);
                throw new Error("Unable to find user by username");
            }
        });
    }
    getExpiryDate(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._repository.findUserById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                if (user.roles !== 'premium' && user.roles !== 'admin') {
                    throw new Error("User does not have the required role");
                }
                const premium = yield this._repository.findPremiumByUserId(userId);
                if (!(premium === null || premium === void 0 ? void 0 : premium.createdAt)) {
                    throw new Error("Premium document or createdAt not found");
                }
                const createdAt = new Date(premium.createdAt);
                const expiryDate = new Date(createdAt);
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                const today = new Date();
                const timeDiff = expiryDate.getTime() - today.getTime();
                const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                return daysLeft;
            }
            catch (error) {
                console.error("Error in getExpiryDate:", error);
                throw new Error("Unable to calculate expiry date");
            }
        });
    }
    getUserDemographics() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("pop");
                const demographics = yield this._repository.getUserDemographics();
                return demographics.map((demographic) => ({
                    label: demographic._id,
                    value: demographic.count,
                }));
            }
            catch (error) {
                console.error("Error in getUserDemographics:", error);
                throw new Error("Unable to fetch user demographics");
            }
        });
    }
    createPost(imageUrl, caption, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield this.findUserId(email);
                if (!userId) {
                    throw new Error("User not found");
                }
                const newPost = {
                    imageUrl: imageUrl,
                    caption,
                    userId,
                    createdAt: new Date(),
                };
                console.log(newPost);
                return yield this._repository.uploadPost(newPost);
            }
            catch (error) {
                console.error("Error in createPost:", error);
                throw new Error("Unable to create post");
            }
        });
    }
    findUserPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repository.fetchPost(id);
            }
            catch (error) {
                console.error("Error in findUserPost:", error);
                throw new Error("Unable to fetch user posts");
            }
        });
    }
    followProfile(email, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repository.followProfile(email, id);
            }
            catch (error) {
                console.error("Error in followProfile:", error);
                throw new Error("Unable to follow profile");
            }
        });
    }
    checkFollowingStatus(email, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._repository.checkFollowingStatus(email, id);
                return !!user;
            }
            catch (error) {
                console.error("Error in checkFollowingStatus:", error);
                throw new Error("Unable to check following status");
            }
        });
    }
    fetchFeed(email, offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield this.findUserId(email);
                if (!userId) {
                    return null;
                }
                const feed = yield this._repository.fetchFeed(userId, offset, limit);
                return feed !== null && feed !== void 0 ? feed : null;
            }
            catch (error) {
                console.error("Error in fetchFeed:", error);
                throw new Error("Unable to fetch feed");
            }
        });
    }
    likePostAction(postsId, orginalUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("likePostAction", postsId);
                yield this._repository.likePost(postsId, orginalUser);
                return null;
            }
            catch (error) {
                console.error("Error in likePostAction:", error);
                throw new Error("Unable to like post");
            }
        });
    }
    postComment(email, postId, postedComment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repository.postComment(email, postedComment, postId);
            }
            catch (error) {
                console.error("Error in postComment:", error);
                throw new Error("Unable to post comment");
            }
        });
    }
    uploadStory(url, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._repository.uploadStory(url, userId);
                return true;
            }
            catch (error) {
                console.error("Error in uploadStory:", error);
                throw new Error("Unable to upload story");
            }
        });
    }
    updateProfile(name, bio, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._repository.updateProfile(name, bio, email);
                return true;
            }
            catch (error) {
                console.error("Error in updateProfile:", error);
                throw new Error("Unable to update profile");
            }
        });
    }
    reportPost(reporterId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._repository.reportPost(reporterId, postId);
            }
            catch (error) {
                console.error("Error in reportPost:", error);
                throw new Error("Unable to report post");
            }
        });
    }
    // Continue adding try-catch blocks for the rest of the functions following this same pattern.
    fetchSavedPosts(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch user from _repository
                const user = yield this._repository.findUserByUsername(username);
                if (!user) {
                    throw new Error("User not found");
                }
                // Fetch saved posts
                const savedPostIds = user.savedPosts;
                const posts = yield this._repository.findPostsByIds(savedPostIds);
                return { savedPosts: posts };
            }
            catch (error) {
                throw new Error(`Failed to fetch saved posts: ${error}`);
            }
        });
    }
    updateReadStatus(sender, recipient) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Update the read status of messages
                const result = yield this._repository.updateMessageReadStatus(sender, recipient);
                return result;
            }
            catch (error) {
                throw new Error(`Failed to update read status: ${error}`);
            }
        });
    }
    fetchHistoricalData(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch historical messages between sender and receiver
                const messages = yield this._repository.getHistoricalMessages(senderId, receiverId);
                return messages;
            }
            catch (error) {
                throw new Error(`Failed to fetch historical data: ${error}`);
            }
        });
    }
    getPremiumStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch the user and their roles to determine premium status
                const user = yield this._repository.getUserById(userId);
                return user ? user.roles : null;
            }
            catch (error) {
                throw new Error(`Failed to fetch premium status: ${error}`);
            }
        });
    }
    getChatList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the user by ID
                const user = yield this._repository.getUserById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                // Get the following and followers lists
                const following = user.following || [];
                const followers = user.followers || [];
                // Combine both arrays and remove duplicates (in case any user is in both lists)
                const combinedUsers = Array.from(new Set([...following, ...followers]));
                // Fetch the user details of these combined users
                const uniqueUsers = yield this._repository.getUsersByIds(combinedUsers);
                return { uniqueUsers };
            }
            catch (error) {
                throw new Error(`Failed to fetch chat list: ${error}`);
            }
        });
    }
    visitPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._repository.getPostById(postId);
                const comments = yield this._repository.getCommentsByPostId(postId);
                return { result, comments };
            }
            catch (error) {
                throw new Error(`Failed to visit post: ${error}`);
            }
        });
    }
    fetchStories(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followingList = yield this._repository.getUserFollowing(userId);
                const stories = yield this._repository.getStoriesByFollowingList(userId, followingList);
                return stories;
            }
            catch (error) {
                throw new Error(`Failed to fetch stories: ${error}`);
            }
        });
    }
    processAudioUpload(senderId, receiverId, audioUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const audioMessageData = {
                    sender: senderId,
                    receiver: receiverId,
                    message: audioUrl,
                    type: "audio"
                };
                yield this._repository.createMessage(audioMessageData);
            }
            catch (error) {
                throw new Error(`Failed to process audio upload: ${error}`);
            }
        });
    }
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repository.getNotificationsByUserId(userId);
            }
            catch (error) {
                throw new Error(`Failed to execute notifications retrieval: ${error}`);
            }
        });
    }
    executeSavePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(postId);
                const user = yield this._repository.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                if (!user.savedPosts) {
                    user.savedPosts = [];
                }
                const postIndex = user.savedPosts.indexOf(objectId);
                if (postIndex === -1) {
                    user.savedPosts.push(objectId);
                }
                else {
                    user.savedPosts.splice(postIndex, 1);
                }
                yield this._repository.saveUser(user);
                return { message: "Post saved/unsaved successfully" };
            }
            catch (error) {
                throw new Error(`Failed to save/unsave post: ${error}`);
            }
        });
    }
    getChartData() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._repository.getTopUsersByFollowers(3);
            // Map the aggregation result to the required chartData format
            const chartData = data.map((user) => ({
                username: user.username,
                followers: user.followerCount,
                fill: "var(--color-other)" // Replace this with actual color logic if needed
            }));
            // Generate chartConfig dynamically based on chartData
            const chartConfig = chartData.reduce((config, user, index) => {
                const colorVar = `--chart-${index + 2}`;
                config[user.username] = {
                    label: user.username,
                    color: `hsl(var(${colorVar}))`
                };
                return config;
            }, {});
            // Add any additional static or predefined configurations
            chartConfig.visitors = {
                label: "Visitors",
                color: 'hsl(var(--chart-visitors))' // Add a default color if needed
            };
            return { chartData, chartConfig };
        });
    }
}
exports.PostUseCase = PostUseCase;
