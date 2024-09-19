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
const DatingProfileMode_1 = __importDefault(require("../../infrastructure/database/model/DatingProfileMode"));
class MatchService {
    // Check if there is a mutual match between two users
    checkMatch(userId1, userId2) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find both users
            const user1 = yield DatingProfileMode_1.default.findOne({ userId: userId1 }).populate('likedUsers').exec();
            const user2 = yield DatingProfileMode_1.default.findOne({ userId: userId2 }).populate('likedUsers').exec();
            // If either user is not found, return false
            if (!user1 || !user2) {
                return false;
            }
            // Check if user1 has liked user2 and if user2 has liked user1
            const user1LikesUser2 = user1.likedUsers.some(like => like._id.equals(userId2));
            const user2LikesUser1 = user2.likedUsers.some(like => like._id.equals(userId1));
            return user1LikesUser2 && user2LikesUser1;
        });
    }
    // Handle the swipe action
    handleSwipe(userId, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the user who is swiping
            console.log(userId, "[][][");
            const user = yield DatingProfileMode_1.default.findOne({ userId }).exec();
            const user2 = yield DatingProfileMode_1.default.findOne({ userId: targetUserId }).exec();
            // If user is not found, throw an error
            if (!user) {
                throw new Error('User not found');
            }
            // Add targetUserId to likedUsers if not already present
            if (!user.likedUsers.includes(targetUserId)) {
                user.likedUsers.push(targetUserId);
                yield user.save();
                if (!(user2 === null || user2 === void 0 ? void 0 : user2.likedByUsers.includes(userId))) {
                    user2 === null || user2 === void 0 ? void 0 : user2.likedByUsers.push(userId);
                    yield (user2 === null || user2 === void 0 ? void 0 : user2.save());
                }
            }
            // Check if the swipe results in a match
            return this.checkMatch(userId, targetUserId);
        });
    }
}
exports.default = new MatchService();
