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
const UserModel_1 = __importDefault(require("../../infrastructure/database/model/UserModel"));
const DatingProfileMode_1 = __importDefault(require("../../infrastructure/database/model/DatingProfileMode"));
class UserService {
    findEmailWithUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("retreo", userId);
            const user = yield UserModel_1.default.findById(userId);
            const email = user === null || user === void 0 ? void 0 : user.email;
            console.log("email", email);
            return email;
        });
    }
    findUserIdWithEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("retreo", email);
            const user = yield UserModel_1.default.findOne({ email: email });
            const userId = user === null || user === void 0 ? void 0 : user._id;
            console.log("userId", userId);
            return userId;
        });
    }
    findUserDetailsWithEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.default.findOne({ email });
            return user;
        });
    }
    findUserDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.default.findById(userId);
            return user;
        });
    }
    findDatingProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield DatingProfileMode_1.default.findOne({ userId });
            return user;
        });
    }
}
exports.default = new UserService();
