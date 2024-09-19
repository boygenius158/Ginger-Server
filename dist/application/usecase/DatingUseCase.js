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
class DatingUseCase {
    constructor(_repository) {
        this._repository = _repository;
    }
    swipeProfiles(userId, maximumAge, interestedGender) {
        return __awaiter(this, void 0, void 0, function* () {
            const profiles = yield this._repository.swipeProfiles(userId, maximumAge, interestedGender);
            return profiles;
        });
    }
    updateProfileImages(userId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._repository.updateProfileImages(userId, url);
            return {};
        });
    }
    fetchMatches(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const matches = yield this._repository.fetchMatches(userId);
            return matches;
        });
    }
    getUserDatingProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this._repository.getUserDatingProfile(userId);
            return profile;
        });
    }
    handleDatingTab1(userId, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._repository.findUserById(userId);
            if (user) {
                return yield this._repository.updateProfile(userId, formData);
            }
            else {
                return yield this._repository.createProfile(userId, formData);
            }
        });
    }
    getProfileImages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._repository.findUserById(userId);
            return user ? user.images : null;
        });
    }
    updateUserPreferences(userId, maximumAge, profileVisibility) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._repository.findUserById(userId);
            if (!user) {
                return null;
            }
            user.maximumAge = maximumAge;
            user.profileVisibility = profileVisibility;
            yield this._repository.saveUser(user);
            return user;
        });
    }
    getUserSettings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._repository.findUserById(userId);
            console.log(user);
            if (!user) {
                return null;
            }
            // Define default values if necessary
            return {
                maximumAge: user.maximumAge || 18,
                profileVisibility: user.profileVisibility || false,
                gender: user.gender || 'not specified'
            };
        });
    }
    getDatingTab1Details(userId) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.DatingUseCase = DatingUseCase;
