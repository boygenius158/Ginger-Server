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
const DatingProfileMode_1 = __importDefault(require("../database/model/DatingProfileMode"));
// export interface IDatingRepository {
//     swipeProfiles(userId: string, maximumAge: number, interestedGender: string): Promise<any>;
//     updateProfileImages(userId: string, url: string[]): Promise<any>;
//     fetchMatches(userId: string): Promise<any>;
//     getUserDatingProfile(userId: string): Promise<any>;
//     findUserById(userId: string): Promise<any>;
//     updateProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
//     createProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
//     saveUser(user: any): Promise<any>;
// }
class DatingRepository {
    swipeProfiles(userId, maximumAge, interestedGender) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userId, maximumAge, interestedGender, "maximumage");
            try {
                const profiles = yield DatingProfileMode_1.default.find({
                    userId: { $ne: userId },
                    profileVisibility: true,
                    age: { $lte: maximumAge },
                    gender: interestedGender,
                    likedByUsers: { $ne: userId }
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
}
exports.DatingRepository = DatingRepository;
