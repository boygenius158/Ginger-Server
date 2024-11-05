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
exports.DatingUseCase = void 0;
// export interface IDatingUseCase {
//     swipeProfiles(userId: string): Promise<any>;
//     updateProfileImages(userId: string, url: string[]): Promise<any>;
//     fetchMatches(userId: string): Promise<any>;
//     getUserDatingProfile(userId: string): Promise<any>;
//     handleDatingTab1(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
//     getProfileImages(userId: string): Promise<string[] | null>;
//     updateUserPreferences(userId: string, maximumAge: number, profileVisibility: boolean, interestedGender: string): Promise<any>;
//     getUserSettings(userId: string): Promise<any>;
//     getDatingTab1Details(userId: string): Promise<any>;
//     adminDeleteRecord(id: string): Promise<void>
//     deleteComment(commentId: string): Promise<void>
//     deletePost(postId: string): Promise<void>
//     fetchPostComment(postId: string): Promise<any>
//     executed(content: string, userId: string, postId: string): Promise<any>;
//     deleteCommentReply(parentCommentId: string, comment: any): Promise<any>
//     likedUserDetails(likedUsersId: any): Promise<any>
//     postAlreadyReported(postId: any, victimUser: any): Promise<any>
//     userPostedReply(content:any, userId:any, postId:any, parentId:any): Promise<any>
// }
class DatingUseCase {
    constructor(_repository) {
        this._repository = _repository;
    }
    swipeProfiles(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const datingProfile = yield this._repository.getUserDatingProfile(userId);
                console.log(datingProfile.name);
                const profiles = yield this._repository.swipeProfiles(userId, datingProfile.maximumAge, datingProfile.interestedGender);
                return profiles;
            }
            catch (error) {
                console.error("Error while swiping profiles:", error);
                throw new Error("Failed to swipe profiles");
            }
        });
    }
    updateProfileImages(userId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._repository.updateProfileImages(userId, url);
                return {};
            }
            catch (error) {
                console.error("Error updating profile images:", error);
                throw new Error("Failed to update profile images");
            }
        });
    }
    fetchMatches(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const matches = yield this._repository.fetchMatches(userId);
                return matches;
            }
            catch (error) {
                console.error("Error fetching matches:", error);
                throw new Error("Failed to fetch matches");
            }
        });
    }
    getUserDatingProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield this._repository.getUserDatingProfile(userId);
                return profile;
            }
            catch (error) {
                console.error("Error fetching user dating profile:", error);
                throw new Error("Failed to get user dating profile");
            }
        });
    }
    handleDatingTab1(userId, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._repository.findUserById(userId);
                if (user) {
                    return yield this._repository.updateProfile(userId, formData);
                }
                else {
                    return yield this._repository.createProfile(userId, formData);
                }
            }
            catch (error) {
                console.error("Error handling dating tab 1:", error);
                throw new Error("Failed to handle dating tab 1");
            }
        });
    }
    getProfileImages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._repository.findUserById(userId);
                return user ? user.images : null;
            }
            catch (error) {
                console.error("Error fetching profile images:", error);
                throw new Error("Failed to get profile images");
            }
        });
    }
    updateUserPreferences(userId, maximumAge, interestedGender) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Interested Gender:", interestedGender);
                const user = yield this._repository.findUserById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                user.maximumAge = maximumAge;
                user.interestedGender = interestedGender;
                yield this._repository.saveUser(user);
                return user;
            }
            catch (error) {
                console.error("Error updating user preferences:", error);
                throw new Error("Failed to update user preferences");
            }
        });
    }
    getUserSettings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._repository.findUserById(userId);
                console.log(user);
                if (!user) {
                    return null;
                }
                // Define default values if necessary
                return {
                    maximumAge: user.maximumAge || 18,
                    profileVisibility: user.profileVisibility || false,
                    gender: user.interestedGender || 'not specified'
                };
            }
            catch (error) {
                console.error("Error fetching user settings:", error);
                throw new Error("Failed to get user settings");
            }
        });
    }
    getDatingTab1Details(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._repository.findUserById(userId);
                if (!user) {
                    return null;
                }
                // Extract form data from the user profile
                return {
                    name: user.name,
                    age: user.age,
                    bio: user.bio,
                    gender: user.gender
                };
            }
            catch (error) {
                console.error("Error fetching dating tab 1 details:", error);
                throw new Error("Failed to get dating tab 1 details");
            }
        });
    }
    adminDeleteRecord(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._repository.findReportById(id);
            }
            catch (error) {
                console.error("Error fetching adminDeleteRecord:", error);
                throw new Error("Failed to get adminDeleteRecord");
            }
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._repository.deleteComment(commentId);
            }
            catch (error) {
                console.error("Error fetching deleteComment:", error);
                throw new Error("Failed to get deleteComment");
            }
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._repository.deletePost(postId);
            }
            catch (error) {
                console.error("Error fetching deletePost:", error);
                throw new Error("Failed to get deletePost");
            }
        });
    }
    fetchPostComment(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(postId);
                const formattedComments = yield this._repository.fetchPostComment(postId);
                return formattedComments;
            }
            catch (error) {
                console.error("Error fetching fetchPostComment:", error);
                throw new Error("Failed to get fetchPostComment");
            }
        });
    }
    executed(content, userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!content || !userId || !postId) {
                    throw new Error("Content, userId, and postId are required");
                }
                const user = yield this._repository.findUser(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                const postDetails = yield this._repository.findPostById(postId);
                if (!postDetails) {
                    throw new Error("Post not found");
                }
                const newComment = yield this._repository.saveComment({
                    userId,
                    postId,
                    content,
                    replies: []
                });
                const message = `${user.username} commented: ${content}`;
                yield this._repository.createNotification({
                    user: postDetails.userId,
                    interactorId: userId,
                    type: 'comment',
                    message: message
                });
                const repliesWithUserData = yield this._repository.getRepliesWithUserData(newComment._id);
                const formattedReplies = repliesWithUserData.map((reply) => ({
                    _id: reply.replies._id,
                    content: reply.replies.content,
                    createdAt: reply.replies.createdAt,
                    avatar: reply.replies.author.profilePicture,
                    author: reply.replies.author.username
                }));
                return {
                    _id: newComment._id,
                    content: newComment.content,
                    avatar: user.profilePicture,
                    author: user.username,
                    replies: formattedReplies
                };
            }
            catch (error) {
                console.error("Error fetching executed:", error);
                throw new Error("Failed to get executed");
            }
        });
    }
    deleteCommentReply(parentCommentId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._repository.deleteCommentReply(parentCommentId, comment);
                return result;
            }
            catch (error) {
                console.error("Error fetching deleteCommentReply:", error);
                throw new Error("Failed to get deleteCommentReply");
            }
        });
    }
    likedUserDetails(likedUsersId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const LikedUsers = yield this._repository.likedUserDetails(likedUsersId);
                return LikedUsers;
            }
            catch (error) {
                console.error("Error fetching likedUserDetails:", error);
                throw new Error("Failed to get likedUserDetails");
            }
        });
    }
    postAlreadyReported(postId, victimUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingReport = yield this._repository.postAlreadyReported(postId, victimUser);
                return existingReport;
            }
            catch (error) {
                console.error("Error fetching postAlreadyReported:", error);
                throw new Error("Failed to get postAlreadyReported");
            }
        });
    }
    userPostedReply(content, userId, postId, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formattedReply = yield this._repository.userPostedReply(content, userId, postId, parentId);
                return formattedReply;
            }
            catch (error) {
                console.error("Error fetching userPostedReply:", error);
                throw new Error("Failed to get userPostedReply");
            }
        });
    }
    profileCompletionStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profile, isProfileComplete } = yield this._repository.profileCompletionStatus(userId);
                return { profile, isProfileComplete };
            }
            catch (error) {
                console.error("Error fetching profileCompletionStatus:", error);
                throw new Error("Failed to get profileCompletionStatus");
            }
        });
    }
}
exports.DatingUseCase = DatingUseCase;
