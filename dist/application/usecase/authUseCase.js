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
exports.AuthUseCase = void 0;
const nodeMailer_1 = __importDefault(require("../../utils/nodeMailer"));
const tokenGenerator_1 = require("../../utils/tokenGenerator");
class AuthUseCase {
    constructor(repository) {
        this.repository = repository;
        this.mailer = new nodeMailer_1.default();
        this.tokenGenerator = new tokenGenerator_1.TokenGenerator();
    }
    userExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.findUserByEmail(email);
            return user ? user : null;
        });
    }
    verifyPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const verify = yield this.repository.verifyPassword(email, password);
            return verify;
        });
    }
    registerUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.userExists(user.email);
                if (existingUser) {
                    throw new Error("User already exists");
                }
                const registeredUser = yield this.repository.addNewUser(user);
                return registeredUser;
            }
            catch (error) {
                console.error("Error registering user:", error);
                throw error;
            }
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    email,
                    action: 'reset_password',
                };
                const secretKey = 'nibla158';
                const expiresIn = '1h';
                const token = this.tokenGenerator.generateToken(payload, secretKey, expiresIn);
                yield this.mailer.sendVerificationMail(email, token);
                yield this.repository.storeToken(email, token);
                console.log("Generated token:", token);
                return token;
            }
            catch (error) {
                console.error("Error processing forgot password:", error);
                throw error;
            }
        });
    }
    changePassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repository.updatePassword(email, newPassword);
                return null;
            }
            catch (error) {
                console.error("Error processing forgot password:", error);
                throw error;
            }
        });
    }
    getUserRole(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.findUserByEmail(email); // Fetch user from the repository
            if (user) {
                return user.roles;
            }
            return null;
        });
    }
    storeotp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userExists(email);
                if (user) {
                    const store = yield this.repository.storeotp(otp, user.email);
                    console.log(store.otp, "this is store");
                    if (store.otp) {
                        const number = store.otp;
                        yield this.mailer.sendOtpMail(email, number);
                    }
                    else {
                        throw new Error("OTP is undefined");
                    }
                    return store;
                }
                else {
                    // Explicitly handle the case where the user does not exist
                    return null;
                }
            }
            catch (error) {
                console.error("Error storing OTP:", error);
                throw error; // Re-throw the error to be handled by the caller
            }
        });
    }
    verifyotp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verify = yield this.repository.verifyotp(otp, email);
                return verify;
            }
            catch (error) {
                console.error("Error storing OTP:", error);
                throw error; // Re-throw the error to be handled by the caller
            }
        });
    }
    clearotp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.repository.clearotp(email);
                return user;
            }
            catch (error) {
                console.error("Error storing OTP:", error);
                throw error; // Re-throw the error to be handled by the caller
            }
        });
    }
}
exports.AuthUseCase = AuthUseCase;
