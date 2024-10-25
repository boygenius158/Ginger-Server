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
exports.DatingController = void 0;
const HttpStatus_1 = require("../../utils/HttpStatus");
const mongoose_1 = __importDefault(require("mongoose"));
class DatingController {
    constructor(_datingUseCase) {
        this._datingUseCase = _datingUseCase;
    }
    swipeProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("swipe profile", req.body);
            try {
                const { userId, maximumAge, interestedGender } = req.body;
                const profiles = yield this._datingUseCase.swipeProfiles(userId, maximumAge, interestedGender);
                if (!profiles) {
                    return res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching profiles" });
                }
                res.json({ profiles });
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching profiles" });
            }
        });
    }
    updateDatingProfileImages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("update dating profile images", req.body);
            try {
                const { userId, url } = req.body;
                yield this._datingUseCase.updateProfileImages(userId, url);
                res.json({});
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while updating profile images" });
            }
        });
    }
    fetchMatches(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("fetch matches");
            try {
                const { userId } = req.body;
                const matches = yield this._datingUseCase.fetchMatches(userId);
                res.json({ matches });
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching matches" });
            }
        });
    }
    getUserDatingProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get profile", req.body);
            try {
                const { userId } = req.body;
                const user = yield this._datingUseCase.getUserDatingProfile(userId);
                res.json({ user });
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching the profile" });
            }
        });
    }
    handleDatingTab1(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, formData } = req.body;
                console.log(req.body);
                const result = yield this._datingUseCase.handleDatingTab1(userId, formData);
                res.json(result);
            }
            catch (error) {
                console.error("Error handling dating profile:", error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while processing your request." });
            }
        });
    }
    handleDatingTab3(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const images = yield this._datingUseCase.getProfileImages(userId);
                if (!images) {
                    return res.status(HttpStatus_1.HttpStatus.NOT_FOUND).json({ message: "User not found" });
                }
                res.json({ images });
            }
            catch (error) {
                console.error("Error fetching user images:", error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while fetching user images." });
            }
        });
    }
    handleDatingTab4(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, maximumAge, profileVisibility, interestedGender } = req.body;
                console.log(req.body, "ooo");
                const updatedUser = yield this._datingUseCase.updateUserPreferences(userId, maximumAge, profileVisibility, interestedGender);
                if (!updatedUser) {
                    return res.status(HttpStatus_1.HttpStatus.NOT_FOUND).json({ message: "User not found" });
                }
                res.json(updatedUser);
            }
            catch (error) {
                console.error("Error updating user preferences:", error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while updating user preferences." });
            }
        });
    }
    handleUserSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                // console.log(userId);
                if (!userId) {
                    return res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
                }
                const userSettings = yield this._datingUseCase.getUserSettings(userId);
                if (!userSettings) {
                    return res.status(HttpStatus_1.HttpStatus.NOT_FOUND).json({ error: 'User not found' });
                }
                res.status(HttpStatus_1.HttpStatus.OK).json({ data: userSettings });
            }
            catch (error) {
                console.error("Error fetching user settings:", error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
            }
        });
    }
    getDatingTab1Details(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                console.log(userId, "lop");
                if (!userId) {
                    return res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "User ID is required" });
                }
                const formData = yield this._datingUseCase.getDatingTab1Details(userId);
                if (!formData) {
                    return res.status(HttpStatus_1.HttpStatus.OK).json({ formData });
                    // return res.status(HttpStatus.NOT_FOUND).json({ error: "User not found" });
                }
                return res.status(HttpStatus_1.HttpStatus.OK).json({ formData });
            }
            catch (error) {
                console.error("Error fetching dating tab 1 details:", error);
                return res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
            }
        });
    }
    adminDeleteRecord(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                if (!id) {
                    return res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "id is required" });
                }
                yield this._datingUseCase.adminDeleteRecord(id);
                return res.json({});
            }
            catch (error) {
                console.error('error in admin delete record');
                return res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "internal server errro" });
            }
        });
    }
    deleteComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { commentId } = req.body;
                if (!commentId) {
                    return res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "id is required" });
                }
                yield this._datingUseCase.deleteComment(commentId);
                res.status(HttpStatus_1.HttpStatus.OK).json({ success: true });
            }
            catch (error) {
                console.error('error in admin delete record');
                return res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "internal server errro" });
            }
        });
    }
    deletePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                if (!postId) {
                    return res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "id is required" });
                }
                yield this._datingUseCase.deletePost(postId);
                res.status(HttpStatus_1.HttpStatus.OK).json({ success: true });
            }
            catch (error) {
                console.error('error in admin delete record');
                return res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "internal server errro" });
            }
        });
    }
    fetchPostComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const { postId } = req.body;
                if (!postId) {
                    return res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "id is required" });
                }
                // Validate the postId format before proceeding
                if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
                    return res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Invalid postId format" });
                }
                const formattedComments = yield this._datingUseCase.fetchPostComment(postId);
                res.status(HttpStatus_1.HttpStatus.OK).json({ comments: formattedComments });
            }
            catch (error) {
                console.error('Error fetching post comments:', error);
                return res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
            }
        });
    }
    userPostedComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { content, userId, postId } = req.body;
                const response = yield this._datingUseCase.executed(content, userId, postId);
                res.status(HttpStatus_1.HttpStatus.OK).json(response);
            }
            catch (error) {
                console.error('Error fetching post comments:', error);
                return res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
            }
        });
    }
    deleteCommentReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { parentCommentId, comment } = req.body;
                const result = yield this._datingUseCase.deleteCommentReply(parentCommentId, comment);
                if (result.modifiedCount === 0) {
                    return res.status(HttpStatus_1.HttpStatus.NOT_FOUND).json({ message: 'Comment or reply not found' });
                }
                return res.status(HttpStatus_1.HttpStatus.OK).json({ message: 'Reply deleted successfully' });
            }
            catch (error) {
                console.error("Error occurred:", error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
            }
        });
    }
    likedUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const likedUsersId = req.body.likes;
                const LikedUsers = yield this._datingUseCase.likedUserDetails(likedUsersId);
                // Report does not exist
                return res.json({ LikedUsers });
            }
            catch (error) {
                console.error("Error occurred:", error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
            }
        });
    }
    postAlreadyReported(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, victimUser } = req.body;
                const existingReport = yield this._datingUseCase.postAlreadyReported(postId, victimUser);
                if (existingReport) {
                    // Report already exists
                    return res.json({ alreadyReported: true });
                }
                // Report does not exist
                return res.json({ alreadyReported: false });
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
                const { content, userId, postId, parentId } = req.body;
                const formattedReply = yield this._datingUseCase.userPostedReply(content, userId, postId, parentId);
                return res.json(formattedReply);
            }
            catch (error) {
                console.error("Error occurred:", error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
            }
        });
    }
}
exports.DatingController = DatingController;
