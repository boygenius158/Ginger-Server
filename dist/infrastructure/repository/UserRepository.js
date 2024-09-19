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
exports.AuthRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserModel_1 = __importDefault(require("../database/model/UserModel"));
const SearchHistoryModel_1 = __importDefault(require("../database/model/SearchHistoryModel"));
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
class AuthRepository {
    // private readonly userModel: Model<UserModel>;
    // constructor(userModel: Model<UserModel>) {
    //     this.userModel = userModel;
    // }
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
                throw error;
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("emai", email);
                // const user = await UserModel.findOne({ email }).select("_id email password roles");
                // const user = await UserModel.findOne({ email, isVerified: true });
                const user = yield UserModel_1.default.findOne({ email });
                console.log(user, "8987");
                return user ? user.toObject() : null; // Cast to User interface
            }
            catch (error) {
                console.error("Error finding user by email:", error);
                throw error;
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
                throw error;
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
                // Hash the new password using the same method as in addNewUser
                const hashedPassword = yield bcrypt.hash(newPassword, 10);
                // Update the user's password with the hashed password
                user.password = hashedPassword;
                // Save the updated user
                const updatedUser = yield user.save();
                return updatedUser.toObject(); // Cast to User interface
            }
            catch (error) {
                console.error("Error updating password:", error);
                throw error;
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
                console.error("Error updating password:", error);
                throw error;
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
                console.error("Error updating password:", error);
                throw error;
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
                    // throw new Error('User is blocked');
                    console.log("yelp");
                    return false;
                }
                const isPasswordValid = yield bcrypt.compare(password, user.password);
                console.log(isPasswordValid, "adf");
                if (!isPasswordValid) {
                    throw new Error('invalid password');
                }
                return user;
            }
            catch (error) {
                console.error("Error updating password:", error);
                throw error;
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
                console.error("Error updating password:", error);
                throw error;
            }
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserModel_1.default.findById(new mongoose_1.default.Types.ObjectId(userId));
        });
    }
    updateProfilePicture(userId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            user.profilePicture = url;
            return yield user.save();
        });
    }
    searchByUsername(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.default.find({
                username: { $regex: '^' + query, $options: 'i' }
            });
        });
    }
    findOneByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.default.findOne({ username }).exec();
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return user.save();
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.default.findOne(query).exec();
        });
    }
    // async save(entry: any): Promise<any> {
    //     return entry.save();
    // }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return SearchHistoryModel_1.default.find(query).populate('searchedProfileId').exec();
        });
    }
    updateUserRoles(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.default.findById(userId);
            if (user) {
                user.roles = role;
                yield user.save();
            }
        });
    }
}
exports.AuthRepository = AuthRepository;
