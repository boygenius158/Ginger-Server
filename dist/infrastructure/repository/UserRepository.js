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
exports.UserRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserModel_1 = __importDefault(require("../database/model/UserModel"));
const SearchHistoryModel_1 = __importDefault(require("../database/model/SearchHistoryModel"));
const PostModel_1 = require("../database/model/PostModel");
const PremiumModel_1 = require("../database/model/PremiumModel");
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
class UserRepository {
    addNewUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = user;
                const hashedPassword = password ? yield bcrypt.hash(password, 10) : null;
                const emailPrefix = email.substring(0, 5);
                const randomFiveDigitNumber = Math.floor(1000 + Math.random() * 9000);
                const username = `${emailPrefix}${randomFiveDigitNumber}`;
                const newUser = new UserModel_1.default({
                    email: email,
                    password: hashedPassword,
                    username: username
                });
                const savedUser = yield newUser.save();
                return savedUser;
            }
            catch (error) {
                console.error("Error adding new user:", error);
                throw new Error("Failed to add new user. Please try again later.");
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("email", email);
                const user = yield UserModel_1.default.findOne({ email });
                console.log(user, "8987");
                return user ? user.toObject() : null; // Cast to User interface
            }
            catch (error) {
                console.error("Error finding user by email:", error);
                throw new Error("Failed to find user by email. Please try again later.");
            }
        });
    }
    storeToken(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield UserModel_1.default.findOneAndUpdate({ email: email }, { token: token }, { new: true });
                return updatedUser ? updatedUser.toObject() : null; // Cast to User interface if user is found
            }
            catch (error) {
                console.error("Error storing token:", error);
                throw new Error("Failed to store token. Please try again later.");
            }
        });
    }
    updatePassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.default.findOne({ email });
                if (!user) {
                    throw new Error('User not found');
                }
                const hashedPassword = yield bcrypt.hash(newPassword, 10);
                user.password = hashedPassword;
                const updatedUser = yield user.save();
                return updatedUser.toObject(); // Cast to User interface
            }
            catch (error) {
                console.error("Error updating password:", error);
                throw new Error("Failed to update password. Please try again later.");
            }
        });
    }
    storeotp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.default.findOne({ email });
                if (!user) {
                    throw new Error('User not found');
                }
                user.otp = otp;
                yield user.save();
                return user;
            }
            catch (error) {
                console.error("Error storing OTP:", error);
                throw new Error("Failed to store OTP. Please try again later.");
            }
        });
    }
    verifyotp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.default.findOne({ email });
                console.log("current otp", email);
                if (user && user.otp === otp) {
                    user.isVerified = true;
                    yield user.save();
                    return user;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error("Error verifying OTP:", error);
                throw new Error("Failed to verify OTP. Please try again later.");
            }
        });
    }
    verifyPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.default.findOne({ email });
                if (!user) {
                    throw new Error(`User with email ${email} not found`);
                }
                if (user.isBlocked) {
                    console.log("User is blocked");
                    return "blocked";
                }
                if (!user.isVerified) {
                    console.log("User is not verified");
                    return "unverified";
                }
                const isPasswordValid = yield bcrypt.compare(password, user.password);
                console.log(isPasswordValid, "Password validity check");
                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }
                return user;
            }
            catch (error) {
                console.error("Error verifying password:", error);
                throw new Error("Failed to verify password. Please try again later.");
            }
        });
    }
    clearotp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.default.findOne({ email });
                if (user) {
                    user.otp = null;
                    yield user.save();
                    return user;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error("Error clearing OTP:", error);
                throw new Error("Failed to clear OTP. Please try again later.");
            }
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // return await UserModel.findById(new mongoose.Types.ObjectId(userId));
                const userIdObject = new mongoose_1.default.Types.ObjectId(userId);
                const [userDetails, postCount] = yield Promise.all([
                    UserModel_1.default.findById(userIdObject),
                    PostModel_1.PostModel.countDocuments({ userId: userIdObject })
                ]);
                if (!userDetails) {
                    throw new Error;
                }
                // Return both in a single object
                return Object.assign(Object.assign({}, userDetails.toObject()), { // Spread user details into the object
                    postCount });
            }
            catch (error) {
                console.error("Error finding user by ID:", error);
                throw new Error("Failed to find user by ID. Please try again later.");
            }
        });
    }
    updateProfilePicture(userId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateUser = yield UserModel_1.default.findById(userId);
                if (!updateUser) {
                    throw new Error("User not found");
                }
                updateUser.profilePicture = url;
                console.log(updateUser);
                yield updateUser.save();
                return;
            }
            catch (error) {
                console.error("Error updating profile picture:", error);
                throw new Error("Failed to update profile picture. Please try again later.");
            }
        });
    }
    searchByUsername(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.find({
                    username: { $regex: '^' + query, $options: 'i' }
                });
            }
            catch (error) {
                console.error("Error searching by username:", error);
                throw new Error("Failed to search by username. Please try again later.");
            }
        });
    }
    findOneByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.findOne({ username }).exec();
            }
            catch (error) {
                console.error("Error finding user by username:", error);
                throw new Error("Failed to find user by username. Please try again later.");
            }
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(user);
                let exist = yield UserModel_1.default.findById(user._id || user.id);
                if (!exist) {
                    throw new Error;
                }
                exist.name = user.name,
                    exist.username = user.username;
                exist.bio = user.bio;
                return yield exist.save();
            }
            catch (error) {
                console.error("Error saving user:", error);
                throw new Error("Failed to save user. Please try again later.");
            }
        });
    }
    savePassword(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(user);
                let exist = yield UserModel_1.default.findById(user._id);
                if (!exist) {
                    throw new Error;
                }
                exist.password = password;
                return yield exist.save();
            }
            catch (error) {
                console.error("Error saving user:", error);
                throw new Error("Failed to save user. Please try again later.");
            }
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.findOne(query).exec();
            }
            catch (error) {
                console.error("Error finding one user:", error);
                throw new Error("Failed to find user. Please try again later.");
            }
        });
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield SearchHistoryModel_1.default.find(query).populate('searchedProfileId').exec();
            }
            catch (error) {
                console.error("Error finding search history:", error);
                throw new Error("Failed to find search history. Please try again later.");
            }
        });
    }
    updateUserRoles(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.default.findById(userId);
                if (user) {
                    user.roles = role;
                    yield user.save();
                }
            }
            catch (error) {
                console.error("Error updating user roles:", error);
                throw new Error("Failed to update user roles. Please try again later.");
            }
        });
    }
    saveRole(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.default.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                user.roles = role;
                yield user.save();
                const premium = new PremiumModel_1.PremiumModel({
                    userId,
                    amount: 350
                });
                yield premium.save();
            }
            catch (error) {
                console.error("Error updating user roles:", error);
                throw new Error("Failed to update user roles. Please try again later.");
            }
        });
    }
}
exports.UserRepository = UserRepository;
