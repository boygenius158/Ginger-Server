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
exports.MediaUseCase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class MediaUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    findUserId(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.repository.findUserId(email);
            return userId;
        });
    }
    findUserIdByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.repository.findUserIdByUsername(username);
            if (!userId) {
                throw new Error;
            }
            return userId;
        });
    }
    getExpiryDate(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.findUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            if (user.roles !== 'premium' && user.roles !== 'admin') {
                throw new Error('User does not have the required role');
            }
            const premium = yield this.repository.findPremiumByUserId(userId);
            if (!(premium === null || premium === void 0 ? void 0 : premium.createdAt)) {
                throw new Error('Premium document or createdAt not found');
            }
            const createdAt = new Date(premium.createdAt);
            const expiryDate = new Date(createdAt);
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            const today = new Date();
            const timeDiff = expiryDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return daysLeft;
        });
    }
    getUserDemographics() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("pop");
            const demographics = yield this.repository.getUserDemographics();
            return demographics.map((demographic) => ({
                label: demographic._id,
                value: demographic.count
            }));
        });
    }
    createPost(imageUrl, caption, email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implement the actual logic here
            // return this.repository.uploadPost(post);
            const userId = yield this.findUserId(email);
            if (!userId) {
                throw new Error;
            }
            const newPost = {
                imageUrl: imageUrl,
                caption,
                userId,
                createdAt: new Date()
            };
            console.log(newPost);
            return this.repository.uploadPost(newPost);
        });
    }
    findUserPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.repository.fetchPost(id);
            return posts;
        });
    }
    followProfile(email, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.followProfile(email, id);
            return user;
        });
    }
    checkFollowingStatus(email, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.checkFollowingStatus(email, id);
            if (user) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    fetchFeed(email, offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.findUserId(email);
            if (!userId) {
                return null;
            }
            const feed = yield this.repository.fetchFeed(userId, offset, limit);
            if (!feed) {
                return null;
            }
            return feed;
        });
    }
    likePostAction(postsId, orginalUser) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("liekpostsactiop", postsId);
            const action = yield this.repository.likePost(postsId, orginalUser);
            return null;
        });
    }
    postComment(email, postId, postedComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.repository.postComment(email, postedComment, postId);
            return comment;
        });
    }
    uploadStory(url, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const action = yield this.repository.uploadStory(url, userId);
            return true;
        });
    }
    updateProfile(name, bio, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const action = yield this.repository.updateProfile(name, bio, email);
            return true;
        });
    }
    reportPost(reporterId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.reportPost(reporterId, postId);
        });
    }
    fetchSavedPosts(username) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch user from repository
            const user = yield this.repository.findUserByUsername(username);
            if (!user) {
                throw new Error("User not found");
            }
            // Fetch saved posts
            const savedPostIds = user.savedPosts;
            const posts = yield this.repository.findPostsByIds(savedPostIds);
            return { savedPosts: posts };
        });
    }
    updateReadStatus(sender, recipient) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update the read status of messages
            const result = yield this.repository.updateMessageReadStatus(sender, recipient);
            return result;
        });
    }
    fetchHistoricalData(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch historical messages between sender and receiver
            const messages = yield this.repository.getHistoricalMessages(senderId, receiverId);
            return messages;
        });
    }
    getPremiumStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the user and their roles to determine premium status
            const user = yield this.repository.getUserById(userId);
            return user ? user.roles : null;
        });
    }
    getChatList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.getUserById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const following = user.following || [];
            const followingUsers = yield this.repository.getUsersByIds(following);
            return { followingUsers };
        });
    }
    visitPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repository.getPostById(postId);
            const comments = yield this.repository.getCommentsByPostId(postId);
            return { result, comments };
        });
    }
    fetchStories(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const followingList = yield this.repository.getUserFollowing(userId);
            const stories = yield this.repository.getStoriesByFollowingList(followingList);
            return stories;
        });
    }
    processAudioUpload(senderId, receiverId, audioUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const audioMessageData = {
                sender: senderId,
                receiver: receiverId,
                message: audioUrl,
                type: "audio"
            };
            yield this.repository.createMessage(audioMessageData);
        });
    }
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getNotificationsByUserId(userId);
        });
    }
    executeSavePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.default.Types.ObjectId(postId);
            const user = yield this.repository.findById(userId);
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
            yield this.repository.saveUser(user);
            return { message: "Post saved/unsaved successfully" };
        });
    }
    getChartData() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.repository.getTopUsersByFollowers(3);
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
exports.MediaUseCase = MediaUseCase;
