"use strict";
// import { IDatingRepository } from "../../infrastructure/repository/DatingRepository";
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
class DatingUseCase {
    constructor(_repository) {
        this._repository = _repository;
    }
    swipeProfiles(userId, maximumAge, interestedGender) {
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
    updateUserPreferences(userId, maximumAge, profileVisibility, interestedGender) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Interested Gender:", interestedGender);
                const user = yield this._repository.findUserById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                user.maximumAge = maximumAge;
                user.profileVisibility = profileVisibility;
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
                console.error("Error fetching adminDeleteRecord:", error);
                throw new Error("Failed to get adminDeleteRecord");
            }
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._repository.deletePost(postId);
            }
            catch (error) {
                console.error("Error fetching adminDeleteRecord:", error);
                throw new Error("Failed to get adminDeleteRecord");
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
                console.error("Error fetching post comments:", error);
                throw new Error("Failed to fetch post comments");
            }
        });
    }
}
exports.DatingUseCase = DatingUseCase;
