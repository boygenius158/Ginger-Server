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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const HttpStatus_1 = require("../../utils/HttpStatus");
class MediaController {
    constructor(mediaUseCase) {
        this._mediaUseCase = mediaUseCase;
    }
    getExpiryDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                if (!userId) {
                    return res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ message: 'User ID is required' });
                }
                const daysLeft = yield this._mediaUseCase.getExpiryDate(userId);
                res.status(HttpStatus_1.HttpStatus.OK).json({ daysLeft });
            }
            catch (error) {
                console.error('Error occurred while fetching expiry date:', error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error });
            }
        });
    }
    uploadImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("reached");
            try {
                const files = req.files;
                const { caption, email } = req.body;
                if (!files || files.length === 0) {
                    return res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).send('No files uploaded');
                }
                const imageUrl = files.map(file => {
                    if (!file.location) {
                        throw new Error("File location is missing");
                    }
                    return file.location;
                });
                // console.log(imageUrl);
                // Optionally, validate caption and email
                if (!caption || !email) {
                    return res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ error: 'Caption and email are required' });
                }
                // console.log(email);
                const result = yield this._mediaUseCase.createPost(imageUrl, caption, email);
                res.json({ result });
                return;
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    visitProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("uiuiuiui");
                const username = req.body.username;
                if (!username) {
                    throw new Error;
                }
                const user = yield this._mediaUseCase.findUserIdByUsername(username);
                // console.log(user._id,"pooo");
                const post = yield this._mediaUseCase.findUserPost(user._id);
                // console.log(post);
                res.json({ user, post });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    followProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { followUser, orginalUser } = req.body;
                console.log(followUser, orginalUser, "i909");
                const followUserId = yield this._mediaUseCase.findUserId(followUser);
                console.log(followUserId);
                if (!followUserId) {
                    return;
                }
                const followThatUser = yield this._mediaUseCase.followProfile(orginalUser, followUserId);
                // const user = await this._mediaUseCase.followProfile()
                // console.log(followThatUser);
                res.json({ followThatUser });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    checkFollowingStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("checkFollowingStatus", req.body);
                const { followUser, orginalUser } = req.body;
                const followUserId = yield this._mediaUseCase.findUserId(followUser);
                if (!followUserId) {
                    return;
                }
                const followThatUser = yield this._mediaUseCase.checkFollowingStatus(orginalUser, followUserId);
                // const user = await this._mediaUseCase.followProfile()
                res.json({ followThatUser });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    fetchFeed(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(req.body,"helo9");
                const { email, offset, limit } = req.body;
                const feed = yield this._mediaUseCase.fetchFeed(email, offset, limit);
                res.json({ feed });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    likePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(req.body);
                const { postId, originalUser } = req.body;
                console.log(originalUser, "original user");
                const result = yield this._mediaUseCase.likePostAction(postId, originalUser);
                res.json({ result });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    postComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const { postedComment, userOfPost, postId } = req.body;
                console.log(postId);
                const comment = yield this._mediaUseCase.postComment(userOfPost, postedComment, postId);
                // console.log(comment);
                // res.status(HttpStatus.OK).json(comment);
                res.json({ comment: comment });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    uploadStory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const usecase = yield this._mediaUseCase.uploadStory(req.body.url, req.body.userId);
                res.json({ usecase });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const usecase = yield this._mediaUseCase.updateProfile(req.body.name, req.body.bio, req.body.email);
                res.json({ usecase });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    reportPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { victimUser, postId } = req.body;
                yield this._mediaUseCase.reportPost(victimUser, postId);
                res.status(HttpStatus_1.HttpStatus.OK).json({ message: "Post reported successfully" });
            }
            catch (error) {
                console.error("Error reporting post:", error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while reporting the post" });
            }
        });
    }
    fetchSavedPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.body;
                const result = yield this._mediaUseCase.fetchSavedPosts(username);
                res.status(HttpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                console.error('Error fetching saved posts:', error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    updateReadStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sender, recipient } = req.body;
                const result = yield this._mediaUseCase.updateReadStatus(sender, recipient);
                res.status(HttpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                console.error('Error updating read status:', error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    fetchHistoricalData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId, receiverId } = req.body;
                const messages = yield this._mediaUseCase.fetchHistoricalData(senderId, receiverId);
                res.status(HttpStatus_1.HttpStatus.OK).json({ messages });
            }
            catch (error) {
                console.error('Error fetching historical data:', error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    getPremiumStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const role = yield this._mediaUseCase.getPremiumStatus(userId);
                if (!role) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.status(HttpStatus_1.HttpStatus.OK).json({ role });
            }
            catch (error) {
                console.error('Error fetching premium status:', error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    getChatList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                if (!userId) {
                    return res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
                }
                const chatList = yield this._mediaUseCase.getChatList(userId);
                res.status(HttpStatus_1.HttpStatus.OK).json(chatList);
            }
            catch (error) {
                console.error('Error fetching chat list:', error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
            }
        });
    }
    visitPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                if (!postId) {
                    return res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ error: 'Post ID is required' });
                }
                const postDetails = yield this._mediaUseCase.visitPost(postId);
                res.status(HttpStatus_1.HttpStatus.OK).json(postDetails);
            }
            catch (error) {
                console.error('Error visiting post:', error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
            }
        });
    }
    fetchStories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                if (!userId) {
                    return res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
                }
                const stories = yield this._mediaUseCase.fetchStories(userId);
                res.status(HttpStatus_1.HttpStatus.OK).json({ stories });
            }
            catch (error) {
                console.error('Error fetching stories:', error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
            }
        });
    }
    handleAudioUpload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sender, receiverId, audio_url } = req.body;
                yield this._mediaUseCase.processAudioUpload(sender, receiverId, audio_url.url);
                res.json({ success: true });
            }
            catch (error) {
                console.error('Error uploading audio:', error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    handleFetchNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                console.log("fetch notifications", req.body);
                const notifications = yield this._mediaUseCase.execute(userId);
                console.log(notifications, "notifications");
                res.json({ notifications });
            }
            catch (error) {
                console.error('Error fetching notifications:', error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    handleSavePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, postId } = req.body;
                const result = yield this._mediaUseCase.executeSavePost(userId, postId);
                res.json(result);
            }
            catch (error) {
                console.error('Error saving post:', error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred" });
            }
        });
    }
    getUserDemographics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("90");
                const demographics = yield this._mediaUseCase.getUserDemographics();
                res.status(HttpStatus_1.HttpStatus.OK).json(demographics);
            }
            catch (error) {
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching demographics data", error });
            }
        });
    }
    getChartData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chartData, chartConfig } = yield this._mediaUseCase.getChartData();
                res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, chartData, chartConfig });
            }
            catch (error) {
                console.error("Error occurred:", error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
            }
        });
    }
    userPostedReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chartData, chartConfig } = yield this._mediaUseCase.getChartData();
                res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, chartData, chartConfig });
            }
            catch (error) {
                console.error("Error occurred:", error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
            }
        });
    }
}
exports.MediaController = MediaController;
