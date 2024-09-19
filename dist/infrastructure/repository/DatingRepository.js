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
class DatingRepository {
    swipeProfiles(userId, maximumAge, interestedGender) {
        return __awaiter(this, void 0, void 0, function* () {
            const profiles = yield DatingProfileMode_1.default.find({
                userId: { $ne: userId }, // Exclude the current user's profile
                profileVisibility: true, // Only fetch profiles that are visible
                age: { $lte: maximumAge || Infinity }, // Apply maximum age filter if provided
                interestedGender: interestedGender || { $exists: true }, // Apply interested gender filter if provided
                likedByUsers: { $ne: userId } // Exclude profiles that the user has already liked
            });
            return profiles;
        });
    }
    updateProfileImages(userId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield DatingProfileMode_1.default.findOne({ userId });
            if (!profile) {
                throw new Error("Profile not found");
            }
            profile.images = url;
            yield profile.save();
            return {};
        });
    }
    fetchMatches(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const matches = yield DatingProfileMode_1.default.find({
                userId: { $ne: userId }, // Exclude the current user's profile
                likedUsers: userId, // The current user has liked these profiles
                likedByUsers: userId // These profiles have also liked the current user
            }).populate('userId');
            return matches;
        });
    }
    getUserDatingProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield DatingProfileMode_1.default.findOne({ userId });
            return profile;
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DatingProfileMode_1.default.findOne({ userId });
        });
    }
    updateProfile(userId, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            return DatingProfileMode_1.default.updateOne({ userId }, {
                $set: {
                    name: formData.name,
                    age: formData.age,
                    bio: formData.bio,
                    gender: formData.gender
                }
            });
        });
    }
    createProfile(userId, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = new DatingProfileMode_1.default({
                userId,
                name: formData.name,
                age: formData.age,
                bio: formData.bio,
                gender: formData.gender
            });
            return profile.save();
        });
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user.save();
        });
    }
}
exports.DatingRepository = DatingRepository;
