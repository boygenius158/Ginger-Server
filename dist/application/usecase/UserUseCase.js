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
const SearchHistoryModel_1 = __importDefault(require("../../infrastructure/database/model/SearchHistoryModel"));
const PremiumModel_1 = require("../../infrastructure/database/model/PremiumModel");
const Stripe = require('stripe');
const stripeClient = Stripe('sk_test_51PirppRr9XEd7LoYrVRdZGs1hNtVrylVeCidygk60qvoe1h23IPqRE0vDD7Zltc4XuSBLA7jlHofNHyGlnwmzxKP00zS0tmxlX'); // Replace with your Stripe secret key
// const stripeClient = Stripe(process.env.STRIPE_SECRET_KEY)
const bcrypt = require('bcryptjs');
class AuthUseCase {
    constructor(_repository) {
        this._repository = _repository;
        this.mailer = new nodeMailer_1.default();
        this.tokenGenerator = new tokenGenerator_1.TokenGenerator();
    }
    userExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._repository.findUserByEmail(email);
            return user ? user : null;
        });
    }
    verifyPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const verify = yield this._repository.verifyPassword(email, password);
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
                const registeredUser = yield this._repository.addNewUser(user);
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
                yield this._repository.storeToken(email, token);
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
                yield this._repository.updatePassword(email, newPassword);
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
            const user = yield this._repository.findUserByEmail(email); // Fetch user from the _repository
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
                    const store = yield this._repository.storeotp(otp, user.email);
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
                const verify = yield this._repository.verifyotp(otp, email);
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
                const user = yield this._repository.clearotp(email);
                return user;
            }
            catch (error) {
                console.error("Error storing OTP:", error);
                throw error; // Re-throw the error to be handled by the caller
            }
        });
    }
    uploadProfilePicture(userId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._repository.updateProfilePicture(userId, url);
        });
    }
    searchUsers(searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._repository.searchByUsername(searchQuery);
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._repository.findById(id);
        });
    }
    hasPassword(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._repository.findById(id);
            if (!user)
                throw new Error('User not found');
            if (user.password === null || user.password === undefined) {
                return { hasPassword: false, message: 'Password is not set' };
            }
            return { hasPassword: true, message: 'Password is set' };
        });
    }
    updateUser(id, name, username, bio) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._repository.findById(id);
            if (!user)
                throw new Error('User not found');
            if (username && username !== user.username) {
                const existingUser = yield this._repository.findOneByUsername(username);
                if (existingUser) {
                    return { success: false };
                }
            }
            user.name = name || user.name;
            user.username = username || user.username;
            user.bio = bio || user.bio;
            return this._repository.save(user);
        });
    }
    updatePassword(id, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._repository.findById(id);
            if (!user)
                throw new Error('User not found');
            if (!user.password && !currentPassword) {
                const salt = yield bcrypt.genSalt(10);
                const hashedPassword = yield bcrypt.hash(newPassword, salt);
                user.password = hashedPassword;
                yield this._repository.save(user);
                return { success: true, message: 'Password set successfully' };
            }
            if (user.password && currentPassword) {
                const isMatch = yield bcrypt.compare(currentPassword, user.password);
                if (!isMatch) {
                    return { success: false, message: 'Current password is incorrect' };
                }
                const salt = yield bcrypt.genSalt(10);
                const hashedPassword = yield bcrypt.hash(newPassword, salt);
                user.password = hashedPassword;
                yield this._repository.save(user);
                return { success: true, message: 'Password updated successfully' };
            }
            throw new Error('Invalid request: Missing current or new password');
        });
    }
    getMiniProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._repository.findById(id);
        });
    }
    saveUserToSearchHistory(userId, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingEntry = yield this._repository.findOne({
                userId: userId,
                searchedProfileId: key._id
            });
            if (existingEntry) {
                return { message: "Entry already exists" };
            }
            const searchHistory = new SearchHistoryModel_1.default({
                userId: userId,
                searchedProfileId: key._id
            });
            yield this._repository.save(searchHistory);
            return { message: "Search history saved" };
        });
    }
    getRecentSearches(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Perform the query and populate the results
            return this._repository.find({ userId });
        });
    }
    handlePremiumPayment(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const premium = new PremiumModel_1.PremiumModel({
                userId,
                amount: 350
            });
            yield this._repository.save(premium);
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("987777");
            return this._repository.findOne({ email });
        });
    }
    createPaymentIntent(amount_1) {
        return __awaiter(this, arguments, void 0, function* (amount, currency = 'usd') {
            const paymentIntent = yield stripeClient.paymentIntents.create({
                amount,
                currency,
            });
            return paymentIntent.client_secret;
        });
    }
    updateUserRole(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._repository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            user.roles = role; // role should be of type UserRole
            yield this._repository.save(user);
        });
    }
}
exports.AuthUseCase = AuthUseCase;
