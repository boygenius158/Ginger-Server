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
// import { UserModel } from '../../infrastructure/database/model/authModel';
class authController {
    constructor(authUsecase) {
        this.authUsecase = authUsecase;
        this.tokenGenerator = new tokenGenerator_1.TokenGenerator();
    }
    signUpUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const userExists = yield this.authUsecase.userExists(email);
                if (!userExists) {
                    const userData = yield this.authUsecase.registerUser(req.body);
                    return res.json(userData);
                }
                return res.json({ success: false, message: "User already exists" });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authUsecase.userExists(req.body.email);
                if (!user) {
                    return res.status(401).json({ error: "User not found" });
                }
                yield this.authUsecase.verifyPassword(req.body.email, req.body.password);
                return res.json(user);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    googleAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authUsecase.userExists(req.body.email);
                if (user) {
                    return res.json(user);
                }
                else {
                    const newUser = yield this.authUsecase.registerUser(req.body);
                    return res.json(newUser);
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    forgetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authUsecase.userExists(req.body.email);
                if (user) {
                    yield this.authUsecase.forgotPassword(user.email);
                    return res.json({ success: true, message: "Email has been sent" });
                }
                else {
                    return res.json({ success: false, message: "User doesn't exist" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, password } = req.body;
                const secretKey = "nibla158";
                const decodedToken = this.tokenGenerator.verifyToken(token, secretKey);
                if (!decodedToken) {
                    return res.status(401).json({ error: "Invalid or expired token" });
                }
                yield this.authUsecase.changePassword(decodedToken.email, password);
                return res.json({ success: true, message: "Password changed successfully" });
            }
            catch (error) {
                console.error("Error in changePassword:", error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    checkRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("check role", req.body);
                const user = yield this.authUsecase.userExists(req.body.email);
                // console.log(user);
                if (!user) {
                    return res.status(404).json({ success: false, message: "User not found" });
                }
                const userRole = yield this.authUsecase.getUserRole(req.body.email);
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
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    generateotp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const otp = yield (0, randomOTP_1.default)();
                yield this.authUsecase.storeotp(otp, email);
                return res.json({ success: true });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    verifyotp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authUsecase.verifyotp(req.body.otp, req.body.email);
                return res.json({ success: true });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    clearotp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authUsecase.clearotp(req.body.email);
                return res.json({ success: true });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.authController = authController;
