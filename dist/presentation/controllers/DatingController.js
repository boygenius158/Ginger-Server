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
exports.DatingController = void 0;
const HttpStatus_1 = require("../../utils/HttpStatus");
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
                    return res.status(400).json({ error: 'User ID is required' });
                }
                const userSettings = yield this._datingUseCase.getUserSettings(userId);
                if (!userSettings) {
                    return res.status(HttpStatus_1.HttpStatus.NOT_FOUND).json({ error: 'User not found' });
                }
                res.status(200).json({ data: userSettings });
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
                    return res.status(400).json({ error: "User ID is required" });
                }
                const formData = yield this._datingUseCase.getDatingTab1Details(userId);
                if (!formData) {
                    return res.status(200).json({ formData });
                    // return res.status(HttpStatus.NOT_FOUND).json({ error: "User not found" });
                }
                return res.status(200).json({ formData });
            }
            catch (error) {
                console.error("Error fetching dating tab 1 details:", error);
                return res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
            }
        });
    }
}
exports.DatingController = DatingController;
