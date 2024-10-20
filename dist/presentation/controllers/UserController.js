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
exports.authController = void 0;
const tokenGenerator_1 = require("../../utils/tokenGenerator");
const randomOTP_1 = __importDefault(require("../../utils/randomOTP"));
const User_1 = require("../../domain/entities/User");
const HttpStatus_1 = require("../../utils/HttpStatus");
// import { UserModel } from '../../infrastructure/database/model/authModel';
class authController {
    constructor(authUsecase) {
        this._authUsecase = authUsecase;
        this._tokenGenerator = new tokenGenerator_1.TokenGenerator();
    }
    signUpUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const userExists = yield this._authUsecase.userExists(email);
                if (!userExists) {
                    const userData = yield this._authUsecase.registerUser(req.body);
                    console.log(userData, "990099");
                    return res.json(userData);
                }
                return res.json({ success: false, message: "User already exists" });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._authUsecase.userExists(req.body.email);
                if (!user) {
                    return res.status(HttpStatus_1.HttpStatus.UNAUTHORIZED).json({ error: "User not found" });
                }
                // console.log(user,"{{{");
                const user2 = yield this._authUsecase.verifyPassword(req.body.email, req.body.password);
                // console.log("user",user2);
                console.log(user2, "popo");
                return res.json(user2);
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    googleAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._authUsecase.userExists(req.body.email);
                if (user) {
                    return res.json(user);
                }
                else {
                    console.log("0099");
                    const newUser = yield this._authUsecase.registerUser(req.body);
                    return res.json(newUser);
                }
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    forgetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._authUsecase.userExists(req.body.email);
                if (user) {
                    yield this._authUsecase.forgotPassword(user.email);
                    return res.json({ success: true, message: "Email has been sent" });
                }
                else {
                    return res.json({ success: false, message: "User doesn't exist" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, password } = req.body;
                const secretKey = "nibla158";
                console.log(req.body);
                const decodedToken = this._tokenGenerator.verifyToken(token, secretKey);
                if (!decodedToken) {
                    return res.status(HttpStatus_1.HttpStatus.UNAUTHORIZED).json({ error: "Invalid or expired token" });
                }
                yield this._authUsecase.changePassword(decodedToken.email, password);
                return res.json({ success: true, message: "Password changed successfully" });
            }
            catch (error) {
                console.error("Error in changePassword:", error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    checkRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("check role", req.body);
                const user = yield this._authUsecase.userExists(req.body.email);
                // console.log(user);
                if (!user) {
                    return res.status(HttpStatus_1.HttpStatus.NOT_FOUND).json({ success: false, message: "User not found" });
                }
                const userRole = yield this._authUsecase.getUserRole(req.body.email);
                console.log("Ds", userRole, "sd");
                if (userRole) {
                    return res.json({ success: true, role: userRole });
                }
                else {
                    return res.status(403).json({ success: false, message: "User does not have a role" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    generateotp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const otp = yield (0, randomOTP_1.default)();
                yield this._authUsecase.storeotp(otp, email);
                return res.json({ success: true });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    verifyotp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const valid = yield this._authUsecase.verifyotp(req.body.otp, req.body.email);
                if (valid) {
                    return res.json({ success: true });
                }
                else {
                    return res.json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    clearotp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._authUsecase.clearotp(req.body.email);
                return res.json({ success: true });
            }
            catch (error) {
                console.log(error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        });
    }
    uploadProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { url, userId } = req.body;
                const updatedUser = yield this._authUsecase.uploadProfilePicture(userId, url);
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error("Error uploading profile picture:", error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
            }
        });
    }
    searchUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchQuery = req.query.searchQuery;
                if (!searchQuery) {
                    res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Search query is required" });
                }
                const users = yield this._authUsecase.searchUsers(searchQuery);
                res.json({ users });
            }
            catch (error) {
                console.error("Error searching users:", error);
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
            }
        });
    }
    fetchNameUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._authUsecase.getUserById(req.body.id);
                if (!user) {
                    res.status(HttpStatus_1.HttpStatus.NOT_FOUND).json({ error: 'User not found' });
                }
                else {
                    res.json({ user });
                }
            }
            catch (error) {
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    hasPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                const result = yield this._authUsecase.hasPassword(id);
                res.json(result);
            }
            catch (error) {
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name, username, bio } = req.body;
                // console.log(req.body);
                const result = yield this._authUsecase.updateUser(id, name, username, bio);
                if (result.success === false) {
                    res.json(result);
                }
                else {
                    res.json({ success: true, user: result });
                }
            }
            catch (error) {
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, currentPassword, newPassword } = req.body;
                const result = yield this._authUsecase.updatePassword(id, currentPassword, newPassword);
                res.json(result);
            }
            catch (error) {
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    miniProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._authUsecase.getMiniProfile(req.body.id);
                res.json({ user });
            }
            catch (error) {
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    saveUserToSearchHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._authUsecase.saveUserToSearchHistory(req.body.userId, req.body.key);
                res.json(result);
            }
            catch (error) {
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    getRecentSearches(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searches = yield this._authUsecase.getRecentSearches(req.body.userId);
                res.json({ searches });
            }
            catch (error) {
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    premiumPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._authUsecase.handlePremiumPayment(req.body.userId);
                res.json({ message: 'Premium payment recorded' });
            }
            catch (error) {
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    customBackendSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("req.body.emali", req.body.email);
                const user = yield this._authUsecase.findUserByEmail(req.body.email);
                console.log("userrT", user);
                res.json({ user });
            }
            catch (error) {
                res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
            }
        });
    }
    createPaymentIntent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, userId, currency = 'usd' } = req.body;
            try {
                const clientSecret = yield this._authUsecase.createPaymentIntent(amount, currency);
                // Assume premium role for the user
                yield this._authUsecase.updateUserRole(userId, User_1.UserRole.Premium);
                res.send({ clientSecret });
            }
            catch (error) {
                console.error(error);
                res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).send({ error: 'Error creating payment intent' });
            }
        });
    }
}
exports.authController = authController;
